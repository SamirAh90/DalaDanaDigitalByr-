import { createHmac } from "node:crypto";
import { z } from "zod";
import { enquirySchema } from "../lib/enquiry";
import type { EnquiryResult } from "../lib/enquiry";
import { calculateQuote, validateQuoteSelection } from "../lib/quote";
import { formatSek } from "../content/pricing";

type MailConfig = { apiKey: string; from: string; to: string };
type Dependencies = {
  config?: MailConfig | null;
  fetch?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
};
type RateEntry = { count: number; until: number };
type DeliveryEntry = { digest: string; until: number; result: Promise<EnquiryResult> };
const WINDOW_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 5000;
const success: EnquiryResult = {
  ok: true,
  message: "Din förfrågan har skickats. Samir återkommer för att prata om nästa steg.",
};
const deliveryFailure: EnquiryResult = {
  ok: false,
  code: "delivery",
  message:
    "Förfrågan kunde inte bekräftas av e-posttjänsten. Din text finns kvar. Försök igen om en stund eller ring.",
};

function configuration(): MailConfig | null {
  const apiKey = process.env["RESEND_API_KEY"]?.trim();
  const from = process.env["ENQUIRY_FROM_EMAIL"]?.trim();
  const to = process.env["ENQUIRY_TO_EMAIL"]?.trim();
  // Explicit addresses avoid silently using invented/test recipients in production.
  if (
    !apiKey ||
    !from ||
    !to ||
    !z.string().email().safeParse(from).success ||
    !z.string().email().safeParse(to).success
  )
    return null;
  return { apiKey, from, to };
}

/** In-memory protection for one Node process. Add proxy/WAF limits across replicas. */
export function createEnquiryHandler(dependencies: Dependencies = {}) {
  const rates = new Map<string, RateEntry>();
  const deliveries = new Map<string, DeliveryEntry>();
  let globalRate: RateEntry = { count: 0, until: 0 };

  return async function handle(input: unknown): Promise<EnquiryResult> {
    const parsed = enquirySchema.safeParse(input);
    if (!parsed.success)
      return {
        ok: false,
        code: "validation",
        message: "Kontrollera namn, e-post och meddelande (10–5 000 tecken) och försök igen.",
      };
    const data = parsed.data;
    const now = (dependencies.now ?? Date.now)();
    if (data.website || now - data.startedAt < 2000 || now - data.startedAt > DAY_MS) {
      return {
        ok: false,
        code: "spam",
        message:
          "Förfrågan kunde inte godkännas. Vänta några sekunder och försök igen, eller ladda om sidan om den varit öppen länge.",
      };
    }
    const quote =
      data.quote === undefined || data.quote === null ? null : validateQuoteSelection(data.quote);
    if (data.quote != null && !quote)
      return {
        ok: false,
        code: "validation",
        message: "Offertvalen är ogiltiga. Välj dem på nytt i priskalkylatorn.",
      };
    const config = dependencies.config === undefined ? configuration() : dependencies.config;
    if (!config)
      return {
        ok: false,
        code: "unavailable",
        message:
          "Formuläret är inte aktiverat ännu. Inget har skickats. Din text finns kvar; kontakta Samir via telefon under tiden.",
      };

    const fingerprint = (value: string) =>
      createHmac("sha256", config.apiKey).update(value).digest("hex");
    const digest = fingerprint(
      JSON.stringify({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        source: data.source,
        quote,
      }),
    );
    for (const [key, entry] of deliveries) if (entry.until <= now) deliveries.delete(key);
    for (const [key, entry] of rates) if (entry.until <= now) rates.delete(key);
    const existing = deliveries.get(data.requestId);
    if (existing) {
      if (existing.digest !== digest)
        return {
          ok: false,
          code: "conflict",
          message: "Förfrågan har ändrats. Uppdatera formuläret och försök igen.",
        };
      return existing.result;
    }
    const emailKey = fingerprint(data.email);
    const rate = rates.get(emailKey) ?? { count: 0, until: now + WINDOW_MS };
    if (globalRate.until <= now) globalRate = { count: 0, until: now + WINDOW_MS };
    if (
      rate.count >= 3 ||
      globalRate.count >= 60 ||
      rates.size >= MAX_ENTRIES ||
      deliveries.size >= MAX_ENTRIES
    ) {
      return {
        ok: false,
        code: "rate_limit",
        message:
          "För många förfrågningar just nu. Vänta 15 minuter eller kontakta Samir via telefon.",
      };
    }
    rate.count++;
    globalRate.count++;
    rates.set(emailKey, rate);

    const calculation = quote ? calculateQuote(quote) : null;
    const summary = calculation
      ? [
          "Offertunderlag (omräknat på servern):",
          calculation.label,
          ...(calculation.pages === null ? [] : [`Antal sidor: ${calculation.pages}`]),
          ...calculation.items.map((item) => `${item.label}: ${formatSek(item.amount)} exkl. moms`),
          ...(calculation.totalExVat === null
            ? [
                `Riktpris: ${formatSek(calculation.priceRange?.min ?? 0)}–${formatSek(calculation.priceRange?.max ?? 0)} exkl. moms, omfattning enligt offert.`,
              ]
            : [
                `Uppskattad engångskostnad: ${formatSek(calculation.totalExVat)} exkl. moms`,
                `Moms 25 %: ${formatSek(calculation.vat ?? 0)}`,
                `Inkl. moms: ${formatSek(calculation.totalIncVat ?? 0)}`,
                "Domän/hosting och valfritt underhåll tillkommer enligt överenskommelse.",
              ]),
        ].join("\n")
      : "Inga offertval har bifogats.";

    const result = (async (): Promise<EnquiryResult> => {
      try {
        const response = await (dependencies.fetch ?? fetch)("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `enquiry/${data.requestId}`,
          },
          signal: AbortSignal.timeout(dependencies.timeoutMs ?? 10000),
          body: JSON.stringify({
            from: config.from,
            to: [config.to],
            reply_to: data.email,
            subject:
              data.source === "meeting" ? "Mötesförfrågan – DALADANA" : "Ny förfrågan – DALADANA",
            text: [
              `Namn: ${data.name}`,
              `Företag: ${data.company || "–"}`,
              `E-post: ${data.email}`,
              `Telefon: ${data.phone || "–"}`,
              `Intresse: ${data.service || "Vet inte än"}`,
              "",
              data.message,
              "",
              summary,
            ].join("\n"),
          }),
        });
        if (!response.ok) return deliveryFailure;
        const receipt: unknown = await response.json();
        // An HTTP 2xx alone is insufficient: the provider must acknowledge an ID.
        if (
          !receipt ||
          typeof receipt !== "object" ||
          !("id" in receipt) ||
          typeof receipt.id !== "string" ||
          !receipt.id
        )
          return deliveryFailure;
        return success;
      } catch {
        // Never log personal messages, API keys or the provider's raw response.
        return deliveryFailure;
      }
    })();
    deliveries.set(data.requestId, { digest, until: now + DAY_MS, result });
    const outcome = await result;
    if (!outcome.ok) deliveries.delete(data.requestId);
    return outcome;
  };
}

export const handleEnquiry = createEnquiryHandler();
