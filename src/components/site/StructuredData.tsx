import { publicSiteUrl, serializeJsonLd, type JsonLd } from "@/lib/seo";

export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  if (!publicSiteUrl) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
