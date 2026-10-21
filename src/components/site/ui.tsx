import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("section-heading max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-3">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
}) {
  return (
    <section className="page-hero bg-background pt-28 pb-10 md:pt-32 md:pb-12">
      <div className="container-page max-w-3xl text-center fade-up">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </div>
    </section>
  );
}
export function CtaLink({
  to,
  children,
  variant = "primary",
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Button
      asChild
      size="lg"
      variant={variant === "primary" ? (to === "/kontakt" ? "quote" : "default") : "outline"}
      className="group"
    >
      <Link to={to}>
        {children}
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}
export function ContactCta({ title, text }: { title: string; text: string }) {
  return (
    <Section className="bg-muted text-foreground">
      <div className="text-center">
        <h2 className="mx-auto max-w-2xl text-3xl md:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">{text}</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="quote">
            <Link to="/kontakt">
              Skicka en mötesförfrågan
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
