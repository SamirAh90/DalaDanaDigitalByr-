# DALADANA

Personlig digitalbyrå i Ludvika, driven av Samir Ahmad. React 19, TypeScript, TanStack Start/Router, Vite 8 och Tailwind 4. Källkod, serverfunktioner, bilder, video, vektorlogotyper och licensierade typsnitt finns i repositoryt. Byggning och normal drift använder inga Lovable-tjänster.

## Installera och utveckla

Använd Node.js 22.12 eller senare (Node 22 LTS rekommenderas) och npm. `package-lock.json` är den gemensamma lockfilen; Bun behövs inte.

```sh
git clone https://github.com/SamirAh90/webarea-rediscovered.git
cd webarea-rediscovered
git switch migration/independent-daladana
npm ci
```

Kopiera `.env.example` till `.env` (PowerShell: `Copy-Item .env.example .env`, macOS/Linux: `cp .env.example .env`). Lämna e-postfälten tomma tills den riktiga tjänsten har konfigurerats.

```sh
npm run dev
```

Öppna `http://localhost:3000`. `.env` är ignorerad av Git. Lägg aldrig API-nycklar i `src/`, `public/`, `VITE_*` eller commits.

## Konfiguration

| Variabel             | När den används            | Innehåll                                                                             |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `PUBLIC_SITE_URL`    | Vid byggning               | Din verkliga publika origin, med `https://` och utan sökväg. Ingen domän är förvald. |
| `RESEND_API_KEY`     | Endast server, vid körning | Nyckel från ditt Resend-konto.                                                       |
| `ENQUIRY_FROM_EMAIL` | Endast server, vid körning | En ren e-postadress på en verifierad avsändardomän.                                  |
| `ENQUIRY_TO_EMAIL`   | Endast server, vid körning | Den faktiska mottagaradressen.                                                       |
| `HOST`, `PORT`       | Vid körning                | Lyssningsadress och port, normalt `0.0.0.0` och `3000`.                              |

Endast `PUBLIC_SITE_URL` exponeras uttryckligen till klienten. Efter ändring av denna krävs ett nytt bygge. Utan publik origin har sidorna `noindex`, robots blockerar indexering och sitemap svarar 503; det undviker att publicera en påhittad canonical-domän. Lokalt fungerar webbplatsen ändå.

Publika företagsuppgifter och riktiga sociala profiler konfigureras i `src/content/site.ts`. E-post, organisationsnummer och sociala ikoner visas inte när de är tomma. Intern e-postmottagare är en separat serverinställning. Ägaren har bekräftat telefonnumret 0700 22 15 20 och adressen Engelbrektgatan 24, Ludvika. Domän och e-postadress lämnas tills vidare oifyllda enligt ägarens beslut.

