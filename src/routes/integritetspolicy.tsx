import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/components/site/CookieBanner";
import { company } from "@/content/site";

export const Route = createFileRoute("/integritetspolicy")({
  head: () => ({
    meta: [
      { title: "Integritet och lokal lagring | DALADANA" },
      {
        name: "description",
        content:
          "Så används uppgifter i DALADANAs kontaktformulär och offertflöde. Information om e-post, rättigheter och lokal lagring.",
      },
      { property: "og:title", content: "Integritet | DALADANA" },
      {
        property: "og:description",
        content: "Om kontaktuppgifter, förfrågningar och webbläsarens lokala lagring.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="container-page max-w-3xl pb-20 pt-28 md:pt-32">
      <p className="eyebrow">Integritet</p>
      <h1 className="mt-3 text-3xl md:text-4xl">Integritet och lokal lagring</h1>
      <p className="mt-4 text-sm text-muted-foreground">Uppdaterad 20 oktober 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-xl text-foreground">Vem du kontaktar</h2>
          <p className="mt-2">
            DALADANA drivs av Samir Ahmad. För frågor om dina uppgifter kan du ringa{" "}
            <a className="underline" href={company.phoneHref}>
              {company.phone}
            </a>
            {company.email ? (
              <>
                {" "}
                eller skriva till{" "}
                <a className="underline" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </>
            ) : (
              " eller använda kontaktformuläret när det är öppet för förfrågningar"
            )}
            .
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">När du skickar en förfrågan</h2>
          <p className="mt-2">
            Formuläret skickar namn, e-post, eventuellt företag och telefonnummer, ditt meddelande
            och dina offertval till servern. Uppgifterna används för att besvara din fråga,
            diskutera ett uppdrag och ta fram en offert. Skicka inte känsliga personuppgifter i
            formuläret.
          </p>
          <p className="mt-2">
            Behandlingen behövs för åtgärder inför ett möjligt avtal när du efterfrågar ett uppdrag.
            Andra kontaktfrågor behandlas för det berättigade intresset att kunna svara. Uppgifterna
            används inte för automatiska marknadsföringsutskick.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">E-post och leverantörer</h2>
          <p className="mt-2">
            När e-postfunktionen är konfigurerad använder servern Resend för att leverera förfrågan
            till DALADANAs inkorg. Ingen förfrågan markeras som skickad innan e-posttjänsten har
            godkänt den. Om tjänsten inte är tillgänglig visas ett fel och din text finns kvar i
            formuläret.
          </p>
          <p className="mt-2">
            Webbservern och e-postleverantören behandlar tekniska uppgifter som behövs för drift och
            leverans. Namn på slutlig hostingleverantör, lagringsregion, personuppgiftsbiträdesavtal
            och eventuella överföringar utanför EU/EES ska bekräftas innan kontaktflödet tas i
            drift.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Lagring och skydd</h2>
          <p className="mt-2">
            Personliga formulärfält sparas inte i webbläsarens permanenta lagring. På servern
            används kortlivade hashvärden och räknare för att begränsa spam och dubbla inskick.
            Begränsningsdata finns i upp till 15 minuter och information om godkända inskick i upp
            till 24 timmar. Meddelandet sparas inte i en webbplatsdatabas.
          </p>
          <p className="mt-2">
            Skickade förfrågningar finns i mottagarens e-post och hos e-postleverantören enligt
            deras inställningar. En rutin för gallring i inkorgen, hantering av avtal och
            leverantörens lagringstider behöver fastställas före publicering. Någon obekräftad
            automatisk gallringstid utlovas därför inte här.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Cookies och offertval</h2>
          <p className="mt-2">
            Den här versionen använder inga analysverktyg, reklampixlar eller spårningscookies.
            Bilder, video, logotyper och typsnitt hämtas från den egna webbplatsen. Därför visas
            ingen banner för samtycke till spårning.
          </p>
          <p className="mt-2">
            Offertval kan sparas i sessionStorage tills fliken stängs och i adressen när du öppnar
            en offertlänk. Adressen innehåller bara antal sidor och identifierare för paket eller
            tillval, aldrig personliga kontaktuppgifter eller ditt meddelande. Om du delar länken
            delar du också dessa offertval.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={openCookieSettings}>
            Visa och rensa lokal lagring
          </Button>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Dina rättigheter</h2>
          <p className="mt-2">
            Du kan begära information om och tillgång till dina personuppgifter, rättelse, radering
            eller begränsning, samt invända mot behandling. Rätten beror på vilken behandling det
            gäller. Kontakta Samir via kontaktvägen ovan. Du kan också{" "}
            <a
              href="https://www.imy.se/privatperson/dataskydd/dina-rattigheter/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              läsa om dina rättigheter och lämna klagomål till Integritetsskyddsmyndigheten
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
