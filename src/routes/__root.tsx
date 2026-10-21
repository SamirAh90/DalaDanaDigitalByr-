import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorRouteComponent,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { canonicalPath, publicSiteUrl, publicUrl } from "@/lib/seo";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { ScrollGlow } from "@/components/site/ScrollGlow";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sidan finns inte</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sidan du söker finns inte eller har flyttats.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sidan kunde inte laddas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Något gick fel. Försök igen eller gå tillbaka till startsidan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Försök igen
          </Button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Till startsidan
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DALADANA — Digitalbyrå i Dalarna" },
      {
        name: "description",
        content: "Moderna hemsidor, e-handel och SEO för företag som vill växa digitalt.",
      },
      { property: "og:title", content: "DALADANA — Digitalbyrå i Dalarna" },
      {
        property: "og:description",
        content: "Moderna hemsidor, e-handel och SEO för företag som vill växa digitalt.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: publicUrl("/assets/social-share.jpg") },
      { property: "og:image:alt", content: "DALADANA – en digital byrå med rötterna i Dalarna" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: publicUrl("/assets/social-share.jpg") },
      ...(!publicSiteUrl ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      ...(publicSiteUrl
        ? [
            {
              property: "og:url",
              content: publicUrl(canonicalPath(matches.at(-1)?.pathname ?? "/")),
            },
          ]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: "/assets/fonts/ibm-plex-sans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      ...(publicSiteUrl
        ? [{ rel: "canonical", href: publicUrl(canonicalPath(matches.at(-1)?.pathname ?? "/")) }]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  // Cast satisfies this router version's AsyncRouteComponent weak-type intersection.
  errorComponent: ErrorComponent as ErrorRouteComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <a href="#main-content" className="skip-link">
        Hoppa till innehållet
      </a>
      <main id="main-content" tabIndex={-1}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <ScrollGlow />
    </QueryClientProvider>
  );
}
