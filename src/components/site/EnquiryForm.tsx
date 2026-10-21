import { useId, useRef, useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { services } from "@/content/site";
import type { QuoteSelection } from "@/lib/quote";
import type { EnquiryInput } from "@/lib/enquiry";
import { submitEnquiry } from "@/server/enquiry";

const inputStyle =
  "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2";

export function EnquiryForm({
  source = "contact",
  quoteSelection,
  title,
}: {
  source?: "contact" | "meeting";
  quoteSelection?: QuoteSelection | null | undefined;
  title?: string;
}) {
  const id = useId();
  const startedAt = useRef(Date.now());
  const requestId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    const fields = new FormData(event.currentTarget);
    const field = (name: string) => String(fields.get(name) ?? "");
    requestId.current ??= crypto.randomUUID();
    const data: EnquiryInput = {
      requestId: requestId.current,
      source,
      name: field("name"),
      company: field("company"),
      email: field("email"),
      phone: field("phone"),
      service: field("service"),
      message: field("message"),
      website: field("website"),
      startedAt: startedAt.current,
      quote: quoteSelection ?? null,
    };
    try {
      const result = await submitEnquiry({ data });
      if (result.ok) {
        setSuccess(result.message);
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        setError(result.message);
      }
    } catch {
      setError(
        "Förfrågan kunde inte bekräftas. Din text finns kvar. Kontrollera anslutningen och försök igen eller ring Samir.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (success)
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg py-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-copper"
      >
        <h3 className="text-2xl">Tack för din förfrågan!</h3>
        <p className="mt-4 text-muted-foreground">{success}</p>
        {source === "meeting" && (
          <p className="mt-2 text-sm text-muted-foreground">
            Ingen tid är bokad ännu. Ni kommer överens om en tid i nästa steg.
          </p>
        )}
      </div>
    );

  return (
    <form
      className="space-y-5"
      onSubmit={onSubmit}
      onChange={() => {
        requestId.current = null;
      }}
      aria-busy={pending}
    >
      {title && <h2 className="text-2xl">{title}</h2>}
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
        <legend className="sr-only">Kontaktuppgifter och meddelande</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id={`${id}-name`}
            label="Namn"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
          <Field
            id={`${id}-company`}
            label="Företag"
            name="company"
            maxLength={160}
            autoComplete="organization"
          />
          <Field
            id={`${id}-email`}
            label="E-post"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
          <Field
            id={`${id}-phone`}
            label="Telefon"
            name="phone"
            type="tel"
            maxLength={80}
            autoComplete="tel"
          />
        </div>
        <label className="block text-sm" htmlFor={`${id}-service`}>
          <span className="font-bold text-foreground">Vad är ni intresserade av?</span>
          <select id={`${id}-service`} name="service" className={inputStyle}>
            <option value="">Vet inte än</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm" htmlFor={`${id}-message`}>
          <span className="font-bold text-foreground">Meddelande</span>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={5000}
            className={inputStyle}
            placeholder="Berätta kort om verksamheten och vad ni vill uppnå (minst 10 tecken)."
          />
        </label>
        <div
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor={`${id}-website`}>Lämna det här fältet tomt</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Uppgifterna används för att besvara din förfrågan och skickas via vår e-posttjänst. Undvik
          känsliga personuppgifter. Läs{" "}
          <Link
            to="/integritetspolicy"
            className="underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-copper"
          >
            integritetsinformationen
          </Link>
          .
        </p>
        <Button
          variant="quote"
          type="submit"
          disabled={pending}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {pending
            ? "Skickar…"
            : source === "meeting"
              ? "Skicka mötesförfrågan"
              : "Skicka förfrågan"}
        </Button>
      </fieldset>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="rounded-lg border border-destructive bg-destructive/5 p-4 text-sm text-foreground"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm" htmlFor={props.id}>
      <span className="font-bold text-foreground">
        {label}
        {props.required ? " *" : ""}
      </span>
      <input {...props} className={inputStyle} />
    </label>
  );
}
