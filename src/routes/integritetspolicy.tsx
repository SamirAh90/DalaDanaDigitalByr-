import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/components/site/CookieBanner";
import { company } from "@/content/site";

export const Route = createFileRoute("/integritetspolicy")({
  head: () => ({
    meta: [
      { title: "Integritetspolicy och lokal lagring | DALADANA" },
      {
        name: "description",
        content:
          "Så behandlar DALADANA personuppgifter i kontaktformulär, e-post, tekniska loggar och lokal lagring.",
      },
      { property: "og:title", content: "Integritetspolicy | DALADANA" },
      {
        property: "og:description",
        content: "Information om personuppgifter, leverantörer, rättigheter och lokal lagring.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="container-page max-w-3xl pb-20 pt-28 md:pt-32">
      <p className="eyebrow">Integritet</p>
      <h1 className="mt-3 text-3xl md:text-4xl">Integritetspolicy och lokal lagring</h1>
      <p className="mt-4 text-sm text-muted-foreground">Senast uppdaterad 23 oktober 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-xl text-foreground">Personuppgiftsansvarig</h2>
          <p className="mt-2">
            DALADANA, som drivs av Samir Ahmad, ansvarar för behandlingen av personuppgifter på
            webbplatsen. Kontaktadress är {company.address.join(", ")}. Du kan ringa{" "}
            <a className="underline" href={company.phoneHref}>
              {company.phone}
            </a>{" "}
            eller använda webbplatsens kontaktformulär.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Vilka uppgifter som behandlas</h2>
          <p className="mt-2">
            När du skickar en förfrågan lämnar du namn, e-postadress och meddelande. Du kan också
            lämna företag, telefonnummer, önskad tjänst och offertval. Uppgifterna kommer direkt
            från dig. Namn, e-post och meddelande är obligatoriska för att förfrågan ska kunna
            skickas; övriga fält är frivilliga. Skicka inte känsliga personuppgifter i formuläret.
          </p>
          <p className="mt-2">
            Vid ett besök kan hostingleverantören behandla tekniska uppgifter, exempelvis IP-adress,
            tidpunkt, begärd adress, hänvisande sida samt information om webbläsare och enhet, för
            att leverera och skydda webbplatsen.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Ändamål och rättslig grund</h2>
          <p className="mt-2">
            Uppgifter i en offert- eller mötesförfrågan behandlas för att besvara dig, diskutera ett
            möjligt uppdrag och vid behov ta fram en offert. När du efterfrågar en tjänst är den
            rättsliga grunden åtgärder innan avtal. Övriga kontaktfrågor och tekniskt skydd mot
            spam, missbruk och driftstörningar behandlas med stöd av DALADANAs berättigade intresse
            av att kunna kommunicera och driva en säker webbplats.
          </p>
          <p className="mt-2">
            Uppgifterna används inte för automatiska marknadsföringsutskick, profilering eller
            automatiserat beslutsfattande.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Mottagare och leverantörer</h2>
          <p className="mt-2">
            Loopia tillhandahåller domän- och DNS-tjänster. Netlify tillhandahåller hosting och
            serverkörning. Resend överför formulärets innehåll som e-post till DALADANAs mottagande
            e-postkonto. Dessa leverantörer behandlar uppgifter för att göra webbplatsen tillgänglig
            och leverera meddelandet. Uppgifter kan även lämnas ut när det krävs enligt lag eller
            för att fastställa, göra gällande eller försvara rättsliga anspråk.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Överföring utanför EU/EES</h2>
          <p className="mt-2">
            Netlify och Resend är amerikanska leverantörer. Behandling kan därför ske i eller göras
            tillgänglig från USA. Även den mottagande e-posttjänsten kan behandla uppgifter utanför
            EU/EES. Leverantörernas avtalsvillkor använder tillämpliga överföringsmekanismer, bland
            annat EU-kommissionens standardavtalsklausuler och, när det är tillämpligt, EU–USA:s
            ramverk för dataskydd. Du kan kontakta DALADANA för information om de skyddsåtgärder som
            gäller för behandlingen.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Lagring och säkerhet</h2>
          <p className="mt-2">
            Webbplatsen har ingen databas med inskickade meddelanden. Servern använder kortlivade
            hashvärden och räknare för att begränsa spam och dubbla inskick. Begränsningsdata finns
            i högst 15 minuter och information om godkända inskick i högst 24 timmar i den aktuella
            serverprocessen.
          </p>
          <p className="mt-2">
            Resend behåller e-post- och loggdata i 30 dagar för aktuella standardplaner. Förfrågan
            finns därefter i DALADANAs e-postinkorg och sparas tills den har hanterats och inte
            längre behövs för kontakten, ett möjligt avtal eller rättsliga anspråk. Uppgifter som
            måste bevaras enligt lag kan sparas längre. Netlify kan bevara tekniska drift- och
            säkerhetsloggar enligt sina tjänstevillkor och lagringsrutiner.
          </p>
          <p className="mt-2">
            Åtkomst begränsas till Samir Ahmad och de leverantörer som behövs för driften. Trafiken
            till webbplatsen och e-postleverantören skyddas med krypterad överföring.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Cookies och lokal lagring</h2>
          <p className="mt-2">
            Webbplatsen sätter inga egna cookies och använder inga analysverktyg, reklampixlar eller
            spårningscookies. Därför visas ingen samtyckesbanner. Bilder, video, logotyper och
            typsnitt levereras lokalt från webbplatsen.
          </p>
          <p className="mt-2">
            Om du använder priskalkylatorn sparas valet under nyckeln <code>daladana.quote.v1</code>{" "}
            i webbläsarens sessionStorage. Det innehåller endast antal sidor och identifierare för
            valda paket eller tillval, inte namn, e-post, telefon eller meddelande. Lagringen behövs
            för den offertfunktion du begär och försvinner normalt när fliken stängs. Offertval kan
            också finnas i adressen om du öppnar eller delar en offertlänk.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={openCookieSettings}>
            Visa och rensa lokal lagring
          </Button>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Externa länkar</h2>
          <p className="mt-2">
            Webbplatsen länkar till bland annat sociala medier och kunders webbplatser. När du
            väljer en sådan länk lämnar du DALADANAs webbplats och den externa tjänstens egen
            integritetspolicy gäller.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Dina rättigheter</h2>
          <p className="mt-2">
            Du kan, beroende på omständigheterna, begära tillgång till dina uppgifter, rättelse,
            radering, begränsning och dataportabilitet samt invända mot behandling som grundas på
            berättigat intresse. Kontakta DALADANA via uppgifterna ovan. Identiteten kan behöva
            kontrolleras innan en begäran hanteras.
          </p>
          <p className="mt-2">
            Om du anser att dina uppgifter behandlas felaktigt kan du lämna klagomål till{" "}
            <a
              href="https://www.imy.se/privatperson/dataskydd/dina-rattigheter/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Integritetsskyddsmyndigheten (IMY)
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl text-foreground">Ändringar</h2>
          <p className="mt-2">
            Policyn uppdateras när webbplatsens funktioner, leverantörer eller behandling av
            personuppgifter förändras. Datumet högst upp visar den senaste uppdateringen.
          </p>
        </div>
      </div>
    </section>
  );
}
