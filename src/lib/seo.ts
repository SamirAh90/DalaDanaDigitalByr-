/** PUBLIC_SITE_URL is the only public configuration value exposed by vite.config.ts. */
const configuredOrigin = import.meta.env.PUBLIC_SITE_URL?.trim();
export const publicSiteUrl = configuredOrigin ? new URL(configuredOrigin).origin : "";

export const siteName = "DALADANA";
export const siteLocale = "sv-SE";
export const defaultDescription =
  "DALADANA är en digitalbyrå i Ludvika, Dalarna som bygger hemsidor, webbshoppar och bokningssidor för företag.";

export function publicUrl(path: string) {
  return publicSiteUrl ? new URL(path, `${publicSiteUrl}/`).href : path;
}

export const indexablePaths = [
  "/",
  "/tjanster",
  "/priser",
  "/kundcase",
  "/om-oss",
  "/kontakt",
  "/faq",
  "/integritetspolicy",
];

export function canonicalPath(path: string) {
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

export type JsonLd = Record<string, unknown>;

export function serializeJsonLd(data: JsonLd | JsonLd[]) {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function organizationGraph({
  name,
  alternateNames,
  description,
  telephone,
  streetAddress,
  addressLocality,
  founder,
  sameAs,
}: {
  name: string;
  alternateNames: string[];
  description: string;
  telephone: string;
  streetAddress: string;
  addressLocality: string;
  founder: string;
  sameAs: string[];
}): JsonLd {
  const organizationId = publicUrl("/#organization");
  const websiteId = publicUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": organizationId,
        name,
        legalName: name,
        alternateName: alternateNames,
        url: publicUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: publicUrl("/assets/images/synord-mark-256.webp"),
          width: 256,
          height: 256,
        },
        image: publicUrl("/assets/social-share.jpg"),
        description,
        slogan: "Personlig digitalbyrå i Ludvika, Dalarna",
        knowsAbout: [
          "Webbdesign",
          "Webbutveckling",
          "Webbshoppar",
          "Bokningssystem",
          "Sökmotoroptimering",
        ],
        telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress,
          addressLocality,
          addressRegion: "Dalarna",
          addressCountry: "SE",
        },
        areaServed: [
          { "@type": "City", name: "Ludvika" },
          { "@type": "AdministrativeArea", name: "Dalarna" },
          { "@type": "Country", name: "Sverige" },
        ],
        founder: {
          "@type": "Person",
          "@id": publicUrl("/om-oss#samir-ahmad"),
          name: founder,
          jobTitle: "Grundare och webbutvecklare",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone,
          contactType: "kundservice",
          areaServed: "SE",
          availableLanguage: ["sv"],
        },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: publicUrl("/"),
        name,
        alternateName: alternateNames,
        description,
        inLanguage: siteLocale,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function breadcrumbGraph(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: publicUrl(item.path),
    })),
  };
}
