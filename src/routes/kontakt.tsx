import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero, Section } from "@/components/site/ui";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { company } from "@/content/site";
import { quoteSearchValidator } from "@/lib/quote";
import { useQuoteSelection } from "@/hooks/use-quote-selection";

export const Route = createFileRoute("/kontakt")({
  validateSearch: quoteSearchValidator,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Kontakt och mötesförfrågan | DALADANA" },
      {
        name: "description",
        content:
          "Prata med Samir Ahmad om din nästa hemsida. Skicka en offert- eller mötesförfrågan till DALADANA, en personlig digitalbyrå i Dalarna.",
      },
      { property: "og:title", content: "Kontakt | DALADANA" },
      {
        property: "og:description",
        content: "Skicka en förfrågan om din hemsida eller ett kostnadsfritt samtal med Samir.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { selection, invalid } = useQuoteSelection();
  return (
    <>
      <PageHero
        eyebrow="Hör av er"
        title={
          <>
            Låt oss prata om <em className="text-copper">era idéer</em>
          </>
        }
        intro="Skicka en mötesförfrågan eller slå en signal. Samir hjälper dig vidare från idé till en lösning som passar verksamheten."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl">Kontaktuppgifter</h2>
            <ul className="mt-8 space-y-7 text-sm">
              <li className="flex gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
                <div>
                  <p className="font-bold text-foreground">Telefon</p>
                  <a
                    href={company.phoneHref}
                    className="text-muted-foreground hover:text-copper focus-visible:ring-2 focus-visible:ring-copper"
                  >
                    {company.phone}
                  </a>
                </div>
              </li>
              {company.email && (
                <li className="flex gap-4">
                  <Mail className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-foreground">E-post</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-muted-foreground hover:text-copper focus-visible:ring-2 focus-visible:ring-copper"
                    >
                      {company.email}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
                <div>
                  <p className="font-bold text-foreground">Adress</p>
                  {company.address.map((line) => (
                    <p key={line} className="text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
                <div>
                  <p className="font-bold text-foreground">Svarstid</p>
                  <p className="text-muted-foreground">{company.responseTime}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="folk-accent relative overflow-hidden rounded-lg border border-primary bg-card p-6 shadow-none sm:p-8">
            {invalid && (
              <p role="status" className="mb-5 text-sm text-muted-foreground">
                Offertvalen i länken kunde inte läsas. Kontrollera sammanfattningen eller gör nya
                val på prissidan.
              </p>
            )}
            <EnquiryForm title="Skicka en förfrågan" quoteSelection={selection} />
          </div>
        </div>
      </Section>
    </>
  );
}
