import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  ShoppingBag,
  Palette,
  Search,
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Smartphone,
  Code2,
} from "lucide-react";
import { ContactCta, PageHero, Section } from "@/components/site/ui";
import { services, servicePage } from "@/content/site";
import { company } from "@/content/site";
import { StructuredData } from "@/components/site/StructuredData";
import { publicUrl, type JsonLd } from "@/lib/seo";

export const Route = createFileRoute("/tjanster/")({
  head: () => ({
    meta: [
      { title: "Tjänster — hemsidor, e-handel och SEO | DALADANA" },
      {
        name: "description",
        content:
          "Allt ni behöver för att växa online: hemsidor, e-handel, logotyp, SEO, adminpanel, bokning och löpande support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Våra tjänster | DALADANA" },
      {
        property: "og:description",
        content:
          "Hemsidor, e-handel, SEO, CMS, bokningssystem och underhåll — från idé till drift.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const servicesSchema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": publicUrl("/tjanster#tjanstelista"),
    name: "DALADANAs tjänster",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        "@id": publicUrl(`/tjanster#${service.slug}`),
        name: service.title,
        description: service.description,
        url: publicUrl(`/tjanster#${service.slug}`),
        provider: { "@id": publicUrl("/#organization"), name: company.name },
        areaServed: ["Ludvika", "Dalarna", "Sverige"],
      },
    })),
  };

  return (
    <>
      <StructuredData data={servicesSchema} />
      <PageHero eyebrow={servicePage.eyebrow} title={servicePage.title} intro={servicePage.intro} />
      <Section>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon =
              [
                Globe,
                ShoppingBag,
                Palette,
                Search,
                LayoutDashboard,
                CalendarDays,
                Wrench,
                Smartphone,
                Code2,
              ][i] ?? Globe;
            return (
              <div key={s.slug} id={s.slug} className="service-card min-w-0 scroll-mt-28">
                <Icon className="mb-5 size-6" />
                <span className="text-xs font-medium text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 text-xl">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <details className="group mt-3">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                    {servicePage.details}
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.intro}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {s.deliverables.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          aria-hidden
                          className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-primary/60"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    {servicePage.contact}
                    <ArrowRight className="size-4" />
                  </Link>
                </details>
              </div>
            );
          })}
        </div>
      </Section>

      <ContactCta
        title="Låt oss bygga något fint tillsammans"
        text="Skicka en mötesförfrågan så pratar jag igenom vad ni behöver."
      />
    </>
  );
}
