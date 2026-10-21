import { createFileRoute, redirect } from "@tanstack/react-router";
import { services } from "@/content/site";

// Preserve published addresses without maintaining separate service pages.
export const Route = createFileRoute("/tjanster/$slug")({
  beforeLoad: ({ params }) => {
    const service = services.find((item) => item.slug === params.slug);
    throw redirect({ to: "/tjanster", hash: service?.slug ?? "", statusCode: 301 });
  },
});
