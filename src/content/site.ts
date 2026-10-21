/**
 * All editable site content lives here.
 * Replace copy, prices and cases in this single file — components read from it.
 */
import { assets } from "@/lib/assets";
import type { LocalImage } from "@/lib/assets";
import { addonOptions, formatSek, pricingConfig, startingPrice } from "./pricing";

export { pricingConfig, startingPrice } from "./pricing";

export const company = {
  name: "DALADANA",
  tagline: "Digitalbyrå i Dalarna",
  phone: "0700 22 15 20",
  phoneHref: "tel:0700221520",
  email: "",
  address: ["Engelbrektgatan 24", "Ludvika"],
  responseTime: "Jag läser din förfrågan och återkommer så snart jag kan.",
  orgNumber: "",
  owner: "Samir Ahmad",
  location: "Ludvika, Dalarna",
  socials: [
    {
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61595585611495",
      icon: "facebook",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/daladana-digitala--byr%C3%A5",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/daladanadb/",
      icon: "instagram",
    },
  ] as { label: string; url: string; icon: "facebook" | "instagram" | "linkedin" }[],
};

export const nav = [
  { label: "Hem", to: "/" },
  { label: "Tjänster", to: "/tjanster" },
  { label: "Priser", to: "/priser" },
  { label: "Kundcase", to: "/kundcase" },
  { label: "Om oss", to: "/om-oss" },
  { label: "Kontakt", to: "/kontakt" },
] as const;

export const hero = {
  titleTop: "Digitalbyrå i Dalarna",
  titleBottom: "Vi skapar hemsidor för små och stora företag",
  intro:
    "Hos DALADANA får du personlig hjälp med hemsidor, webbshoppar och bokningssidor som passar din verksamhet. Vi lyssnar på dina idéer och finns med från första samtalet till lansering – och även efteråt.",
  primaryCta: { label: "Fråga om kostnadsfri rådgivning", to: "/kontakt" },
  secondaryCta: { label: "Se prisbild", to: "/priser" },
};

export const heroStats = [
  { value: "1–2 v", label: "Från skiss till lansering på en mindre sida" },
  { value: startingPrice, label: "Engångskostnad med fast offert innan arbetet börjar" },
  { value: "0 mallar", label: "Varje sida ritas efter er verksamhet" },
];

export const whyUs = {
  eyebrow: "Varför välja oss?",
  title: "DALADANA",
  subtitle: "DIGITALA BYRÅ",
  paragraphs: [
    "Ni behöver en partner som förstår verksamheten, ger en tydlig offert och bygger något som hjälper era kunder. Jag tar mig tid att förstå vad ni behöver och föreslår ett upplägg som passar.",
    "Hos DALADANA får ni en gratis prototyp innan ni bestämmer er, en offert på vanlig svenska och direktkontakt med mig från första samtal till lansering. Jag bygger mobilanpassade och sökoptimerade sidor med moderna verktyg — och ni äger koden och innehållet själva.",
    "Efter lansering kan jag hjälpa till med ändringar, frågor och nästa steg när verksamheten växer. Löpande hjälp avtalas separat.",
  ],
  pills: ["Gratis prototyp", "Fast pris", "Ni äger allt", "Lokal support i Dalarna"],
  aboutLink: "Läs mer om oss",
};

export const technologyHeading = "Verktyg jag arbetar med:";
export const servicePage = {
  eyebrow: "Vårt tjänsteutbud",
  title: "Alla våra tjänster",
  intro:
    "Från första idé till färdig hemsida — och allt däremellan. Nio tjänster, samlade på ett ställe.",
  details: "Vad som ingår",
  contact: "Prata med oss",
};

