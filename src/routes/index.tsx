import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaLink, Section, SectionHeading } from "@/components/site/ui";
import { TechnologyMarquee } from "@/components/site/TechnologyMarquee";
import { cases, hero, heroStats, intro, whyUs } from "@/content/site";
import { startingPrice } from "@/content/pricing";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { HeroMedia } from "@/components/site/HeroMedia";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DALADANA — digitalbyrå i Dalarna | Hemsidor, webbshop & SEO" },
      {
        name: "description",
        content: `Samir Ahmad bygger hemsidor, webbshoppar och bokningssidor för företag i Dalarna och Sverige. ${startingPrice}. Egen design och fast offert.`,
      },
      { property: "og:title", content: "DALADANA — digitalbyrå i Dalarna" },
      {
        property: "og:description",
        content: `Hemsidor från en digital byrå med egen design. ${startingPrice}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="home-hero relative isolate flex flex-col overflow-hidden bg-background text-foreground">
        <HeroMedia />
        <div className="hero-video-overlay absolute inset-0 -z-10" aria-hidden="true" />
        <div className="hero-main container-page flex flex-1 items-center justify-center pt-24 pb-12">
          <div className="relative max-w-3xl py-10 text-center">
            <span className="eyebrow">{hero.titleTop}</span>
            <h1 className="hero-heading mx-auto mt-5 max-w-3xl">{hero.titleBottom}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {hero.intro}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CtaLink to={hero.primaryCta.to}>{hero.primaryCta.label}</CtaLink>
              <CtaLink to={hero.secondaryCta.to} variant="ghost">
                {hero.secondaryCta.label}
              </CtaLink>
            </div>
          </div>
        </div>
        <div className="rounded-t-2xl border-t border-border bg-background/80 backdrop-blur-sm">
          <dl className="container-page grid divide-border py-2 sm:grid-cols-3 sm:divide-x">
            {heroStats.map((stat) => (
              <div key={stat.value} className="px-2 py-5 sm:px-6">
                <dt className="font-display text-xl font-semibold text-foreground md:text-2xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{whyUs.eyebrow}</span>
          <h2 className="brand-wordmark mt-4 text-4xl md:text-5xl">{whyUs.title}</h2>
          <p className="mt-2 text-lg font-medium text-muted-foreground">{whyUs.subtitle}</p>
          <div className="mt-6 space-y-4">
            {whyUs.paragraphs.map((p) => (
              <p key={p} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {whyUs.pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-primary/35 bg-card px-4 py-1.5 text-xs text-copper-soft"
              >
                {pill}
              </span>
            ))}
          </div>
          <Link
            to="/om-oss"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-brand hover:underline"
          >
            {whyUs.aboutLink}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
      <TechnologyMarquee />
      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />
          <div className="mt-6 space-y-4">
            {intro.paragraphs.map((p) => (
              <p key={p} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <ProcessTimeline />
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/tjanster"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-brand hover:underline"
          >
            {intro.servicesLink}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Utvalda arbeten"
          title="Sidor med egen karaktär"
          intro="Kafé, salong och juridik — olika verksamheter med olika uttryck."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Link
              key={c.slug}
              to="/kundcase"
              hash={c.slug}
              className="animated-border group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/60"
            >
              <ResponsiveImage
                asset={c.imageAsset}
                alt={`Webbplats för ${c.name}`}
                loading="lazy"
                sizes="(min-width: 1024px) 352px, (min-width: 768px) 46vw, 90vw"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand">
                  Se projektet
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/kundcase"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            Alla kundcase
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
      <Section className="bg-muted">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Ska jag bygga er nästa sida?</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Berätta kort vad ni behöver så återkommer jag med ett förslag och en fast offert.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" variant="quote">
              <Link to="/kontakt">
                Begär offert
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
