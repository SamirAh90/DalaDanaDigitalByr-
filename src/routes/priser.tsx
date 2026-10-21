import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BookingDialog } from "@/components/site/BookingDialog";
import { Section, SectionHeading } from "@/components/site/ui";
import {
  addons,
  maintenanceNote,
  maintenancePlans,
  packages,
  pricingConfig,
  pricingIntro,
  standaloneSeo,
} from "@/content/site";
import { cn } from "@/lib/utils";
import { PricingAddon } from "@/components/site/PricingAddon";
import { formatSek } from "@/content/pricing";
import type { AddonId } from "@/content/pricing";
import {
  calculateQuote,
  defaultQuote,
  encodeQuoteSelection,
  quoteSearchValidator,
} from "@/lib/quote";
import type { QuoteSelection } from "@/lib/quote";
import { useQuoteSelection } from "@/hooks/use-quote-selection";

export const Route = createFileRoute("/priser")({
  validateSearch: quoteSearchValidator,
  head: () => ({
    meta: [
      { title: "Priser & paket för hemsidor | DALADANA" },
      {
        name: "description",
        content:
          "Räkna ut ett riktpris på din hemsida, jämför paket och få en gratis prototyp och exakt offert innan du bestämmer dig.",
      },
      { property: "og:title", content: "Priser & paket | DALADANA" },
      {
        property: "og:description",
        content: "Paketpriser, tillval och underhåll — räkna ut kostnaden direkt på sidan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { selection, setSelection } = useQuoteSelection(defaultQuote);
  const calculator = selection?.kind === "calculator" ? selection : defaultQuote;
  const pages = calculator.kind === "calculator" ? calculator.pages : pricingConfig.includedPages;
  const selected = calculator.kind === "calculator" ? calculator.addonIds : [];
  const [booking, setBooking] = useState<QuoteSelection | null>(null);

  const extraPagesCost =
    Math.max(0, pages - pricingConfig.includedPages) * pricingConfig.extraPagePrice;
  const chosenAddons = addons.filter((a) => selected.includes(a.id));

  const quote = calculateQuote(calculator);

  const toggle = (id: AddonId) =>
    setSelection({
      version: 1,
      kind: "calculator",
      pages,
      addonIds: selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    });

  return (
    <>
      <section className="page-hero bg-background pt-32 pb-12 md:pt-36 md:pb-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center fade-up">
            <span className="eyebrow">{pricingIntro.eyebrow}</span>
            <h1 className="mt-4">{pricingIntro.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {pricingIntro.text}
            </p>
          </div>
          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[2fr_1fr] lg:gap-10">
            <div>
              <div className="folk-accent overflow-hidden rounded-lg border border-border bg-card p-4 sm:p-5">
                <h3 className="text-base">Antal sidor</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Minst {pricingConfig.includedPages} sidor ingår. Extra sidor:{" "}
                  {formatSek(pricingConfig.extraPagePrice)} styck exkl. moms (engångskostnad).
                </p>
                <div className="mt-4 flex items-center gap-5">
                  <input
                    type="range"
                    min={pricingConfig.includedPages}
                    max={pricingConfig.maxPages}
                    value={pages}
                    onChange={(e) =>
                      setSelection({
                        version: 1,
                        kind: "calculator",
                        pages: Number(e.target.value),
                        addonIds: selected,
                      })
                    }
                    aria-label="Antal sidor"
                    className="h-1 w-full accent-[var(--copper)]"
                  />
                  <span className="font-display text-4xl text-copper">{pages}</span>
                </div>
              </div>

              <h3 className="mt-6 text-base">Tillval · engångskostnader exkl. moms</h3>
              <div className="mt-3 grid auto-rows-fr gap-3 sm:grid-cols-2">
                {addons.map((addon) => (
                  <PricingAddon
                    key={addon.id}
                    addon={addon}
                    selected={selected.includes(addon.id)}
                    onToggle={() => toggle(addon.id)}
                  />
                ))}
              </div>
            </div>

            <aside className="folk-accent h-fit overflow-hidden rounded-lg border border-border bg-surface-elevated p-7 lg:sticky lg:top-28">
              <span className="eyebrow">Din offert</span>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between gap-4">
                  <span>Grundpaket</span>
                  <span>{formatSek(pricingConfig.basePrice)}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>{pages} sidor</span>
                  <span>{extraPagesCost === 0 ? "Ingår" : formatSek(extraPagesCost)}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sidor för era juridiska texter</span>
                  <span>Ingår</span>
                </li>
                {chosenAddons.length === 0 ? (
                  <li className="text-xs">
                    Inga tillval valda — klicka på ett kort för att lägga till.
                  </li>
                ) : (
                  chosenAddons.map((a) => (
                    <li key={a.id} className="flex justify-between gap-4">
                      <span>{a.title}</span>
                      <span>{a.price}</span>
                    </li>
                  ))
                )}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs  tracking-normal text-muted-foreground">
                  Engångskostnad exkl. moms
                </p>
                <p className="mt-1 font-display text-4xl text-copper">
                  {formatSek(quote.totalExVat!)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Moms (25 %): {formatSek(quote.vat!)} · Inkl. moms: {formatSek(quote.totalIncVat!)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {chosenAddons.length} tillval · {pages} sidor
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Riktpris, slutlig omfattning enligt offert. Domän och hosting tillkommer enligt
                  separat offert. Underhåll är valfritt.
                </p>
              </div>

              <div className="mt-7">
                <Button asChild variant="quote" size="lg">
                  <Link to="/kontakt" search={{ quote: encodeQuoteSelection(calculator) }}>
                    Begär offert
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 2. Färdiga paket */}
      <Section className="bg-surface" id="hemsida-webbutveckling">
        <SectionHeading
          eyebrow="Färdiga paket"
          title={
            <>
              Välj ett av våra <em className="text-copper">färdiga paket</em>
            </>
          }
          intro={`Engångskostnader exkl. moms. CMS och adminpanel kostar ${formatSek(pricingConfig.adminPrice)} som tillval och ingår i Premium. Omfattning och leveranstid bekräftas i offerten.`}
        />
        <div className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <article
              key={p.id}
              className={cn(
                "animated-border min-w-0 overflow-hidden rounded-lg border p-5",
                p.featured ? "border-brand/60 bg-surface-elevated" : "border-border bg-card",
              )}
            >
              <div className="flex min-h-5 flex-wrap items-center justify-between gap-2">
                <span className="eyebrow">{p.audience}</span>
                {p.featured && <span className="text-xs font-medium text-brand">Starter</span>}
              </div>
              <h3 className="mt-2 text-xl">{p.name}</h3>
              <p className="mt-2 font-display text-2xl">{p.price}</p>
              <p className="text-xs text-muted-foreground">{p.priceNote}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
              <details className="group mt-4">
                <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary">
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                  Vad som ingår
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {p.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">{p.delivery}</p>
                <p className="mt-3 flex justify-between gap-3 text-sm">
                  <span>Adminpanel</span>
                  <span>{p.adminAddon}</span>
                </p>
                <Button
                  variant="quote"
                  size="sm"
                  type="button"
                  onClick={() =>
                    setBooking({ version: 1, kind: "package", packageId: p.id, addonIds: [] })
                  }
                  className="mt-4 w-full"
                >
                  Välj {p.name}
                  <ArrowRight />
                </Button>
              </details>
            </article>
          ))}
        </div>
      </Section>

      {/* 3. Drift & underhåll */}
      <Section>
        <SectionHeading
          eyebrow="Efter lansering"
          title="Månadspriser för drift & underhåll"
          intro="Valfritt underhåll med en månads uppsägningstid. Domän och hosting offereras separat. Samtliga månadspriser är exkl. moms."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {maintenancePlans.map((m) => (
            <article
              key={m.name}
              className={cn(
                "animated-border folk-accent overflow-hidden rounded-lg border p-7",
                m.featured ? "border-copper/60 bg-surface-elevated" : "border-border bg-card",
              )}
            >
              {m.featured && (
                <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-[0.65rem]  tracking-normal text-primary-foreground">
                  Standard
                </span>
              )}
              <h3 className="text-2xl">{m.name}</h3>
              <p className="mt-2 font-display text-2xl text-copper">{m.price}</p>
              <p className="text-xs text-muted-foreground">{m.priceNote}</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {m.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-copper" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">{maintenanceNote}</p>
      </Section>

      {/* 4. Sökoptimering separat */}
      <Section className="bg-surface !py-10 md:!py-12" id="seo">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brand">
              <Search className="size-5" />
              <span className="eyebrow">SEO-paket</span>
            </div>
            <h2 className="mt-3 text-2xl">Enbart SEO — utan ny hemsida</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Riktpriset för SEO-arbete är {formatSek(standaloneSeo.minPrice).replace(" kr", "")}–
              {formatSek(standaloneSeo.maxPrice)} exkl. moms som engångskostnad, beroende på
              omfattning. Jag går igenom behovet med dig och lämnar en offert. Eventuellt löpande
              arbete avtalas separat.
            </p>
          </div>
          <Button
            variant="quote"
            size="lg"
            type="button"
            className="shrink-0"
            onClick={() => setBooking({ version: 1, kind: "seo" })}
          >
            Skicka mötesförfrågan
            <ArrowRight />
          </Button>
        </div>
      </Section>

      <BookingDialog
        open={booking !== null}
        quoteSelection={booking ?? undefined}
        onClose={() => setBooking(null)}
      />
    </>
  );
}