export const intro = {
  eyebrow: "Så jobbar DALADANA",
  title: "Nära, tydligt och utan krångel.",
  paragraphs: [
    "Jag arbetar som en hantverkare: ni har direktkontakt med mig hela vägen — från första skissen till dagen sidan går live.",
    "Jag föreslår det ni behöver och skriver offerten på svenska utan branschord. Ni vet vad som ingår innan arbetet börjar.",
  ],
  pills: ["Fast pris", "Egen design", "Svar samma dag"],
  servicesLink: "Se alla våra tjänster",
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  highlights: { title: string; text: string }[];
  audience: string;
  steps: { title: string; text: string }[];
  deliverables: string[];
  faq: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "hemsidor-webbutveckling",
    title: "Hemsidor",
    description:
      "En snabb och mobilanpassad hemsida ritad efter er verksamhet — inte en mall som tusen andra företag redan använder.",
    intro:
      "Vi ritar och kodar hemsidan från ett tomt papper. Ni får en sida som laddar snabbt, känns som ert företag och gör det lätt för besökaren att höra av sig.",
    highlights: [
      {
        title: "Egen form",
        text: "Färg, typsnitt och rytm väljs efter er verksamhet — ingen köpt mall.",
      },
      {
        title: "Snabb i mobilen",
        text: "Lätt kod och komprimerade bilder gör att sidan öppnas direkt.",
      },
      {
        title: "Redo för Google",
        text: "Rubriker, struktur och sidtexter sätts rätt redan vid lansering.",
      },
    ],
    audience:
      "Passar er som aldrig haft en riktig hemsida, eller som har en gammal sida där besökarna inte hittar fram. Jag hjälper mindre företag i Dalarna och övriga Sverige — hantverkare, konsulter, salonger och nystartade bolag.",
    steps: [
      {
        title: "Uppstart och sidkarta",
        text: "Vi går igenom vad ni gör, vilka ni vill nå och vilka sidor som behövs.",
      },
      {
        title: "Skiss på startsidan",
        text: "Ni ser förstasidan först och får tycka till innan resten byggs.",
      },
      { title: "Bygge", text: "Sidorna byggs i modern kod och testas löpande i mobil och dator." },
      { title: "Genomgång", text: "Ni får en testlänk, vi samlar era kommentarer och justerar." },
      {
        title: "Lansering",
        text: "Domän, certifikat, sitemap och anmälan till Google — sedan är ni live.",
      },
    ],
    deliverables: [
      "Egen design efter er profil",
      "Responsiv layout för mobil, platta och dator",
      "Antal sidor enligt valt paket",
      "Kontaktformulär med notis till er",
      "Grundläggande sökoptimering",
      "Domän, SSL och publicering",
    ],
    faq: [
      {
        q: "Hur lång tid tar det?",
        a: "En mindre sida tar oftast 1–2 veckor, en större 4–6 veckor.",
      },
      {
        q: "Kan vi behålla vår domän?",
        a: "Ja, vi flyttar den utan att er e-post slutar fungera.",
      },
    ],
    related: ["seo-optimering", "cms-adminpanel", "underhall-support"],
  },
  {
    slug: "e-handel",
    title: "Webbshop",
    description:
      "Sälj produkter direkt på sidan med kort, Swish och faktura, och en orderöversikt som är enkel att sköta själv.",
    intro:
      "Webbshoppen byggs in i hemsidan, så kunden aldrig hamnar på en sida som ser ut som ett annat företag. Ni får en enkel vy för produkter och ordrar.",
    highlights: [
      {
        title: "Betalsätt kunderna vill ha",
        text: "Kort, Swish och faktura via etablerade betaltjänster.",
      },
      { title: "Enkel produkthantering", text: "Lägg upp, ändra och dölj produkter själva." },
      {
        title: "Kassa byggd för mobil",
        text: "Få steg och tydliga priser — där de flesta köp faktiskt sker.",
      },
    ],
    audience:
      "Passar er som redan säljer i butik, via meddelanden eller mejl och är trötta på att skriva ordrar för hand. Har ni ett mycket stort sortiment tar vi det samtalet först.",
    steps: [
      {
        title: "Sortiment och frakt",
        text: "Vi går igenom produkter, varianter, lager och hur frakten ska räknas.",
      },
      {
        title: "Betalning och villkor",
        text: "Betalkonto kopplas och köpvillkor, retur och ångerrätt läggs in.",
      },
      { title: "Bygge av butiken", text: "Produktsidor, kategorier, varukorg och kassa." },
      {
        title: "Testköp",
        text: "Vi gör riktiga köp innan lansering och kontrollerar hela flödet.",
      },
      { title: "Överlämning", text: "Genomgång av hur ni sköter produkter, ordrar och returer." },
    ],
    deliverables: [
      "Webbshop i samma design som hemsidan",
      "Betalning med kort, Swish och faktura",
      "Produktsidor med bilder, pris och varianter",
      "Varukorg och mobilanpassad kassa",
      "Orderbekräftelse till kund och notis till er",
      "Adminvy för ordrar",
    ],
    faq: [
      {
        q: "Vad kostar betallösningen?",
        a: "Betaltjänsten tar en avgift per köp; vi hjälper er välja upplägg.",
      },
      {
        q: "Kan vi börja litet?",
        a: "Ja, många startar med ett fåtal produkter och växer efterhand.",
      },
    ],
    related: ["hemsidor-webbutveckling", "underhall-support", "analys-uppfoljning"],
  },
  {
    slug: "logotyp-varumarkesdesign",
    title: "Logotyp & grafisk profil",
    description:
      "Logotyp, färger och typsnitt som hänger ihop — på hemsidan, på skylten och i sociala medier.",
    intro:
      "Vi tar fram en logotyp som fungerar lika bra liten i mobilen som stor på en skylt, plus färger och typsnitt som håller ihop hela intrycket.",
    highlights: [
      {
        title: "Alla filformat",
        text: "Vektor för tryck och skyltar, PNG för webb och sociala medier.",
      },
      {
        title: "Färg och typsnitt",
        text: "En grundpalett och typografi som resten av materialet vilar på.",
      },
      {
        title: "Samma känsla överallt",
        text: "Korta riktlinjer så att intrycket blir lika varje gång.",
      },
    ],
    audience:
      "Passar nystartade som behöver ett förstaintryck som håller, och företag vars logotyp bara finns som en suddig bildfil.",
    steps: [
      {
        title: "Samtal om varumärket",
        text: "Vad ni gör, vilka ni vill nå och vilken känsla ni vill lämna.",
      },
      {
        title: "Riktningar i svartvitt",
        text: "Ett par tydligt olika förslag — formen ska hålla innan färgen hjälper till.",
      },
      {
        title: "Förfining",
        text: "Vald riktning putsas: proportioner, färg och beteende i liten storlek.",
      },
      { title: "Filpaket", text: "Ni får logotypen i alla varianter ni behöver." },
    ],
    deliverables: [
      "Logotyp i primär och kompakt variant",
      "Filer i SVG, PNG, PDF och JPG",
      "Färgvarianter i färg, svart och vitt",
      "Färgpalett med färgkoder",
      "Typsnitt för rubrik och brödtext",
      "Kort användningsguide och favicon",
    ],
    faq: [
      {
        q: "Hur många förslag får vi?",
        a: "Två till tre riktningar, sedan förfinar vi den ni väljer.",
      },
      {
        q: "Får vi använda den på kläder?",
        a: "Ja, ni äger logotypen och får filer som fungerar för tryck.",
      },
    ],
    related: ["hemsidor-webbutveckling", "flersprakiga-webbplatser", "e-handel"],
  },
  {
    slug: "seo-optimering",
    title: "Sökoptimering",
    description:
      "Vi bygger sidan så att Google förstår den, och arbetar med rubriker, texter och lokala sökord för er ort.",
    intro:
      "Sökoptimering handlar om att göra sidan begriplig för både människor och sökmotorer. Vi går igenom teknik, texter och sökord och arbetar sedan vidare löpande.",
    highlights: [
      {
        title: "Teknisk grund",
        text: "Sitemap, laddtid, indexering och struktur som Google belönar.",
      },
      {
        title: "Rätt sökord",
        text: "Vi väljer söktermer med rimlig konkurrens och kopplar en per sida.",
      },
      { title: "Lokal synlighet", text: "Ni ska hittas när någon söker på tjänsten plus er ort." },
    ],
    audience:
      "Passar er som har en hemsida men knappt får besökare från Google, eller får besökare på fel sökord. Extra värdefullt när kunden aktivt söker när behovet uppstår.",
    steps: [
      {
        title: "Nulägesanalys",
        text: "Vilka sökord ni syns på i dag och vad som tekniskt bromsar sidan.",
      },
      {
        title: "Sökordsarbete",
        text: "Vi mappar varje sökord till en sida så att era sidor inte konkurrerar.",
      },
      {
        title: "Teknisk åtgärd",
        text: "Sitemap, canonical, strukturerad data, bilder och laddtid.",
      },
      {
        title: "Texter och rubriker",
        text: "Titlar, beskrivningar och innehåll skrivs om efter sökintentionen.",
      },
      {
        title: "Uppföljning",
        text: "Vi mäter positioner och justerar löpande. Rörelse syns oftast efter 2–4 månader.",
      },
    ],
    deliverables: [
      "Teknisk genomlysning med åtgärdslista",
      "Sökordsanalys mappad mot era sidor",
      "Optimerade titlar och metabeskrivningar",
      "Justerad rubrikstruktur och brödtext",
      "Interna länkar mellan besläktade sidor",
      "Månadsvis uppföljning vid löpande paket",
    ],
    faq: [
      {
        q: "Kan ni garantera förstaplats?",
        a: "Nej, ingen seriös byrå kan det. Vi arbetar med det som faktiskt påverkar.",
      },
      { q: "Måste ni ha byggt sidan?", a: "Nej, vi arbetar även med sidor byggda av andra." },
    ],
    related: ["analys-uppfoljning", "hemsidor-webbutveckling", "underhall-support"],
  },
  {
    slug: "cms-adminpanel",
    title: "Egen adminpanel",
    description:
      "Byt texter, bilder och priser själva när ni vill, utan att behöva höra av er för varje liten ändring.",
    intro:
      "Ni ska inte behöva ringa en digitalbyrå för att byta ett telefonnummer. Panelen visar bara det ni faktiskt ska kunna ändra — resten är låst.",
    highlights: [
      { title: "Ändra direkt", text: "Texter, bilder och priser uppdateras på några sekunder." },
      { title: "Inget tekniskt krav", text: "Fälten heter samma sak som på sidan, på svenska." },
      { title: "Trygg struktur", text: "Layouten kan inte gå sönder av en felskrivning." },
    ],
    audience:
      "Passar er som ändrar innehåll ofta — öppettider, priser, nyheter, personal eller produkter — och vill slippa mejla varje gång.",
    steps: [
      {
        title: "Vi väljer ut fälten",
        text: "Det ni vill ändra själva blir redigerbart, allt annat låses.",
      },
      { title: "Panelen byggs", text: "Tydligt märkta fält och automatisk bildkomprimering." },
      { title: "Konton och behörighet", text: "En eller flera användare med olika nivåer." },
      {
        title: "Genomgång",
        text: "Ni gör en riktig ändring medan vi tittar på, plus en kort guide.",
      },
    ],
    deliverables: [
      "Inloggningsskyddad panel på er domän",
      "Redigering av texter, rubriker och bilder",
      "Automatisk bildkomprimering",
      "Fält på svenska utan tekniska begrepp",
      "Flera användarkonton vid behov",
      "Genomgång och snabbguide",
    ],
    faq: [
      { q: "Kan vi råka förstöra något?", a: "Nej, bara utvalda fält går att ändra." },
      {
        q: "Vad kostar panelen?",
        a: `CMS och adminpanel kostar ${formatSek(pricingConfig.adminPrice)} exkl. moms som separat engångstillval och ingår i Premium. Domän och hosting är separata driftskostnader enligt offert. Underhåll är valfritt.`,
      },
    ],
    related: ["hemsidor-webbutveckling", "underhall-support", "e-handel"],
  },
  {
    slug: "underhall-support",
    title: "Drift & support",
    description:
      "Hosting, säkerhetsuppdateringar, backup och en människa att ringa när något känns fel.",
    intro:
      "Efter lanseringen kan jag hjälpa till med uppdateringar, backup och support. Omfattningen bestäms i det underhållspaket ni väljer; domän och hosting offereras separat.",
    highlights: [
      {
        title: "Tydlig omfattning",
        text: "Backup och övervakning enligt valt underhållspaket. Domän och hosting avtalas separat.",
      },
      {
        title: "Uppdateringar",
        text: "Vi håller allt aktuellt så att kända säkerhetshål inte hinner bli problem.",
      },
      { title: "Personlig hjälp", text: "Ni når Samir som byggde sidan." },
    ],
    audience:
      "Passar alla vars sida betyder något för verksamheten — särskilt om ni tar emot bokningar eller ordrar och saknar egen IT-ansvarig.",
    steps: [
      {
        title: "Genomgång av nuläget",
        text: "Hosting, domän, certifikat, backuper och eventuella brister.",
      },
      { title: "Löpande drift", text: "Övervakning larmar oss, inte er, om sidan slutar svara." },
      { title: "Uppdateringar", text: "Säkerhets- och beroendeuppdateringar sköts löpande." },
      { title: "Ändringar på begäran", text: "Mindre justeringar ingår enligt vald nivå." },
    ],
    deliverables: [
      "Hosting med SSL",
      "Automatisk backup med återställning",
      "Driftsövervakning med larm",
      "Säkerhetsuppdateringar",
      "Innehållsändringar enligt vald nivå",
      "Support via mejl och telefon",
    ],
    faq: [
      {
        q: "Vad kostar det?",
        a: `Valfritt underhåll börjar på ${formatSek(pricingConfig.maintenancePrices.bas)} exkl. moms per månad. Domän och hosting offereras separat. Uppsägning med en månads varsel.`,
      },
      {
        q: "Kan ni ta över en sida ni inte byggt?",
        a: "Ofta ja — vi gör en teknisk inventering först.",
      },
    ],
    related: ["hemsidor-webbutveckling", "cms-adminpanel", "analys-uppfoljning"],
  },
  {
    slug: "bokningssystem",
    title: "Bokning online",
    description:
      "Låt kunderna boka tid direkt på hemsidan — passar salonger, verkstäder, kliniker och uthyrning.",
    intro:
      "Bokningen byggs in i hemsidan. Kunden väljer tjänst och tid själv, ni får en notis direkt och slipper ta alla bokningar i telefon.",
    highlights: [
      {
        title: "Öppet dygnet runt",
        text: "Kunden bokar när det passar dem, inte bara när ni svarar.",
      },
      { title: "Påminnelser", text: "Automatiska påminnelser minskar uteblivna besök." },
      { title: "En kalender", text: "Alla bokningar samlade och synkade med er egen kalender." },
    ],
    audience:
      "Passar verksamheter som säljer tid: frisörer, massörer, kliniker, hundtrim, körskolor och upplevelseföretag.",
    steps: [
      {
        title: "Era tider",
        text: "Vilka tjänster som ska bokas, hur lång tid de tar och hur många som jobbar samtidigt.",
      },
      {
        title: "Kalender och regler",
        text: "Öppettider, pauser, semester och regler för av- och ombokning.",
      },
      { title: "Bokningsflöde", text: "Så få steg som möjligt, byggt för mobilen." },
      {
        title: "Notiser",
        text: "Bekräftelse till kunden, notis till er och påminnelse innan besöket.",
      },
      {
        title: "Test och överlämning",
        text: "Vi testbokar hela flödet och går igenom administrationen.",
      },
    ],
    deliverables: [
      "Bokning integrerad i hemsidan",
      "Tjänster med egen längd och eget pris",
      "Kalender med öppettider och stängda dagar",
      "Bekräftelse via e-post",
      "Notis vid ny bokning och avbokning",
      "Adminvy med alla bokningar",
    ],
    faq: [
      {
        q: "Kan flera medarbetare ha var sin kalender?",
        a: "Ja, varje person kan ha egna tjänster och tider.",
      },
      {
        q: "Går det att ta betalt vid bokning?",
        a: "Ja, vi kan koppla betalning eller en depositionsavgift.",
      },
    ],
    related: ["hemsidor-webbutveckling", "e-handel", "underhall-support"],
  },
  {
    slug: "flersprakiga-webbplatser",
    title: "Flerspråkiga hemsidor",
    description:
      "Svenska, engelska eller fler — samma design och känsla oavsett vilket språk besökaren väljer.",
    intro:
      "Vi bygger riktiga språkversioner med egna adresser, inte en översättningsknapp. Det är skillnaden mellan att synas i sitt land och inte göra det.",
    highlights: [
      { title: "Samma design", text: "Layout och känsla hålls ihop oavsett språk." },
      {
        title: "Sökbar per språk",
        text: "Varje version får egna titlar, beskrivningar och adresser.",
      },
      { title: "Enkel att uppdatera", text: "Ni kan ändra varje språk för sig i adminpanelen." },
    ],
    audience:
      "Passar er som har kunder utanför Sverige, tar emot internationella besökare eller söker samarbeten utomlands.",
    steps: [
      { title: "Val av språk", text: "Alla sidor eller bara kärnsidorna i steg ett." },
      {
        title: "Teknisk struktur",
        text: "Egen adress per språk och rätt märkning för sökmotorer.",
      },
      {
        title: "Innehåll",
        text: "Ni levererar eller vi samordnar översättningen — och kontrollerar att texten får plats.",
      },
      { title: "Språkväxling och test", text: "Byte av språk behåller besökaren på samma sida." },
    ],
    deliverables: [
      "Egen adresstruktur per språk",
      "Språkväljare som behåller sidan",
      "Översatta titlar och beskrivningar",
      "Layout kontrollerad för längre texter",
      "Översatta formulär och knapptexter",
      "Sitemap per språkversion",
    ],
    faq: [
      {
        q: "Ingår översättningen?",
        a: "Vi kan samordna den; annars lägger vi in texten ni skickar.",
      },
      {
        q: "Kan vi lägga till språk senare?",
        a: "Ja, strukturen byggs så att fler språk kan tillkomma.",
      },
    ],
    related: ["seo-optimering", "cms-adminpanel", "hemsidor-webbutveckling"],
  },
  {
    slug: "analys-uppfoljning",
    title: "Statistik & uppföljning",
    description:
      "Se vilka sidor som säljer och var besökarna försvinner, så att nästa förbättring bygger på siffror.",
    intro:
      "Vi kopplar in mätning och pekar ut de få siffror som faktiskt betyder något för er — inte en rapport ingen orkar öppna.",
    highlights: [
      { title: "Rätt uppsättning", text: "Besöksstatistik och sökdata kopplas ihop från start." },
      {
        title: "Mål som betyder något",
        text: "Skickat formulär, klick på telefonnumret, påbörjad bokning eller köp.",
      },
      { title: "Begriplig översikt", text: "Ni får en vy ni själva kan tolka." },
    ],
    audience:
      "Passar er som lagt pengar på hemsida eller annonser utan att veta vad de gav, eller som har mätning installerad men aldrig loggar in.",
    steps: [
      { title: "Installation", text: "Besöksstatistik och sökdata kopplas ihop." },
      { title: "Mål och händelser", text: "Vi mäter det som räknas som ett resultat hos er." },
      {
        title: "Samtycke",
        text: "Mätningen aktiveras först när besökaren godkänt statistikcookies.",
      },
      {
        title: "Genomgång",
        text: "Vi går igenom rapporten tillsammans så att ni kan läsa den själva.",
      },
    ],
    deliverables: [
      "Installation av besöksstatistik",
      "Koppling mot sökmotorns verktyg",
      "Spårning av formulär och telefonklick",
      "Mål anpassade efter er verksamhet",
      "Samtyckesstyrd mätning och uppdaterad cookiepolicy",
      "Rapportöversikt med relevanta mätvärden",
    ],
    faq: [
      {
        q: "Är det förenligt med GDPR?",
        a: "Ja, mätningen startar efter samtycke och IP-adresser anonymiseras.",
      },
      {
        q: "Får vi rapport varje månad?",
        a: "Ja, om ni har ett underhållspaket med rapportering.",
      },
    ],
    related: ["seo-optimering", "underhall-support", "e-handel"],
  },
];

