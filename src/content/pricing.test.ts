import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { addonOptions, formatSek, pricingConfig, startingPrice } from "./pricing";
import {
  calculateQuote,
  decodeQuoteSelection,
  defaultQuote,
  encodeQuoteSelection,
  quoteSearchValidator,
  readStoredQuote,
  validateQuoteSelection,
  writeStoredQuote,
  QUOTE_STORAGE_KEY,
} from "../lib/quote";

describe("Shared pricing rules", () => {
  test("keeps the lowest price distinct from Starter", () => {
    assert.equal(pricingConfig.basePrice, 2995);
    assert.equal(pricingConfig.packagePrices.mini, 2995);
    assert.equal(pricingConfig.packagePrices.starter, 4995);
    assert.match(startingPrice.replaceAll("\u00a0", " "), /^Från 2 995 kr exkl\. moms$/);
  });

  test("uses the same CMS price as the package add-on", () => {
    assert.equal(addonOptions.find((addon) => addon.id === "cms")?.amount, 1495);
    assert.equal(pricingConfig.adminPrice, 1495);
  });

  test("keeps the maintenance prices shared", () => {
    assert.deepEqual(pricingConfig.maintenancePrices, {
      bas: 180,
      standard: 250,
      pro: 450,
    });
  });

  test("retains öre in VAT and Swedish display", () => {
    const quote = calculateQuote(defaultQuote);
    assert.equal(quote.totalExVat, 2995);
    assert.equal(quote.vat, 748.75);
    assert.equal(quote.totalIncVat, 3743.75);
    assert.equal(formatSek(quote.totalIncVat!).replaceAll("\u00a0", " "), "3 743,75 kr");
  });

  test("calculates extra pages and stable add-on ids numerically", () => {
    const quote = calculateQuote({
      version: 1,
      kind: "calculator",
      pages: 5,
      addonIds: ["cms", "brand"],
    });
    assert.equal(quote.totalExVat, 6475);
    assert.equal(quote.vat, 1618.75);
    assert.equal(quote.totalIncVat, 8093.75);
    assert.deepEqual(
      quote.items.map((item) => item.id),
      ["base", "pages", "brand", "cms"],
    );
  });

  test("keeps Premium CMS included and does not charge included features twice", () => {
    const selection = validateQuoteSelection({
      version: 1,
      kind: "package",
      packageId: "premium",
      addonIds: ["cms", "webshop", "seo"],
    });
    assert.deepEqual(selection, {
      version: 1,
      kind: "package",
      packageId: "premium",
      addonIds: [],
    });
    const quote = calculateQuote(selection!);
    assert.equal(quote.totalExVat, 16995);
    assert.equal(quote.pages, null);
  });

  test("adds the separately selected CMS to Starter", () => {
    const quote = calculateQuote({
      version: 1,
      kind: "package",
      packageId: "starter",
      addonIds: ["cms"],
    });
    assert.equal(quote.totalExVat, 6490);
    assert.equal(quote.pages, 5);
  });

  test("standalone SEO is an estimate range, not a fabricated fixed quote", () => {
    const quote = calculateQuote({ version: 1, kind: "seo" });
    assert.deepEqual(quote.priceRange, { min: 795, max: 1500 });
    assert.equal(quote.totalExVat, null);
    assert.equal(quote.totalIncVat, null);
  });
});

describe("Quote transfer and validation", () => {
  test("round-trips a calculator selection through a contact URL", () => {
    const selection = {
      version: 1,
      kind: "calculator",
      pages: 8,
      addonIds: ["cms", "languages"],
    } as const;
    const valid = validateQuoteSelection(selection)!;
    const url = new URL("https://example.test/kontakt");
    url.searchParams.set("quote", encodeQuoteSelection(valid));
    assert.deepEqual(decodeQuoteSelection(url.searchParams.get("quote")), valid);
    assert.equal(
      calculateQuote(decodeQuoteSelection(url.searchParams.get("quote"))!).totalExVat,
      8460,
    );
  });

  test("preserves package selection and standalone SEO", () => {
    for (const input of [
      { version: 1, kind: "package", packageId: "business", addonIds: ["cms"] },
      { version: 1, kind: "seo" },
    ]) {
      const selection = validateQuoteSelection(input)!;
      assert.deepEqual(decodeQuoteSelection(encodeQuoteSelection(selection)), selection);
    }
  });

  test("never trusts manipulated totals or carries personal information into URLs", () => {
    const selection = validateQuoteSelection({
      ...defaultQuote,
      totalExVat: 1,
      email: "private@example.test",
      message: "private text",
    })!;
    const encoded = encodeQuoteSelection(selection);
    assert.equal(calculateQuote(selection).totalExVat, 2995);
    assert.ok(!encoded.includes("private"));
    assert.ok(!encoded.includes("totalExVat"));
  });

  test("rejects fractional, missing and out-of-range pages", () => {
    for (const pages of [0, 2, 3.5, 16, -1, Infinity, "5", undefined]) {
      assert.equal(validateQuoteSelection({ ...defaultQuote, pages }), null);
    }
    assert.ok(validateQuoteSelection({ ...defaultQuote, pages: 15 }));
  });

  test("rejects unknown and duplicate add-ons, obsolete versions and unknown packages", () => {
    assert.equal(validateQuoteSelection({ ...defaultQuote, addonIds: ["not-an-addon"] }), null);
    assert.equal(validateQuoteSelection({ ...defaultQuote, addonIds: ["cms", "cms"] }), null);
    assert.equal(validateQuoteSelection({ ...defaultQuote, addonIds: "cms" }), null);
    assert.equal(validateQuoteSelection({ ...defaultQuote, version: 0 }), null);
    assert.equal(
      validateQuoteSelection({ version: 1, kind: "package", packageId: "__proto__", addonIds: [] }),
      null,
    );
  });

  test("rejects malformed/oversized URLs and validates router search", () => {
    for (const value of ["{", "null", "[]", "x".repeat(2001), 3, undefined])
      assert.equal(decodeQuoteSelection(value), null);
    assert.deepEqual(quoteSearchValidator({ quote: "invalid" }), {});
    assert.deepEqual(
      quoteSearchValidator({ quote: encodeQuoteSelection(defaultQuote), total: "1" }),
      { quote: encodeQuoteSelection(defaultQuote) },
    );
  });

  test("saves only validated choices for reload/back and tolerates disabled storage", () => {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const values = new Map<string, string>();
    try {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: {
          sessionStorage: {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => values.set(key, value),
          },
        },
      });
      writeStoredQuote({ version: 1, kind: "calculator", pages: 7, addonIds: ["booking"] });
      assert.deepEqual(readStoredQuote(), {
        version: 1,
        kind: "calculator",
        pages: 7,
        addonIds: ["booking"],
      });
      values.set(QUOTE_STORAGE_KEY, '{"version":1,"kind":"calculator","pages":-99,"addonIds":[]}');
      assert.equal(readStoredQuote(), null);
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: {
          get sessionStorage() {
            throw new Error("Denied");
          },
        },
      });
      assert.doesNotThrow(() => writeStoredQuote(defaultQuote));
      assert.equal(readStoredQuote(), null);
    } finally {
      if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });
});
