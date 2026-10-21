import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ContactCta, PageHero, Section } from "@/components/site/ui";
import { faq } from "@/content/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Vanliga frågor om hemsidor, pris och SEO | DALADANA" },
      {
        name: "description",
        content:
          "Svar på vanliga frågor om process, priser, design, teknik, SEO, underhåll och GDPR när ni beställer en ny hemsida.",
      },
      { property: "og:title", content: "Vanliga frågor | DALADANA" },
      {
        property: "og:description",
        content: "Allt ni undrar om process, pris, teknik och support — samlat på ett ställe.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");

  const filtered = faq
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((it) =>
        (it.q + it.a).toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Vanliga frågor"
        title="Svar på allt du undrar"
        intro="Sök din fråga eller bläddra bland kategorierna nedan. Hittar du inte svaret — hör av dig."
      />

      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök bland frågorna…"
            aria-label="Sök bland frågorna"
            className="w-full rounded-lg border border-border bg-card px-6 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-copper focus:ring-2 focus:ring-sun/30 md:max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            {faq.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-border px-4 py-1.5 text-xs text-foreground/80 transition-colors hover:border-copper hover:bg-accent"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 space-y-16">
          {filtered.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-28">
              <h2 className="text-3xl">{cat.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{cat.intro}</p>
              <div className="folk-accent mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {cat.items.map((item) => (
                  <details key={item.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base text-foreground">
                      {item.q}
                      <ChevronDown className="size-4 shrink-0 text-copper transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground">Inga frågor matchade din sökning.</p>
          )}
        </div>
      </Section>

      <ContactCta
        title="Hittade du inte svaret?"
        text="Skicka en fråga så återkommer jag så snart jag kan."
      />
    </>
  );
}