export type CaseItem = {
  slug: string;
  name: string;
  subtitle: string;
  summary: string;
  tags: string[];
  url: string;
  image: string;
  imageAsset: LocalImage;
  imageSrcSet: string;
  imageWidth: number;
  imageHeight: number;
  imageSizes: string;
};

export const cases: CaseItem[] = [
  {
    slug: "lilla-kaffehuset",
    name: "Lilla Kaffehuset",
    subtitle: "Hemsida för ett personligt kafé",
    summary:
      "En webbplats för Lilla Kaffehuset med varm färgskala, meny, öppettider och kontaktinformation. Se webbplatsen för utformning och innehåll.",
    tags: ["Hemsida", "Kafé"],
    url: "https://demo-lilla-kaffehus-web.lovable.app",
    image: assets.caseKaffehuset.src,
    imageAsset: assets.caseKaffehuset,
    imageSrcSet: assets.caseKaffehuset.srcSet,
    imageWidth: assets.caseKaffehuset.width,
    imageHeight: assets.caseKaffehuset.height,
    imageSizes: assets.caseKaffehuset.sizes,
  },
  {
    slug: "rozans-hair",
    name: "RozanS Hair Style Bromma",
    subtitle: "Hemsida med bokning för salong",
    summary:
      "Webbplats för RozanS Hair Style Bromma med presentation av salongen, information om tjänster och en väg till bokning och kontakt.",
    tags: ["Hemsida", "Bokning"],
    url: "https://rozanshair.se",
    image: assets.caseRozans.src,
    imageAsset: assets.caseRozans,
    imageSrcSet: assets.caseRozans.srcSet,
    imageWidth: assets.caseRozans.width,
    imageHeight: assets.caseRozans.height,
    imageSizes: assets.caseRozans.sizes,
  },
  {
    slug: "global-juridik",
    name: "Global Juridik Gruppen",
    subtitle: "Flerspråkig sida för juridisk byrå",
    summary:
      "En flerspråkig webbplats för Global Juridik Gruppen med presentation av tjänster, språkval och kontaktvägar i en tydlig struktur.",
    tags: ["Hemsida", "Flerspråkigt"],
    url: "https://globalajuridikgruppen.se",
    image: assets.caseJuridik.src,
    imageAsset: assets.caseJuridik,
    imageSrcSet: assets.caseJuridik.srcSet,
    imageWidth: assets.caseJuridik.width,
    imageHeight: assets.caseJuridik.height,
    imageSizes: assets.caseJuridik.sizes,
  },
];

