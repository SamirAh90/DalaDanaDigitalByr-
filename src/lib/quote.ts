import { addonOptions, packageRules, pricingConfig } from "../content/pricing";
import type { AddonId, PackageId } from "../content/pricing";

export type QuoteSelection =
  | { version: 1; kind: "calculator"; pages: number; addonIds: AddonId[] }
  | { version: 1; kind: "package"; packageId: PackageId; addonIds: AddonId[] }
  | { version: 1; kind: "seo" };

export type QuoteCalculation = {
  label: string;
  pages: number | null;
  items: { id: string; label: string; amount: number }[];
  totalExVat: number | null;
  vat: number | null;
  totalIncVat: number | null;
  priceRange?: { min: number; max: number };
};

export const defaultQuote: Extract<QuoteSelection, { kind: "calculator" }> = {
  version: 1,
  kind: "calculator",
  pages: pricingConfig.includedPages,
  addonIds: [],
};

export const QUOTE_STORAGE_KEY = "daladana.quote.v1";
const addonIds = new Set<string>(addonOptions.map((addon) => addon.id));

/** Accept only known identifiers and sensible ranges; strip all supplied totals/extra fields. */
export function validateQuoteSelection(input: unknown): QuoteSelection | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (value["version"] !== 1) return null;
  if (value["kind"] === "seo") return { version: 1, kind: "seo" };
  if (!Array.isArray(value["addonIds"]) || value["addonIds"].length > addonOptions.length)
    return null;
  const selected: AddonId[] = [];
  for (const id of value["addonIds"]) {
    if (typeof id !== "string" || !addonIds.has(id) || selected.includes(id as AddonId))
      return null;
    selected.push(id as AddonId);
  }
  if (value["kind"] === "calculator") {
    const pages = value["pages"];
    if (
      typeof pages !== "number" ||
      !Number.isInteger(pages) ||
      pages < pricingConfig.includedPages ||
      pages > pricingConfig.maxPages
    )
      return null;
    return { version: 1, kind: "calculator", pages, addonIds: selected };
  }
  if (value["kind"] === "package") {
    const packageId = value["packageId"];
    if (typeof packageId !== "string" || !Object.hasOwn(packageRules, packageId)) return null;
    const id = packageId as PackageId;
    // Included features must never be charged a second time.
    return {
      version: 1,
      kind: "package",
      packageId: id,
      addonIds: selected.filter((addonId) => !packageRules[id].includedAddonIds.includes(addonId)),
    };
  }
  return null;
}

/** Recalculate using trusted rules on both the client and server. */
export function calculateQuote(input: QuoteSelection): QuoteCalculation {
  const selection = validateQuoteSelection(input);
  if (!selection) throw new Error("Ogiltiga offertval.");
  if (selection.kind === "seo") {
    return {
      label: "SEO – omfattning enligt offert",
      pages: null,
      items: [],
      totalExVat: null,
      vat: null,
      totalIncVat: null,
      priceRange: { min: pricingConfig.seo.minPrice, max: pricingConfig.seo.maxPrice },
    };
  }
  const packageRule = selection.kind === "package" ? packageRules[selection.packageId] : null;
  const label = packageRule ? `Paket ${packageRule.name}` : "Skräddarsydd hemsida";
  const items: QuoteCalculation["items"] = [
    {
      id: selection.kind === "package" ? selection.packageId : "base",
      label: packageRule ? `Paket ${packageRule.name}` : "Grundpaket",
      amount:
        selection.kind === "package"
          ? pricingConfig.packagePrices[selection.packageId]
          : pricingConfig.basePrice,
    },
  ];
  if (selection.kind === "calculator" && selection.pages > pricingConfig.includedPages) {
    items.push({
      id: "pages",
      label: `${selection.pages - pricingConfig.includedPages} extra sidor`,
      amount: (selection.pages - pricingConfig.includedPages) * pricingConfig.extraPagePrice,
    });
  }
  for (const addon of addonOptions) {
    if (selection.addonIds.includes(addon.id))
      items.push({ id: addon.id, label: addon.title, amount: addon.amount });
  }
  // Work in öre so 25% VAT is kept, e.g. 2 995 => 3 743,75, not 3 744.
  const netOre = items.reduce((sum, item) => sum + Math.round(item.amount * 100), 0);
  const vatOre = Math.round(netOre * pricingConfig.vatRate);
  return {
    label,
    pages: selection.kind === "calculator" ? selection.pages : packageRule!.pages,
    items,
    totalExVat: netOre / 100,
    vat: vatOre / 100,
    totalIncVat: (netOre + vatOre) / 100,
  };
}

export function encodeQuoteSelection(input: QuoteSelection): string {
  const selection = validateQuoteSelection(input);
  if (!selection) throw new Error("Ogiltiga offertval.");
  return JSON.stringify(selection);
}

export function decodeQuoteSelection(value: unknown): QuoteSelection | null {
  if (typeof value !== "string" || value.length > 2000) return null;
  try {
    return validateQuoteSelection(JSON.parse(value));
  } catch {
    return null;
  }
}

export function quoteSearchValidator(search: Record<string, unknown>): { quote?: string } {
  const selection = decodeQuoteSelection(search["quote"]);
  return selection ? { quote: encodeQuoteSelection(selection) } : {};
}

/** Session storage is for non-personal quote choices only; denied storage is non-fatal. */
export function readStoredQuote(): QuoteSelection | null {
  if (typeof window === "undefined") return null;
  try {
    return decodeQuoteSelection(window.sessionStorage.getItem(QUOTE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeStoredQuote(selection: QuoteSelection): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(QUOTE_STORAGE_KEY, encodeQuoteSelection(selection));
  } catch {
    /* Private browsing may disable storage. */
  }
}
