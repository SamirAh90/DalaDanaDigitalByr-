import { createFileRoute } from "@tanstack/react-router";
import { indexablePaths, publicSiteUrl, publicUrl } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        if (!publicSiteUrl)
          return new Response("Ange PUBLIC_SITE_URL innan publicering.", { status: 503 });
        const escape = (value: string) =>
          value
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexablePaths.map((path) => `<url><loc>${escape(publicUrl(path))}</loc></url>`).join("")}</urlset>`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