export const process = [
  {
    number: "01",
    title: "Vi pratar",
    text: "Vi börjar med verksamheten och kunderna, och väljer tillsammans rätt tjänster för er hemsida.",
    color: "sun",
  },
  {
    number: "02",
    title: "Jag ritar och bygger",
    text: "Form, logotyp och grafisk profil får en tydlig riktning — sedan byggs sida, webbshop och adminpanel efter era behov.",
    color: "turquoise",
  },
  {
    number: "03",
    title: "Dags för lansering",
    text: "Jag publicerar sidan och går igenom den med er. Drift och fortsatt hjälp planeras efter era behov och avtalas separat.",
    color: "brand",
  },
];

export const packages = [
  {
    id: "mini" as const,
    name: "Mini",
    amount: pricingConfig.packagePrices.mini,
    price: formatSek(pricingConfig.packagePrices.mini),
    priceNote: "engångskostnad exkl. moms",
    audience: "Perfekt för nystartade",
    blurb: "En enkel och snygg sida som ger företaget en professionell närvaro online.",
    features: ["1–3 sidor", "Kontaktformulär", "Google Maps", "Mobilanpassad design"],
    delivery: "Leverans: 1–2 veckor",
    adminAddon: `+ ${formatSek(pricingConfig.adminPrice)} exkl. moms`,
    featured: false,
  },
  {
    id: "starter" as const,
    name: "Starter",
    amount: pricingConfig.packagePrices.starter,
    price: formatSek(pricingConfig.packagePrices.starter),
    priceNote: "engångskostnad exkl. moms",
    audience: "Små & medelstora",
    blurb: "En komplett hemsida med allt ett mindre företag behöver för att synas och sälja.",
    features: [
      "Upp till 5 sidor",
      "Kontaktformulär med e-postnotis",
      "Google Maps + öppettider",
      "Google Analytics med samtyckesstyrning",
      "Grundläggande SEO",
      "1 revisionsomgång",
    ],
    delivery: "Leverans: 2–3 veckor",
    adminAddon: `+ ${formatSek(pricingConfig.adminPrice)} exkl. moms`,
    featured: true,
  },
  {
    id: "business" as const,
    name: "Business",
    amount: pricingConfig.packagePrices.business,
    price: formatSek(pricingConfig.packagePrices.business),
    priceNote: "engångskostnad exkl. moms",
    audience: "För växande företag",
    blurb: "Mer innehåll, starkare SEO och funktioner som skapar fler förfrågningar.",
    features: [
      "Upp till 10 sidor",
      "Blogg / nyhetssektion",
      "Bokningsfunktion",
      "Presentation av era verifierade kundrecensioner",
      "Samtyckesstyrd Analytics + Search Console",
      "Fördjupad SEO",
      "3 revisionsomgångar",
    ],
    delivery: "Leverans: 3–5 veckor",
    adminAddon: `+ ${formatSek(pricingConfig.adminPrice)} exkl. moms`,
    featured: false,
  },
  {
    id: "premium" as const,
    name: "Premium",
    amount: pricingConfig.packagePrices.premium,
    price: formatSek(pricingConfig.packagePrices.premium),
    priceNote: "engångskostnad exkl. moms · omfattning enligt offert",
    audience: "Maximal närvaro online",
    blurb: "Skräddarsydd design, e-handel och adminpanel — hela lösningen.",
    features: [
      "Antal sidor och innehåll enligt offert",
      "100 % skräddarsydd design",
      "Adminpanel — uppdatera själva",
      "E-handelsfunktioner",
      "Betalning (Swish, Stripe)",
      "Avancerad SEO-strategi",
      "Prestanda & säkerhet",
      "Revisionsomgångar enligt överenskommen omfattning",
    ],
    delivery: "Leverans: 4–6 veckor",
    adminAddon: "Ingår",
    featured: false,
  },
];

