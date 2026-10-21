import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { assets } from "@/lib/assets";
import { company, footer } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src={assets.logoMark.src}
              srcSet={assets.logoMark.srcSet}
              sizes="36px"
              alt=""
              loading="lazy"
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="brand-wordmark font-display text-lg font-bold tracking-normal">
                {company.name}
              </span>
              <span className="brand-subtitle mt-1">DIGITALA BYRÅ</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {footer.blurb}
          </p>
          <div className="mt-6 space-y-1 text-sm text-muted-foreground">
            <p>
              <a className="hover:text-foreground" href={company.phoneHref}>
                {company.phone}
              </a>
            </p>
            {company.email && (
              <p>
                <a className="hover:text-foreground" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </p>
            )}
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-brand" />
              {company.address.join(", ")}
            </p>
          </div>

          <div className="mt-8">
            <SocialIcons />
          </div>

          <div className="mt-6 space-y-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {company.name}. Alla rättigheter förbehållna.
            </p>
            <p>
              <Link to="/integritetspolicy" className="text-foreground hover:text-brand">
                Cookies &amp; integritetspolicy
              </Link>
            </p>
          </div>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-sans text-xs font-bold tracking-normal text-foreground">
              {col.title}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link to={link.to} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
