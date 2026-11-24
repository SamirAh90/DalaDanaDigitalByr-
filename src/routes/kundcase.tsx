import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Quote } from "lucide-react";
import { ContactCta, PageHero, Section } from "@/components/site/ui";
import { cases } from "@/content/site";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export const Route = createFileRoute("/kundcase")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Kundcase — hemsidor vi har byggt | DALADANA" },
      {
        name: "description",
        content:
          "Fyra kundprojekt inom café, event, skönhet och juridik — från behov och arbetsprocess till leverans och kundernas egna ord.",
      },
      { property: "og:title", content: "Kundcase | DALADANA" },
      {
        property: "og:description",
        content:
          "Se hur DALADANA har byggt webbplatser och digitala lösningar för fyra olika verksamheter.",
      },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Utvalda projekt"
        title="Kundcase"
        intro="Fyra verksamheter, fyra olika behov. Här är vägen från idé och dialog till publicerad lösning."
      />

      <Section>
        <div className="space-y-12">
          {cases.map((c, index) => (
            <article
              key={c.slug}
              id={c.slug}
              className="animated-border folk-accent scroll-mt-28 overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="grid lg:grid-cols-2">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative block min-h-full overflow-hidden ${index % 2 ? "lg:order-2" : ""}`}
                  aria-label={`Öppna ${c.name} i ny flik`}
                >
                  <ResponsiveImage
                    asset={c.imageAsset}
                    sizes="(min-width: 1024px) 352px, (min-width: 768px) 46vw, 90vw"
                    alt={`Webbplats för ${c.name}`}
                    loading="lazy"
                    className="aspect-[3/2] size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] lg:aspect-auto"
                  />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-4 py-1.5 text-sm font-medium text-foreground shadow-none backdrop-blur transition-colors group-hover:bg-copper group-hover:text-primary-foreground">
                    Besök webbplatsen
                    <ArrowUpRight className="size-4" />
                  </span>
                </a>
                <div className="p-7 sm:p-9">
                  <div className="flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-accent px-3 py-1 text-[0.65rem]  tracking-normal text-copper-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-5 font-display text-2xl">{c.name}</h2>
                  <p className="mt-1 text-sm text-copper-soft">{c.subtitle}</p>
                  <dl className="mt-6 grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-foreground">Bransch</dt>
                      <dd className="mt-1 text-muted-foreground">{c.industry}</dd>
                    </div>
                    {c.location ? (
                      <div>
                        <dt className="font-medium text-foreground">Plats</dt>
                        <dd className="mt-1 text-muted-foreground">{c.location}</dd>
                      </div>
                    ) : null}
                    {c.delivery ? (
                      <div>
                        <dt className="font-medium text-foreground">Leveranstid</dt>
                        <dd className="mt-1 text-muted-foreground">{c.delivery}</dd>
                      </div>
                    ) : null}
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-foreground">Tjänster</dt>
                      <dd className="mt-1 text-muted-foreground">{c.services.join(", ")}</dd>
                    </div>
                  </dl>
                  <h3 className="mt-6 text-lg">Kundens behov</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.need}</p>
                </div>
              </div>

              <div className="grid gap-8 border-t border-border p-7 sm:p-9 lg:grid-cols-3">
                <div>
                  <h3 className="text-lg">Vad jag byggde</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {c.built.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-copper" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg">Från idé till lansering</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.process}</p>
                </div>
                <div>
                  <h3 className="text-lg">Resultat</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {c.results.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-copper" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 border-t border-border bg-muted/40 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
                <figure>
                  <Quote className="size-6 text-copper" aria-hidden="true" />
                  <blockquote className="mt-3 space-y-2 text-base leading-relaxed text-foreground">
                    {c.testimonial.map((quote) => (
                      <p key={quote}>“{quote}”</p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-muted-foreground">— {c.name}</figcaption>
                </figure>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-copper hover:underline"
                >
                  Besök webbplatsen
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <ContactCta
        title="Vill ni bli nästa case?"
        text="Berätta om er idé så återkommer jag med ett förslag."
      />
    </>
  );
}