export const addons = addonOptions.map((addon) => ({
  ...addon,
  price: `+ ${formatSek(addon.amount)}`,
}));

export const maintenancePlans = [
  {
    name: "Bas",
    amount: pricingConfig.maintenancePrices.bas,
    price: `${formatSek(pricingConfig.maintenancePrices.bas)}/mån`,
    priceNote: "exkl. moms · valfritt underhåll",
    features: [
      "Månatliga säkerhetsuppdateringar",
      "1 timme innehållsändringar/mån",
      "Driftsövervakning",
      "Backup varje vecka",
      "E-postsupport (svar inom 48 h)",
    ],
    featured: false,
  },
  {
    name: "Standard",
    amount: pricingConfig.maintenancePrices.standard,
    price: `${formatSek(pricingConfig.maintenancePrices.standard)}/mån`,
    priceNote: "exkl. moms · valfritt underhåll",
    features: [
      "Allt i Bas",
      "3 timmar innehållsändringar/mån",
      "Daglig backup",
      "E-post & telefonsupport (24 h)",
      "Månadsrapport om prestanda",
    ],
    featured: true,
  },
  {
    name: "Pro",
    amount: pricingConfig.maintenancePrices.pro,
    price: `${formatSek(pricingConfig.maintenancePrices.pro)}/mån`,
    priceNote: "exkl. moms · valfritt underhåll",
    features: [
      "Allt i Standard",
      "5 timmar ändringar/mån",
      "Prioriterad support (samma dag)",
      "Google Ads-översyn",
      "Löpande förbättringsförslag",
    ],
    featured: false,
  },
];

