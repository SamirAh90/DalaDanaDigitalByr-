/** PUBLIC_SITE_URL is the only public configuration value exposed by vite.config.ts. */
const configuredOrigin = import.meta.env.PUBLIC_SITE_URL?.trim();
export const publicSiteUrl = configuredOrigin ? new URL(configuredOrigin).origin : "";

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
