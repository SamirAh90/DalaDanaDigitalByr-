import metadata from "./asset-metadata.json";

export type LocalImage = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

/** All URLs point to version-controlled files served by the same host. */
export const assets = {
  logoMark: metadata["synord-mark.png"],
  portrait: metadata["samir-ahmad.png"],
  winterDesktop: metadata["dalarna-winter-desktop.jpg"],
  winterMobile: metadata["dalarna-winter-mobile.png"],
  caseJuridik: metadata["case-juridik.png"],
  caseKaffehuset: metadata["case-kaffehuset.png"],
  caseRozans: metadata["case-rozans.png"],
  heroPoster: metadata.heroPoster,
  heroMobile: metadata.heroMobile,
  heroVideo: metadata.heroVideo,
  socialShare: metadata.socialShare,
} as const;

const technology = (name: string, filename: string) => ({
  name,
  src: `/assets/originals/technology/${filename}.svg`,
});

export const technologies = [
  technology("Expo", "expo"),
  technology("TypeScript", "typescript"),
  technology("Supabase", "supabase"),
  technology("Klarna", "klarna"),
  technology("Swish", "swish-logo"),
  technology(".NET", "dotnet"),
  technology("C#", "csharp"),
  technology("Python", "python"),
  technology("Flask", "flask"),
  technology("Loopia", "loopia"),
  technology("OpenAI · AI", "openai"),
  technology("React", "react"),
  technology("PHP", "php"),
  technology("Tailwind CSS", "tailwindcss"),
  technology("WordPress", "wordpress"),
  technology("WooCommerce", "woocommerce"),
  technology("Stripe", "stripe"),
  technology("PayPal", "paypal"),
  technology("HTML5", "html5"),
  technology("JavaScript", "javascript"),
  technology("Linux", "linux"),
  technology("Matomo", "matomo"),
];