export const maintenanceNote = `Domän och hosting behövs för att webbplatsen ska vara tillgänglig och offereras separat; de ingår inte i hemsidans engångspris eller underhållspriserna ovan. Underhåll är valfritt. Extra arbete utanför paketet kostar ${formatSek(pricingConfig.extraHourlyPrice)} exkl. moms per timme. Uppsägning med en månads varsel.`;

export const pricingIntro = {
  eyebrow: "Priskalkylator",
  title: "Vad kostar en hemsida?",
  text: "Välj vad du behöver så räknar vi ut ett riktpris direkt. Inget är bindande — du får alltid en gratis prototyp och en exakt offert innan du bestämmer dig.",
};

export const standaloneSeo = {
  packageCount: 2,
  minPrice: pricingConfig.seo.minPrice,
  maxPrice: pricingConfig.seo.maxPrice,
};

export const about = {
  eyebrow: "Om oss",
  title: "Webbutveckling och digitalisering med verksamheten i fokus",
  intro:
    "En webbyrå i Dalarna för företag som vill ha tydliga svar, moderna lösningar och personlig hjälp även efter lansering.",
  heading: "Med rötterna i Dalarna och hjärtat i Ludvika",
  paragraphs: [
    "Jag heter Samir Ahmad och driver DALADANA i Ludvika, Dalarna. Jag bygger och underhåller hemsidor, webbshoppar och digitala verktyg för företag, föreningar och organisationer i Dalarna och övriga Sverige – från första samtal och skiss till lansering och löpande förbättringar.",
    "Jag startade DALADANA med en enkel tanke: att använda min kunskap för att hjälpa andra och göra något bra för samhället omkring mig. Jag vill bidra till att fler vågar utveckla sina idéer och får möjlighet att växa.",
  ],
  points: [
    {
      title: "Dina behov står i centrum.",
      text: "Jag tar mig tid att lära känna din verksamhet. Vad behöver dina kunder kunna göra? Vilka arbetsmoment tar onödigt mycket tid? Tillsammans reder vi ut behoven, prioriterar det viktigaste och hittar ett upplägg som passar din vardag och budget.",
    },
    {
      title: "En digital byrå ska göra vardagen enklare.",
      text: "Det kan vara bokning direkt på hemsidan, enklare hantering av beställningar eller ett verktyg som ersätter manuellt arbete. Jag använder moderna verktyg med fokus på snabbhet, säkerhet och långsiktig funktion. Målet är mindre administration och mer tid för verksamheten.",
    },
    {
      title: "Personlig kontakt hela vägen.",
      text: "Du har direktkontakt med mig som bygger din hemsida. Vi träffas fysiskt eller digitalt, utifrån vad som passar dig bäst. Jag följer upp, lyssnar och hjälper till när behoven förändras.",
    },
    {
      title: "Omtanke och ödmjukhet är grunden.",
      text: "Du känner din verksamhet bäst, och jag uppskattar det jag får lära mig av dig. För mig är ett lyckat samarbete ett där du känner dig trygg, lyssnad på och nöjd med resultatet.",
    },
    {
      title: "Jag vill ge fler en bra start.",
      text: "Jag vet vad stöd från andra kan betyda när man startar företag. När tid och resurser tillåter vill jag hjälpa unga företagare och mindre verksamheter att ta sitt första steg på webben. Hör av dig så pratar vi om möjligheterna.",
    },
  ],
  stats: [
    { value: "Samir", label: "Din kontakt genom projektet" },
    { value: "Ludvika", label: "Med rötter i Dalarna" },
    { value: "Egen kod", label: "Du äger det som byggs" },
    { value: "Tydlig offert", label: "Omfattning och pris före start" },
  ],
  ctaTitle: "Har du en idé eller ett arbetssätt du vill förenkla?",
  ctaText:
    "Skicka ett meddelande och berätta vad du vill förbättra. Vi börjar med ett samtal om dina behov.",
};

