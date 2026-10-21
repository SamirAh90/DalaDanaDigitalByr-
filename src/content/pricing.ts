/** Prices are in SEK excluding VAT. Change amounts here, never parse display text. */
export const pricingConfig = {
  basePrice: 2995,
  includedPages: 3,
  extraPagePrice: 495,
  maxPages: 15,
  vatRate: 0.25,
  adminPrice: 1495,
  extraHourlyPrice: 395,
  packagePrices: { mini: 2995, starter: 4995, business: 9995, premium: 16995 },
  maintenancePrices: { bas: 180, standard: 250, pro: 450 },
  seo: { minPrice: 795, maxPrice: 1500 },
} as const;

export const formatSek = (amount: number) =>
  `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 2 }).format(amount)} kr`;

export const startingPrice = `Från ${formatSek(pricingConfig.basePrice)} exkl. moms`;

export const addonOptions = [
  { id: "webshop", title: "Webbshop", text: "Sälj produkter direkt på hemsidan.", amount: 3995 },
  {
    id: "brand",
    title: "Logotyp & varumärkesdesign",
    text: "En logotyp som passar er verksamhet.",
    amount: 995,
  },
  {
    id: "seo",
    title: "SEO-optimering",
    text: "Arbete med sökord, struktur och sidinnehåll.",
    amount: 995,
  },
  {
    id: "analytics",
    title: "Google Analytics",
    text: "Installation med samtyckesstyrd statistik.",
    amount: 495,
  },
  {
    id: "booking",
    title: "Bokningssystem",
    text: "Låt kunder skicka eller boka tider enligt valt system.",
    amount: 1995,
  },
  {
    id: "languages",
    title: "Flerspråkiga hemsidor",
    text: "Nå kunder på flera språk.",
    amount: 1495,
  },
  {
    id: "cms",
    title: "CMS & adminpanel",
    text: "Uppdatera innehållet själva.",
    amount: pricingConfig.adminPrice,
  },
] as const;

export type AddonId = (typeof addonOptions)[number]["id"];
export type PackageId = keyof typeof pricingConfig.packagePrices;

export const packageRules: Record<
  PackageId,
  { name: string; pages: number | null; includedAddonIds: readonly AddonId[] }
> = {
  mini: { name: "Mini", pages: 3, includedAddonIds: [] },
  starter: { name: "Starter", pages: 5, includedAddonIds: ["analytics"] },
  business: { name: "Business", pages: 10, includedAddonIds: ["booking", "analytics", "seo"] },
  premium: { name: "Premium", pages: null, includedAddonIds: ["cms", "webshop", "seo"] },
};