## Kontrollera och bygg

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm start
```

`npm start` kör den verkliga Node-servern på port 3000 och laddar `.env` om den finns. För en tillfällig förhandsvisning kan även `npm run preview` användas. Produktionsartefakten är hela `.output/`, inklusive `.output/public` och `.output/server`; enbart statisk uppladdning av HTML fungerar inte för formulären eller SSR.

Nuvarande TanStack Router har ett fel i automatisk koddelning när den absoluta arbetsmappen innehåller en apostrof. Vite-konfigurationen använder då odelade routes så att den befintliga Windows-mappen fungerar. Koddelning är automatiskt aktiv i vanliga checkout-sökvägar, till exempel `C:\projekt\daladana` eller `/srv/daladana`. Flytta inte eller byt namn på användarens arbetsmapp automatiskt.

## Egen hosting

Använd en Node-host eller en VPS med Node 22+, HTTPS och en processhanterare (exempelvis systemd). Bygg med utvecklingsberoenden installerade och rätt `PUBLIC_SITE_URL`, överför sedan hela `.output/` till servern. Ange hemligheterna i hostingens miljöinställningar och starta:

```sh
node .output/server/index.mjs
```

Processen behöver utgående HTTPS till `api.resend.com` för mejl. Tillåt trafik till Node via en TLS-terminerande omvänd proxy; exponera normalt inte Node-porten direkt. Proxy ska vidarebefordra den riktiga externa `Host`/`Origin` och protokollet så att TanStack Starts CSRF-kontroll fungerar. Begränsa formulärtrafik och begäransstorlek på proxyn; välj en gemensam rate-limit om flera Node-processer används. Behåll CSRF-middleware i `src/start.ts`.

Exempel för Nginx (ersätt `DIN_VERKLIGA_DOMÄN`, konfigurera TLS separat):

```nginx
server {
    listen 80;
    server_name DIN_VERKLIGA_DOMÄN;
    client_max_body_size 32k;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Docker är ett alternativ:

```sh
docker build --build-arg PUBLIC_SITE_URL=https://DIN_VERKLIGA_DOMÄN -t daladana .
docker run --env-file .env -e HOST=0.0.0.0 -e PORT=3000 -p 3000:3000 daladana
```

Dockerfilen kör som en användare utan root-behörighet. Dockersteget behöver tillgång till npm men ingen åtkomst till Lovable. Domänen måste anges vid byggning; e-postnyckeln skickas bara vid körning.

Utvecklingen publiceras från en separat Git-branch utan att skriva om huvudbranchens historik. Att pusha branchen är inte i sig en driftsättning; Netlify måste kopplas till rätt branch. Koppla bort eventuell automatisk Lovable-synk i ditt konto innan ändringarna senare förs in på den gamla anslutna huvudbranchen.

## Netlify

Projektet använder Netlifys officiella TanStack Start-adapter när miljövariabeln `NETLIFY=true` finns i byggmiljön. `netlify.toml` anger byggkommandot, publiceringskatalogen och Node 22.12. Lokal utveckling och egen Node-hosting fortsätter använda Nitro.

Anslut GitHub-repositoryt i Netlify och välj den branch som ska publiceras. Lägg sedan in `PUBLIC_SITE_URL`, `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` och `ENQUIRY_TO_EMAIL` under Netlifys miljövariabler. Hemligheter ska inte läggas i Git. Netlify kör `npm run build` och publicerar `dist/client`; adaptern skapar SSR-funktionen och routningen automatiskt.

## Bilder, video och typsnitt

Nödvändiga bildoriginal ligger i `public/assets/originals/`, optimerade resurser i `public/assets/` och lokala typsnitt med licenser i `public/assets/fonts/`. Hero-videon lagras endast som en optimerad fil i `public/assets/video/`; källans proveniens finns i manifestet. `src/lib/assets.ts` beskriver URL, dimensioner och responsiva bildvarianter. Den lokala delningsbilden är `public/assets/social-share.jpg`.

```sh
npm run assets:import
npm run assets:optimize
npm run assets:verify
```

Dessa är separata underhållskommandon; `npm ci`, utveckling och produktionsbygget kräver inte att originalen hämtas igen. Importen dokumenterar ursprung och kontrollerar filinnehållet. Se [resursinventeringen](docs/ASSETS.md) och dess manifest för exakta filnamn, storlekar och eventuella saknade filer. Äldre `.asset.json` är endast källdokumentation och används inte av webbplatsen. Byt inte ut användarens bildval om en källa försvinner.

`assets:verify` är helt lokalt och skrivskyddat. Det verifierar filsignaturer, storlekar, kontrollsummor och att klienten saknar runtime-kopplingar till Lovable. De ursprungliga casebilderna bevaras.

Nitro genererar och serverar gzip-/Brotli-varianter av textresurser automatiskt. Bevara dessa filer i hela `.output/` och låt proxyn vidarebefordra `Accept-Encoding`; annars ökar överföringsstorlek och laddtid.

Hero visar en optimerad stillbild som fallback på alla skärmstorlekar och när reducerad rörelse är vald. Videons källa tilldelas bara i klienten när användaren inte har valt reducerad rörelse. Offertval kan finnas i URL och sessionStorage; personliga formulärfält lagras inte där.

## Förfrågningar och integritet

Se [formulärens driftinstruktioner](docs/forms.md). Båda formulären använder samma validerade serverfunktion och samma prisregler. Ingen lyckad bekräftelse visas vid saknad konfiguration eller misslyckad leverans. Serverns godkännande betyder att e-postleverantören accepterat förfrågan, inte att mottagaren hunnit läsa den. En mötesförfrågan bokar ingen tid automatiskt. Riktiga testmejl får bara skickas efter uttryckligt godkännande.

Inga analys- eller marknadsföringsskript är installerade. Därför finns ingen överflödig samtyckesbanner. Integritetssidan beskriver faktisk lokal lagring och formulärhantering. Bekräfta domän, e-postkonfiguration, juridiska företagsuppgifter och hostingens personuppgiftshantering före publicering.

## Webbläsartest och prestanda

Bygg först, kör sedan `npm run test:browser`. Testerna startar och stoppar produktionsservern med e-postfunktionen uttryckligen avstängd. De använder installerad Microsoft Edge vid 360, 390, 768 och 1440 pixlar och blockerar utgående resurser till andra origins. Ingen webbläsare laddas ned automatiskt. På en annan miljö kan `channel: "msedge"` i `playwright.config.ts` anpassas till en installerad Chromium-webbläsare eller så kan `npx playwright install chromium` köras och `channel` tas bort.

Lighthouse körs separat mot en lokalt startad produktionsserver:

```sh
npx lighthouse http://127.0.0.1:3000 --chrome-flags="--headless" --output=html --output=json --output-path=reports/lighthouse-mobile
```

Verktygens laboratoriemätningar beror på dator, belastning, cache och nätverk. Kör om testerna med din riktiga origin efter driftsättning och spara bara rapporterna när de behövs.

Om Chrome inte hittas automatiskt kan miljövariabeln `CHROME_PATH` sättas till den installerade Chrome- eller Edge-binären innan Lighthouse startas. PowerShell: `$env:CHROME_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'`.

## Struktur

`src/routes/` är TanStack filbaserade routes. `src/content/site.ts` innehåller redaktionellt innehåll och `src/content/pricing.ts` numeriska prisregler. `src/lib/quote.ts` validerar och räknar offertval. `src/server/` innehåller serverfunktion och e-posttransport. `src/components/site/` innehåller webbplatsens återanvändbara delar; knapparnas varianter ligger i `src/components/ui/button.tsx` och visuella tokens i `src/styles.css`.

Kundprojektens vanliga utgående länkar är bevarade, även en kundlänk till en Lovable-hostad demo. Dessa används först när besökaren väljer att lämna webbplatsen och är inget bygg- eller resursberoende.