export const founder = {
  eyebrow: "Bakom DALADANA",
  title: "Möt mig som driver DALADANA",
  paragraphs: [
    "Hej! Jag heter Samir Ahmad och driver DALADANA. Jag tycker om att förstå hur en verksamhet fungerar och hitta lösningar som gör vardagen lite enklare. Att få hjälpa någon att förverkliga en idé är en stor del av glädjen i mitt arbete.",
    "Jag har studerat systemutveckling med fokus på programmering och webbutveckling. Jag har också en bakgrund inom företagsekonomi och erfarenhet av webbutveckling, projektledning och verksamhetsutveckling. Det har gett mig förståelse för hur teknik, människor och ekonomi behöver fungera tillsammans.",
    "Jag börjar med att lyssna och lära känna din verksamhet. Du känner din vardag bäst, och jag bidrar med kunskap och praktisk hjälp utifrån dina behov.",
    "Hos DALADANA har du direktkontakt med mig från första samtalet till lansering och fortsatt hjälp. Vi träffas fysiskt eller digitalt, utifrån vad som passar dig bäst. Jag vill att du ska känna dig trygg, lyssnad på och välkommen att fråga.",
  ],
};

export const values = [
  {
    title: "Nära",
    text: "Direktkontakt med Samir Ahmad genom hela projektet, från första samtalet till lansering och fortsatt hjälp.",
  },
  {
    title: "Hantverk",
    text: "Typsnitt, färg och mellanrum är valda med avsikt. Det syns i helheten även om ingen kan peka på varför.",
  },
  {
    title: "Långsiktigt",
    text: "Jag bygger lösningar som går att förstå, underhålla och vidareutveckla när dina behov förändras.",
  },
];

export const philosophy = {
  eyebrow: "Vår filosofi",
  title: "Öppna lösningar & ägande",
  lead: "Vi tycker att du ska äga det vi bygger åt dig — koden, innehållet och domänen.",
  paragraphs: [
    "Därför väljer vi beprövade, öppna verktyg som går att förstå, flytta och vidareutveckla. Ingen hemlig plattform, ingen inlåsning och inga licenser du inte behöver.",
    "Det betyder att du kan byta leverantör om du vill, att sidan går att underhålla i många år och att pengarna går till det som faktiskt skapar värde för verksamheten.",
  ],
  tags: ["React", "TypeScript", "WordPress", "Matomo"],
  boxTitle: "Varför det spelar roll",
  points: [
    { title: "Du äger allt", text: "Kod, innehåll och domän står på dig — inte på oss." },
    { title: "Inget krångel", text: "Vi förklarar valen på svenska, utan branschord." },
    { title: "Byggt för att hålla", text: "Moderna verktyg som uppdateras och granskas av många." },
    { title: "Rimliga kostnader", text: "Inga onödiga licenser eller dolda månadsavgifter." },
  ],
};

export type FaqCategory = {
  id: string;
  title: string;
  intro: string;
  items: { q: string; a: string }[];
};

