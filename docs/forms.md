# Kontakt och mötesförfrågningar

Kontaktformuläret och paketdialogen använder samma TanStack Start-serverfunktion (`src/server/enquiry.ts`) och leveranslogik (`src/server/enquiry.server.ts`). En Node-server krävs; statisk hosting räcker inte för formulären.

## Aktivering

1. Skapa ett Resend-konto och verifiera en avsändardomän som du äger enligt [Resends dokumentation](https://resend.com/docs/dashboard/domains/introduction). Domän och e-postadress är inte påhittade i koden.
2. Ange `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` (enbart verifierad e-postadress) och `ENQUIRY_TO_EMAIL` (din mottagaradress) som servermiljövariabler. Använd `.env` lokalt enligt README och hemlighetshanteringen hos din hosting i produktion. Variablerna får aldrig heta `VITE_*`.
3. Bygg och kör Node-servern enligt README. Tillåt utgående HTTPS till `api.resend.com`. Klienten kontaktar endast webbplatsens egen server.
4. Bekräfta personuppgiftsbiträde, lagringstid och kontaktuppgifter i integritetsinformationen innan publicering.

Utan korrekt konfiguration returnerar servern ett tydligt fel och formuläret behåller texten. Ingen lyckad leverans visas då. Regressionstester använder endast mockad transport; inga riktiga testmejl har skickats. Ett verkligt leveranstest kräver ägarens uttryckliga godkännande och korrekt konfiguration.

## Leverans och skydd

Servern validerar alla fält, begränsar längder, kontrollerar honungsfälla och tid från öppnat formulär (minst två sekunder, högst ett dygn). Befintligt TanStack CSRF-skydd i `src/start.ts` används även för den nya serverfunktionen. Priser räknas om från betrodda regler; inga summor från URL accepteras.

Transporten skickar ett textmejl via [Resends Send Email API](https://resend.com/docs/api-reference/emails/send-email). Besökarens adress används endast som `reply_to`; avsändare och mottagare kommer från serverkonfigurationen. En bekräftelse visas först efter HTTP-framgång och ett leverans-ID från tjänsten. Det betyder att tjänsten har godkänt meddelandet, inte att mottagarens inkorg garanterat har tagit emot det. Tidsgränsen är tio sekunder. [Idempotency-Key](https://resend.com/docs/dashboard/emails/idempotency-keys) används för återförsök; Resend behåller nycklar i 24 timmar.

Klienten låser formuläret medan det skickas och bevarar samma inskicks-ID vid återförsök av oförändrad text. Servern sammanför samtidiga dubbletter och minns lyckade ID:n i högst 24 timmar. Den lagrar endast HMAC-fingeravtryck, räknare och resultat i processminnet, inga meddelandetexter. HMAC använder den serverhemliga API-nyckeln. Felförsök får skickas igen med samma leveransnyckel. Gränsen är tre försök per e-postadress och totalt 60 per 15 minuter och Node-process; kartorna har fasta storleksgränser. Ingen IP-adress samlas in av denna kod.

Skyddet i processminnet återställs vid omstart och delas inte mellan flera repliker. Vid flera serverinstanser eller större trafik behövs en gemensam begränsning i reverse proxy/WAF eller ett delat rate-limit-lager. Konfigurera dessutom rimlig request body-gräns i proxyn (exempelvis 32 KB för dessa formulär). Servern loggar inga personmeddelanden, API-nycklar eller råa leveransfel. Kontrollera även hostingens egna loggar och inställningar.

## Offertval och integritet

Antal sidor, tillvals-ID:n och paket kan finnas i `quote` i URL och i flikens `sessionStorage` under `daladana.quote.v1`. Alla val valideras och belopp beräknas om. Namn, e-post, telefon och meddelandetext läggs aldrig i URL eller webbläsarlagring. De finns i formuläret tills besökaren skickar dem. Vid fel finns texten kvar på sidan men försvinner vid omladdning. Efter skickat formulär behandlas uppgifterna av Resend och mottagarens e-postleverantör. DALADANAs faktiska rutiner för lagring/radering, leverantörsavtal och eventuell internationell överföring behöver bekräftas av ägaren.

Dialogen är en mötesförfrågan, ingen kalenderbokning. Radix-dialogen sköter fokusfälla, Escape, skärmläsarnamn och återgång till öppningsknappen. Formulären har länk till integritetsinformationen.
