# Lokala resurser

Alla tidigare Lovable-pekare och deras ursprung finns dokumenterade i inventeringen. Nödvändiga originalfiler finns i `public/assets/originals/`, med samma underkatalog för `technology/`. Hero-videon är ett avsiktligt undantag och lagras endast som optimerad runtime-fil för att undvika dubbel lagring. Ursprungliga filnamn med `synord` och `dalanord` behålls för spårbarhet.

`public/assets/manifest.json` dokumenterar ursprunglig manifestfil, ursprungliga och försökta URL:er, lokal sökväg, användningsställen, filtyp, byteantal, SHA-256 och framtagna varianter. Arkiverade designresurser som inte visas i den nuvarande layouten finns kvar och är markerade. Originaladresser är endast dokumentation och används inte vid byggning eller normal drift.

`src/lib/assets.ts` och den genererade `src/lib/asset-metadata.json` är den gemensamma källan för responsiva bildadresser och dimensioner. Bilder visas som lokala WebP-varianter med `srcset`/`sizes`; SVG förblir vektor. Delningsbilden `public/assets/social-share.jpg` är 1200 × 630 och har komponerats av befintlig videostillbild och befintlig logotyp. Favicon ligger kvar som `public/favicon.png`.

## Storlekar

Tabellen jämför originalet med den största publicerade bildvarianten. På mindre skärmar väljer webbläsaren en mindre variant när upplösningen tillåter det. Samtliga original sparas, så minskningen gäller överföringen till besökaren och inte storleken på Git-katalogen.

| Resurs                   |       Original |          Största WebP | Minskning |
| ------------------------ | -------------: | --------------------: | --------: |
| Juridikcase              | 1 929 454 byte | 106 128 byte, 1200 px |    94,5 % |
| Kaffehuscase             | 2 143 375 byte | 112 280 byte, 1200 px |    94,8 % |
| Rozanscase               | 1 935 765 byte |  94 812 byte, 1200 px |    95,1 % |
| Vinterfoto, mobil        | 2 162 324 byte |   44 346 byte, 960 px |    97,9 % |
| Vinterfoto, desktop      |   133 200 byte |  77 768 byte, 1920 px |    41,6 % |
| Samir Ahmad              |   453 483 byte |   23 672 byte, 677 px |    94,8 % |
| Logotypmarkering         |   193 802 byte |   18 702 byte, 256 px |    90,3 % |
| Befintlig större logotyp |   571 111 byte |   79 036 byte, 861 px |    86,2 % |

Header/footer kan använda 64-pixelsvarianten av logotypmarkeringen, 3 746 byte, eller 128-pixelsvarianten på skärmar med hög pixeltäthet. Hero-stillbilden för mobil är 38 756 byte vid 480 px och 77 550 byte vid 768 px. Den kommer från en bildruta i samma valda video, inte ett ersättningsfoto.

## Video och rörelse

Hero-videon finns endast som `public/assets/video/dalanord-hero.webm`: 16 sekunder, 960 × 540, 20 bilder/sekund, VP9 CRF 44 utan ljud. Den ursprungliga källans URL, storlek och SHA-256 finns kvar i manifestet, men originalfilen dupliceras inte på webbhotellet.

`HeroMedia` renderar endast `<picture>` vid SSR och första hydrering. Ett videoelement och dess `src` skapas på mobil, surfplatta och desktop först när klientens mediefråga matchar `prefers-reduced-motion: no-preference`. Vid reducerad rörelse skapas ingen video-URL och filmen laddas inte ned. Stillbilden prioriteras högt; text och knappar väntar inte på video. Om uppspelning nekas eller misslyckas ligger stillbilden kvar.

## Typsnitt och licenser

IBM Plex Sans (vikt 300–700) och Cinzel (600–700) är självhostade som variabla WOFF2-filer med `font-display: swap`. Latin och Latin Extended finns lokalt för svenska och övriga latinska tecken. `public/assets/fonts/fonts.css` använder endast lokala URL:er. Google Fonts kontaktas inte av webbplatsen.

SIL Open Font License finns oförändrad i `public/assets/fonts/ibm-plex-sans-OFL.txt` och `public/assets/fonts/cinzel-OFL.txt`. Behåll dessa licenstexter vid vidare distribution.

## Återskapa import och optimering

Efter `npm ci`:

```sh
npm run assets:import
npm run assets:optimize
```

`npm run assets:verify` är en skrivskyddad kontroll som inte använder nätverket. Den kontrollerar samtliga inventerade filer, optimerade varianter och aktuella bildmetadata mot lokala sökvägar, filstorlekar, SHA-256 och filsignaturer. Den verifierar också typsnittsstilmallens lokala URL:er, responsiva bildkällor och att klientkoden inte återinför Lovable-pekare, globala integrationer eller externa Google Fonts-anrop. Arkiverad proveniens och vanliga kundlänkar är tillåtna. Kommandot misslyckas om en fil saknas, har ändrats utan uppdaterat manifest eller innehåller exempelvis en HTML-felsida.

Importen kräver nätverk endast för resurser som saknas och för att uppdatera typsnittsstilmallen. Den validerar PNG/JPEG/WebM/WOFF2-signaturer, SVG-innehåll och OFL-licenser innan filer skrivs. En HTML-felsida accepteras inte som media. Redan validerade lokala filer återanvänds. Om typsnittens fjärrstilmall är otillgänglig bevaras tidigare importerade lokala filer. Kör med `npm run assets:import -- --force` för uttrycklig återhämtning av redan befintliga filer. `ASSET_SOURCE_ORIGIN` kan sättas för att ändra importens primära ursprung; fallback är den tidigare publicerade projektadressen.

Optimeringen är helt lokal och använder Sharp och den plattformsanpassade FFmpeg-binären från `ffmpeg-static`. Den skapar WebP-varianter utan uppskalning, extraherar herons stillbild, komprimerar runtime-videon och skriver bildmetadata och manifest. `npm run assets:optimize -- --video-only` uppdaterar endast video/stillbilder/delningsbild, med redan genererade bildmetadata som grund.

`npm run build` och `npm start` behöver varken importskripten, nätåtkomst till ursprungen, Lovable-konto, Google Fonts eller FFmpeg. Alla nödvändiga resultat är vanliga filer i projektet och ska checkas in tillsammans med manifest och metadata.