export const faq: FaqCategory[] = [
  {
    id: "kom-igang",
    title: "Kom igång",
    intro: "Vad som händer när ni hör av er första gången.",
    items: [
      {
        q: "Hur går det till från första kontakt till lansering?",
        a: "Vi hörs på telefon eller video, går igenom målen, skickar en offert med fast pris och börjar när ni säger till. Sedan bygger vi i etapper med löpande avstämning.",
      },
      {
        q: "Kostar offerten något?",
        a: "Nej. Samtalet och offerten är kostnadsfria och binder er inte till något.",
      },
      {
        q: "Måste allt material vara klart innan vi börjar?",
        a: "Nej. Vi börjar med det ni har och hjälper till med texter och bilder på vägen.",
      },
      {
        q: "Måste vi finnas i Dalarna?",
        a: "Nej. Jag hjälper verksamheter i Dalarna och övriga Sverige och håller möten digitalt när det passar bäst.",
      },
    ],
  },
  {
    id: "priser",
    title: "Priser & paket",
    intro: "Vad det kostar och vad som ingår.",
    items: [
      {
        q: "Vad kostar en hemsida?",
        a: `${startingPrice} som engångskostnad. Starter kostar ${formatSek(pricingConfig.packagePrices.starter)} exkl. moms. Priset beror på antal sidor, funktioner och innehåll; omfattningen bestäms i offerten.`,
      },
      {
        q: "Tillkommer det något efteråt?",
        a: "Ja, domän och hosting är återkommande kostnader enligt separat offert. Underhåll och fortsatt hjälp är valfria tjänster. Ni får en fast offert för själva webbplatsen och alla tillägg avtalas innan arbetet börjar.",
      },
      {
        q: "Vad kostar drift per månad?",
        a: `Domän och hosting offereras separat efter behov och leverantör. Valfritt underhåll börjar på ${formatSek(pricingConfig.maintenancePrices.bas)} exkl. moms per månad med en månads uppsägningstid.`,
      },
    ],
  },
  {
    id: "design",
    title: "Design & innehåll",
    intro: "Om utseende, texter och bilder.",
    items: [
      {
        q: "Blir det en mall?",
        a: "Nej. Designen ritas från grunden utifrån er verksamhet och er profil.",
      },
      {
        q: "Kan ni skriva texterna?",
        a: "Ja. Vi kan skriva allt innehåll och hjälpa till med bildval och bildbearbetning.",
      },
      {
        q: "Hur många ändringar ingår?",
        a: "Antalet revisionsomgångar följer valt paket och den överenskomna offerten. Ändringar utanför omfattningen avtalas innan extra arbete börjar.",
      },
    ],
  },
  {
    id: "teknik",
    title: "Teknik & funktioner",
    intro: "Hur sidan är byggd.",
    items: [
      {
        q: "Fungerar sidan i mobilen?",
        a: "Ja. Allt vi bygger fungerar lika bra i mobil, surfplatta och dator.",
      },
      {
        q: "Kan vi ändra själva efteråt?",
        a: "Ja, med adminpanelen byter ni texter, bilder och produkter när ni vill.",
      },
      {
        q: "Hur snabb blir sidan?",
        a: "Jag optimerar bilder, typsnitt och kod och kontrollerar laddtiden. Resultatet beror också på innehåll, hosting, besökarens enhet och uppkoppling.",
      },
    ],
  },
  {
    id: "seo",
    title: "Sökoptimering",
    intro: "Att synas när kunderna söker.",
    items: [
      {
        q: "Ingår SEO?",
        a: "Grunden ingår alltid. Fördjupat arbete med sökord och innehåll är ett tillval.",
      },
      {
        q: "Kan ni garantera förstaplats i Google?",
        a: "Nej, och ingen seriös byrå kan det. Vi arbetar systematiskt med det som faktiskt påverkar placeringen.",
      },
    ],
  },
  {
    id: "underhall",
    title: "Drift & support",
    intro: "Efter lansering.",
    items: [
      {
        q: "Måste vi ha underhåll?",
        a: "Nej, underhåll är valfritt och omfattar hjälp enligt vald nivå. Domän och hosting behövs för att sidan ska vara tillgänglig och betalas separat enligt offert.",
      },
      {
        q: "Hur snabbt får vi svar?",
        a: "Oftast samma arbetsdag, snabbare med prioriterad support.",
      },
    ],
  },
  {
    id: "juridik",
    title: "Avtal & GDPR",
    intro: "Det formella.",
    items: [
      {
        q: "Ingår integritets- och cookiepolicy?",
        a: "Jag hjälper till med struktur och grundtexter utifrån de faktiska tjänsterna och personuppgifterna på sidan. Du behöver bekräfta företagets rutiner och leverantörer. En samtyckeslösning behövs om den valda lösningen använder spårning som kräver samtycke.",
      },
      {
        q: "Vem äger sidan?",
        a: "Ni gör det — innehållet, domänen och den färdiga sidan.",
      },
    ],
  },
  {
    id: "leverans",
    title: "Tid & leverans",
    intro: "Hur lång tid det tar.",
    items: [
      {
        q: "Hur lång tid tar ett projekt?",
        a: "En mindre sida tar ofta 1–2 veckor, en större 4–6 veckor beroende på innehåll och funktioner.",
      },
      {
        q: "Vad brukar försena?",
        a: "Nästan alltid att material eller återkoppling dröjer. Vi håller en checklista för att undvika det.",
      },
    ],
  },
];

export const footer = {
  blurb:
    "En webbyrå i Dalarna för företag som vill ha tydliga svar, moderna lösningar och personlig hjälp även efter lansering.",
  columns: [
    {
      title: "Tjänster",
      links: services.map((s) => ({ label: s.title, to: "/tjanster" as const })),
    },
    {
      title: "Företaget",
      links: [
        { label: "Om oss", to: "/om-oss" as const },
        { label: "Kundcase", to: "/kundcase" as const },
        { label: "Priser", to: "/priser" as const },
        { label: "Mötesförfrågan", to: "/kontakt" as const },
        { label: "Integritetspolicy", to: "/integritetspolicy" as const },
      ],
    },
  ],
};
