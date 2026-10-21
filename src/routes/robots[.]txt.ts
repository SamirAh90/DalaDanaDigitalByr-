import { createFileRoute } from "@tanstack/react-router";
import { publicSiteUrl, publicUrl } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          publicSiteUrl
            ? `User-agent: *\nAllow: /\nDisallow: /_server/\nSitemap: ${publicUrl("/sitemap.xml")}\n`
            : "User-agent: *\nDisallow: /\n",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
