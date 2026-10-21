import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
          "Ett urval av projekt: hemsidor för kafé, salong och juridisk byrå — varje sida formad efter kundens ton och mål.",
      },
      { property: "og:title", content: "Kundcase | DALADANA" },
      {
        property: "og:description",
        content: "Kafé, salong och byrå — se webbplatser från DALADANA, digitalbyrån i Dalarna.",
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
        intro="Ett urval av mina arbeten — med olika uttryck för olika verksamheter."
      />

      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <article
              key={c.slug}
              id={c.slug}
              className="animated-border group folk-accent scroll-mt-28 flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:border-copper/60"
            >
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block overflow-hidden rounded-t-lg"
                aria-label={`Öppna ${c.name} i ny flik`}
              >
                <ResponsiveImage
                  asset={c.imageAsset}
                  sizes="(min-width: 1024px) 352px, (min-width: 768px) 46vw, 90vw"
                  alt={`Webbplats för ${c.name}`}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-4 py-1.5 text-sm font-medium text-foreground shadow-none backdrop-blur transition-colors group-hover:bg-copper group-hover:text-primary-foreground">
                  Besök webbplatsen
                  <ArrowUpRight className="size-4" />
                </span>
              </a>

              <div className="flex flex-1 flex-col p-7">
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
                <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.summary}
                </p>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-copper hover:underline"
                >
                  Besök webbplatsen
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
