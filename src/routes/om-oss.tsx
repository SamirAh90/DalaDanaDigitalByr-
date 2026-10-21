import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { ContactCta } from "@/components/site/ui";
import { about, faq, founder } from "@/content/site";
import { assets } from "@/lib/assets";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export const Route = createFileRoute("/om-oss")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Om oss — vilka vi är | DALADANA" },
      {
        name: "description",
        content:
          "Lär känna DALADANA och Samir Ahmad. En digital byrå med rötterna i Dalarna och hjärtat i Ludvika, från första samtal till fortsatt hjälp.",
      },
      { property: "og:title", content: "Om oss | DALADANA" },
      {
        property: "og:description",
        content:
          "Webbutveckling och digitalisering med verksamhetens behov i fokus — från idé till en användbar lösning.",
      },
    ],
  }),
  component: AboutPage,
});

function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold  tracking-normal ${
        dark
          ? "border border-primary-foreground/20 text-primary-foreground/80"
          : "bg-muted text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function AboutPage() {
  const wanted = [
    "Hur går det till från första kontakt till lansering?",
    "Kostar offerten något?",
    "Vad kostar en hemsida?",
    "Tillkommer det något efteråt?",
    "Måste allt material vara klart innan vi börjar?",
  ];
  const allFaq = faq
    .flatMap((c) => c.items)
    .filter((i) => wanted.includes(i.q))
    .slice(0, 5);
  return (
    <>
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden pt-28 pb-20 sm:min-h-[460px]">
        <picture className="absolute inset-0 -z-30 overflow-hidden" aria-hidden="true">
          <source media="(max-width: 639px)" srcSet={assets.winterMobile.srcSet} sizes="100vw" />
          <ResponsiveImage
            asset={assets.winterDesktop}
            sizes="100vw"
            alt=""
            className="h-full w-full scale-105 object-cover blur-xl"
          />
        </picture>
        <picture className="absolute inset-0 -z-20">
          <source media="(max-width: 639px)" srcSet={assets.winterMobile.srcSet} sizes="100vw" />
          <ResponsiveImage
            asset={assets.winterDesktop}
            sizes="100vw"
            fetchPriority="high"
            alt="Röd dalahäst på ett snötäckt räcke framför Dalarnas vinterlandskap"
            className="h-full w-full object-contain"
          />
        </picture>
        <div className="absolute inset-0 -z-10 bg-background/50" aria-hidden />
        <div className="container-page max-w-3xl text-center fade-up page-hero">
          <span className="eyebrow text-foreground">Om oss</span>
          <h1 className="mt-4">Om DALADANA</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground">
            {about.intro}
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="relative z-10 -mt-12 rounded-t-2xl bg-background py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <Pill>Vår historia</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl">{about.heading}</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              {about.points.map((point) => (
                <li key={point.title} className="flex gap-3">
                  <Check className="mt-1.5 size-4 shrink-0 text-brand" aria-hidden />
                  <p>
                    <strong className="font-semibold text-foreground">{point.title}</strong>{" "}
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Grundare */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-page grid items-stretch gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
          <figure className="relative mx-auto w-full max-w-md md:h-full md:max-w-none">
            <ResponsiveImage
              asset={assets.portrait}
              sizes="(min-width: 768px) 430px, 90vw"
              alt="Samir Ahmad, grundare av DALADANA"
              loading="lazy"
              className="h-auto min-h-[320px] w-full rounded-lg object-cover object-top md:h-full"
            />
            <figcaption className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              Samir Ahmad · DALADANA
            </figcaption>
          </figure>
          <div>
            <Pill>{founder.eyebrow}</Pill>
            <h2 className="mt-4 text-2xl md:text-3xl">{founder.title}</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="vanliga-fragor" className="scroll-mt-28 bg-surface py-20 md:py-24">
        <div className="container-page">
          <h2 className="text-center text-2xl md:text-3xl">Vanliga frågor</h2>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {allFaq.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="group rounded-lg bg-card px-6 py-5 shadow-none"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactCta title={about.ctaTitle} text={about.ctaText} />
    </>
  );
}
