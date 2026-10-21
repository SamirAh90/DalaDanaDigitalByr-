import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { describe, test } from "node:test";
import { createEnquiryHandler } from "./enquiry.server";
import { pricingConfig } from "../content/pricing";

const now = 1800000000000;
const config = {
  apiKey: "unit-test-not-a-real-key",
  from: "sender@example.test",
  to: "owner@example.test",
};
const enquiry = (overrides: Record<string, unknown> = {}) => ({
  requestId: randomUUID(),
  source: "contact",
  name: "Test Person",
  company: "Test",
  email: "visitor@example.test",
  phone: "",
  service: "",
  message: "Det här är ett test av en förfrågan.",
  website: "",
  startedAt: now - 5000,
  quote: null,
  ...overrides,
});

describe("server enquiries (mock transport only, never sends mail)", () => {
  test("success requires an acknowledged provider receipt and quote is recalculated", async () => {
    let body: Record<string, unknown> = {};
    let headers = new Headers();
    const transport: typeof fetch = async (_url, options) => {
      body = JSON.parse(String(options?.body)) as Record<string, unknown>;
      headers = new Headers(options?.headers);
      return Response.json({ id: "mock-receipt" });
    };
    const handler = createEnquiryHandler({ config, fetch: transport, now: () => now });
    const result = await handler(
      enquiry({ quote: { version: 1, kind: "calculator", pages: 3, addonIds: ["cms"], total: 1 } }),
    );
    assert.equal(result.ok, true);
    assert.equal(body["reply_to"], "visitor@example.test");
    assert.deepEqual(body["to"], [config.to]);
    assert.match(headers.get("Idempotency-Key") ?? "", /^enquiry\//);
    const text = String(body["text"]).replaceAll("\u00a0", " ");
    const total = new Intl.NumberFormat("sv-SE")
      .format(pricingConfig.basePrice + pricingConfig.adminPrice)
      .replaceAll("\u00a0", " ");
    assert.ok(text.includes(total), "total uses trusted pricing rules, not URL total");
    assert.match(text, /Antal sidor: 3/);
    assert.match(text, /CMS & adminpanel/);
    assert.match(text, /Moms 25 %/);
  });

  test("missing configuration honestly fails without touching the transport", async () => {
    const handler = createEnquiryHandler({
      config: null,
      now: () => now,
      fetch: async () => {
        throw new Error("must not call");
      },
    });
    const result = await handler(enquiry());
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "unavailable");
  });

  test("provider rejection, malformed receipt and network failure never report success", async () => {
    const transports: (typeof fetch)[] = [
      async () => Response.json({ error: "rejected" }, { status: 422 }),
      async () => Response.json({}),
      async () => {
        throw new Error("offline");
      },
    ];
    for (const transport of transports) {
      const result = await createEnquiryHandler({ config, fetch: transport, now: () => now })(
        enquiry(),
      );
      assert.equal(result.ok, false);
      if (!result.ok) assert.equal(result.code, "delivery");
    }
  });

  test("transport receives an abort signal that limits a stalled provider", async () => {
    const transport: typeof fetch = async (_url, options) => {
      await new Promise<void>((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => reject(new Error("timeout")), {
          once: true,
        });
        // A referenced timer keeps node:test alive until AbortSignal.timeout fires.
        setTimeout(() => reject(new Error("test timeout guard")), 30);
      });
      return Response.json({ id: "unreachable" });
    };
    const result = await createEnquiryHandler({
      config,
      fetch: transport,
      now: () => now,
      timeoutMs: 5,
    })(enquiry());
    assert.equal(result.ok, false);
  });

  test("validates email, bounds, stable quote IDs, honeypot and timing before delivery", async () => {
    let sent = 0;
    const handler = createEnquiryHandler({
      config,
      now: () => now,
      fetch: async () => {
        sent++;
        return Response.json({ id: "mock" });
      },
    });
    const bad = [
      enquiry({ email: "invalid" }),
      enquiry({ message: "x".repeat(5001) }),
      enquiry({ quote: { version: 1, kind: "calculator", pages: 3, addonIds: ["unrecognised"] } }),
      enquiry({ website: "https://spam.invalid" }),
      enquiry({ startedAt: now }),
    ];
    for (const input of bad) assert.equal((await handler(input)).ok, false);
    assert.equal(sent, 0);
  });

  test("concurrent and repeated identical submissions deliver only once", async () => {
    let calls = 0;
    const handler = createEnquiryHandler({
      config,
      now: () => now,
      fetch: async () => {
        calls++;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return Response.json({ id: "mock" });
      },
    });
    const input = enquiry();
    const results = await Promise.all([handler(input), handler(input)]);
    assert.equal(
      results.every((result) => result.ok),
      true,
    );
    assert.equal((await handler(input)).ok, true);
    assert.equal(calls, 1);
    const changed = await handler({
      ...input,
      message: "Ett annat meddelande med samma inskicks-ID.",
    });
    assert.equal(changed.ok, false);
    if (!changed.ok) assert.equal(changed.code, "conflict");
  });

  test("a failed delivery may retry with the same provider idempotency key", async () => {
    let calls = 0;
    const keys: (string | null)[] = [];
    const handler = createEnquiryHandler({
      config,
      now: () => now,
      fetch: async (_url, options) => {
        keys.push(new Headers(options?.headers).get("Idempotency-Key"));
        calls++;
        return calls === 1 ? new Response("", { status: 503 }) : Response.json({ id: "mock" });
      },
    });
    const input = enquiry();
    assert.equal((await handler(input)).ok, false);
    assert.equal((await handler(input)).ok, true);
    assert.equal(keys[0], keys[1]);
  });

  test("limits repeated distinct enquiries and expires the rate window", async () => {
    let time = now;
    const handler = createEnquiryHandler({
      config,
      now: () => time,
      fetch: async () => Response.json({ id: "mock" }),
    });
    for (let i = 0; i < 3; i++) assert.equal((await handler(enquiry())).ok, true);
    const limited = await handler(enquiry());
    assert.equal(limited.ok, false);
    if (!limited.ok) assert.equal(limited.code, "rate_limit");
    time += 16 * 60 * 1000;
    assert.equal((await handler(enquiry({ startedAt: time - 5000 }))).ok, true);
  });
});
