import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Briefcase, Home, MailPen, Menu, Tag, ToolCase, User, X } from "lucide-react";
import { assets } from "@/lib/assets";
import { company, nav } from "@/content/site";
import { Button } from "@/components/ui/button";

const icons = [Home, Briefcase, Tag, ToolCase, User, MailPen];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    mobileRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50${scrolled ? " is-scrolled" : ""}`}>
      <div className="container-page flex h-20 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src={assets.logoMark.src}
            srcSet={assets.logoMark.srcSet}
            sizes="36px"
            alt=""
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
        </Link>
        <nav aria-label="Huvudmeny" className="nav-dock hidden items-center gap-1 p-1.5 lg:flex">
          {nav.map((item, i) => {
            const Icon = icons[i] ?? Home;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="nav-item"
                activeOptions={{ exact: item.to === "/" }}
              >
                <Icon className="size-4" aria-hidden />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="quote" className="hidden sm:inline-flex">
            <Link to="/kontakt" onClick={() => setOpen(false)}>
              Kontakta mig
            </Link>
          </Button>
          <Button
            ref={toggleRef}
            variant="secondary"
            size="icon"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          ref={mobileRef}
          aria-label="Mobilmeny"
          className="container-page max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-background py-3 lg:hidden"
        >
          {nav.map((item, i) => {
            const Icon = icons[i] ?? Home;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="mobile-nav-item flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors"
                activeOptions={{ exact: item.to === "/" }}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
