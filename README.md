# Grammatiktester

Ett automatiserat system för att skapa grammatiktest, rätta elevernas svar och visa resultaten på en personlig resultatsida – allt via Google Kalkylark, Google Formulär och Google Apps Script.

> En snyggare, formaterad version av den här guiden finns i [`BRUKSANVISNING.html`](./BRUKSANVISNING.html) – öppna den i webbläsaren för samma innehåll med bättre layout.

## Innehåll

1. [Snabbstart](#snabbstart-har-du-varit-borta-ett-tag)
2. [Vad systemet gör](#vad-systemet-gör)
3. [Flödet steg för steg](#flödet-steg-för-steg)
4. [Kalkylarkstruktur](#kalkylarkstruktur)
5. [Apps Script-filerna](#apps-script-filerna)
6. [Första gången: sätta upp systemet](#första-gången-sätta-upp-systemet)
7. [Skapa ett nytt test](#skapa-ett-nytt-test)
8. [Lägga till elever](#lägga-till-elever)
9. [Webbapparna](#webbapparna)
10. [Vad som sköts automatiskt](#vad-som-sköts-automatiskt)
11. [Viktiga regler att komma ihåg](#viktiga-regler-att-komma-ihåg)
12. [Flytta Mastern & ta bort elever](#flytta-mastern--ta-bort-elever)
13. [Felsökning](#felsökning)

---

## Snabbstart (har du varit borta ett tag?)

Kom igång igen på två minuter – kolla det här innan du gör något annat:

**Snabbkontroll:**
1. Öppna Master-kalkylarket → **Tillägg → Apps Script**. Koden ska finnas i fem filer (se [avsnitt 5](#apps-script-filerna)).
2. Kontrollera att `WEBAPP_URL` längst upp i `resultathantering.gs` **inte** säger `"DIN_WEBAPP_URL_HÄR"`.
3. Klicka på klocksymbolen (**Utlösare**) och kontrollera att en trigger för `onFormSubmit` fortfarande finns och inte visar felmeddelanden.
4. Testa klassöversikten i webbläsaren: `LÄRAR_URL?view=klass`.

**Skapa ett nytt test – kortversion:**
1. Fyll i frågor i fliken **Frågor** (frågetext i kolumn A, från rad 2).
2. Meny **📝 Formulär → Skapa nytt formulär**.
3. Koppla formulärets **Svar**-flik till Master-kalkylarket (görs manuellt varje gång).
4. Skapa en facitflik (t.ex. `FACIT_V02`), ingen rubrikrad, svar i kolumn B.
5. Lägg till en rad i **Testregister** med TestID, Område, Facitflik och Svarssheet.

Fullständiga instruktioner finns i [avsnitt 7](#skapa-ett-nytt-test).

**Vanligaste snabbfixarna:**

| Symptom | Kör detta |
|---|---|
| Elever har trasiga länkar | `skickaOmLankar()` |
| Klassöversikten verkar inaktuell | `uppdateraKlassoversiktManuellt()` |

Se fullständig felsökningstabell i [avsnitt 13](#felsökning).

---

## Vad systemet gör

Systemet låter läraren skapa grammatiktest som Google Formulär, rätta dem automatiskt mot ett facit och visa varje elevs resultat på en personlig, snygg resultatsida. Läraren får också en klassöversikt i webbläsaren.

- **📝 Skapa test** – Fyll i frågor i kalkylarket, klicka på en knapp – formuläret skapas automatiskt.
- **✅ Automatisk rättning** – När en elev lämnar in rättas svaren mot facit och resultatet loggas direkt.
- **📊 Resultatvy** – Varje elev får en personlig länk till sina resultat. Läraren ser hela klassen.

## Flödet steg för steg

```
Elev svarar på formulär → Trigger aktiveras → Svar rättas mot facit
   → Loggas i RESULTAT_LOGG → Klassöversikt uppdateras

Första gången: Token genereras + välkomstmejl skickas
```

> 💡 Allt efter att eleven skickat in formuläret sker helt automatiskt – du behöver inte göra någonting.

## Kalkylarkstruktur

Allt samlas i ett Google Kalkylark som kallas **Master**. Det ska innehålla följande flikar:

| Flik | Kolumner | Syfte |
|---|---|---|
| Testregister | `A: TestID` `B: Område` `C: Facitflik` `D: Svarssheet` | En rad per test. Scriptet slår upp vilket facit och vilken svarssheet som hör till varje formulär. |
| Elever | `A: Email` `B: Namn` `C: Token` | En rad per elev. Token fylls i automatiskt första gången eleven lämnar in. Rad 1 = rubrikrad. |
| RESULTAT_LOGG | `A: Tidsstämpel` `B: Email` `C: TestID` `D: Område` `E: Procent` `F: Rätta` `G: Totalt` | En rad per inlämning. Byggs på automatiskt. Redigera aldrig manuellt. |
| KLASSÖVERSIKT | Byggs om automatiskt | Namn + upp till 10 individuella testresultat och ett medelvärde per område per elev, färgkodat. Byggs om helt från RESULTAT_LOGG vid varje inlämning – redigera aldrig manuellt. |
| FACIT_V01, FACIT_V02 … | `A: Frågenummer` `B: Rätt svar` | En facitflik per test. Ingen rubrikrad. Svaren ska stämma exakt med elevernas svar (gemener/versaler spelar ingen roll). |
| Frågor | `A: Frågetext` (endast rad 2 och nedåt) — `B+ rad 1`: svarsalternativ vid flerval | Fyll i frågorna här innan du skapar ett formulär. Används av formulärskaparen. **Rad 1 är alltid reserverad** och läses aldrig som fråga. |

> ⚠️ **Facitfliken har ingen rubrikrad.** Rad 1 är alltså redan det första svaret. Se till att antalet rader i facitfliken stämmer exakt med antalet frågor i formuläret.

> ⚠️ **Frågor-fliken har alltid en reserverad rad 1.** Formulärskaparen läser frågetext från rad 2 och nedåt i kolumn A – vad som än står i rad 1 kolumn A ignoreras. Om rad 1 kolumn B+ innehåller minst två värden blir *alla* frågor i formuläret flervalsfrågor med just de svarsalternativen (samma alternativ för hela formuläret, inte per fråga).

## Apps Script-filerna

Scriptkoden finns i fem filer under `gas/` i repot. Dessa kopieras in i Google Apps Script som är kopplat till Master-kalkylarket.

- **`formularskapare.js`** – Formulärskapare. Skapar ett Google Formulär från fliken "Frågor". Körs manuellt via menyval i kalkylarket: **📝 Formulär → Skapa nytt formulär**. Lägger formuläret i en angiven Google Drive-mapp.
- **`resultathantering.js`** – Resultathantering. Triggas automatiskt när en elev skickar in ett formulär. Rättar svaren mot facit, loggar resultatet, uppdaterar klassöversikten och skickar välkomstmejl med länk första gången.
- **`webbapp.js`** – Webbapp. Hanterar anrop till webbappen. Visar elevens resultatsida (`?token=…`) eller klassöversikten (`?view=klass`) beroende på URL-parametrar.
- **`webbapp1.html`** – Elevens resultatsida. HTML-mallen för elevens personliga resultatsida. Dashboard-layout med statistikkort, matristabell och sparklines.
- **`klassoversikt.html`** – Klassöversikt. HTML-mallen för lärarens klassöversikt. Sorterbar tabell med alla elever och deras medel per område; klicka på ett elevnamn för att se detaljer i ett modalfönster.

## Första gången: sätta upp systemet

### Steg 1 – Förbered Master-kalkylarket
1. Skapa ett nytt Google Kalkylark och döp det till något passande (t.ex. "Grammatiktester Master").
2. Skapa flikarna: `Testregister`, `Elever`, `RESULTAT_LOGG`, `Frågor`.
3. Lägg till rubrikrader i Testregister, Elever och RESULTAT_LOGG (se tabellen ovan).
4. Fyll i dina elevers e-postadresser och namn i **Elever**-fliken (kolumn A och B). Lämna kolumn C (Token) tom.

### Steg 2 – Öppna Apps Script
1. I kalkylarket: klicka på **Tillägg → Apps Script**.
2. Ta bort den tomma `Code.gs`-filen som skapas automatiskt.
3. Skapa fem nya filer och klistra in koden från respektive fil i `gas/`-mappen i repot:
   - `formularskapare.gs` ← innehållet från `gas/formularskapare.js`
   - `resultathantering.gs` ← innehållet från `gas/resultathantering.js`
   - `webbapp.gs` ← innehållet från `gas/webbapp.js`
   - `webbapp1.html` ← innehållet från `gas/webbapp1.html`
   - `klassoversikt.html` ← innehållet från `gas/klassoversikt.html`

### Steg 3 – Ändra FOLDER_ID i formularskapare.gs
Längst upp i `formularskapare.gs` finns:

```js
var FOLDER_ID = "1RtD6bsSQM7T-8wE8caxTY0QYet6Kxj5F";
```

Byt ut värdet mot ID:t för den Google Drive-mapp där du vill spara dina formulär. Mapp-ID:t hittar du i webbläsarens adressfält när du öppnar mappen i Google Drive (den långa teckensträngen i URL:en).

### Steg 4 – Publicera elevernas webbapp
1. I Apps Script: klicka på **Distribuera → Ny distribution**.
2. Välj typ: **Webbapp**.
3. Inställningar:
   - **Kör som:** Mig
   - **Vem har åtkomst:** Alla
4. Klicka **Distribuera** och kopiera den URL som visas.
5. Klistra in URL:en i `resultathantering.gs` längst upp:
   ```js
   var WEBAPP_URL = "https://script.google.com/a/macros/…";
   ```
6. Spara scriptet (Ctrl+S).

> ⚠️ **Viktigt:** Kopiera in URL:en innan eleverna börjar skicka in svar. Annars skickas välkomstmejlet med en felaktig länk.

### Steg 5 – Publicera lärarens klassöversikt
1. Klicka på **Distribuera → Ny distribution** igen (detta skapar en separat distribution med annan URL).
2. Inställningar:
   - **Kör som:** Mig
   - **Vem har åtkomst:** Bara jag
3. Klicka **Distribuera** och kopiera URL:en.
4. Din klassöversikt nås på: `DIN_LÄRAR_URL?view=klass`

### Steg 6 – Sätt upp triggern
1. I Apps Script: klicka på klocksymbolen i vänstermenyn (**Utlösare**).
2. Klicka på **Lägg till utlösare** (nedre höger).
3. Inställningar:
   - **Funktion:** `onFormSubmit`
   - **Händelsekälla:** Från kalkylark
   - **Händelsetyp:** Vid formulärinlämning
4. Spara. Godkänn de behörigheter som efterfrågas.

## Skapa ett nytt test

1. Öppna fliken **Frågor** i kalkylarket. Rensa eventuellt gammalt innehåll.
2. Rad 1 är alltid reserverad och räknas aldrig som fråga. Lämna rad 1 kolumn A tom (eller skriv en rubrik – den läses inte). Ska frågorna vara flervalsfrågor: skriv svarsalternativen i rad 1, kolumn B, C, D … (minst två). Skriv därefter frågorna i kolumn A **från och med rad 2**, en fråga per rad.
3. Klicka på menyn **📝 Formulär → Skapa nytt formulär**. (Om menyn saknas: ladda om sidan.)
4. Formuläret skapas och du får en dialogruta med en länk för att redigera och en länk för att dela med elever.
5. Öppna formuläret och koppla det till Master-kalkylarket:
   - Klicka på fliken **Svar** i formuläret.
   - Klicka på kalkylbladssymbolen (länka till kalkylark).
   - Välj **Välj ett befintligt kalkylblad** → välj ditt Master-kalkylark.
   - Google skapar en ny flik i kalkylarket med svaren (t.ex. "Verb 1 (svar)").
6. Skapa en facitflik i kalkylarket (t.ex. `FACIT_V01`):
   - Kolumn A: frågenummer (1, 2, 3 …) – valfritt, används ej av scriptet
   - Kolumn B: rätt svar, en per rad, **ingen rubrikrad**
7. Lägg till en rad i **Testregister**-fliken:
   - A: TestID (t.ex. `V01`)
   - B: Område (t.ex. `Verb`)
   - C: Facitflik (t.ex. `FACIT_V01`)
   - D: Svarssheet (exakt samma namn som fliken Google skapade, t.ex. `Verb 1 (svar)`)

> 💡 Kontrollera att namnet i Testregister kolumn D stämmer *exakt* med fliknamnet i kalkylarket – stora/små bokstäver och mellanslag spelar roll.

## Lägga till elever

Elever läggs till i **Elever**-fliken innan de börjar skicka in svar.

| Kolumn | Innehåll | Notering |
|---|---|---|
| A – Email | Elevens e-postadress | Måste stämma exakt med den adress eleven använder i formuläret. Gemener rekommenderas. |
| B – Namn | Elevens fullständiga namn | Visas i välkomstmejlet och på resultatsidan. |
| C – Token | Lämnas tom | Fylls i automatiskt vid elevens första inlämning. Rör den inte. |

> ℹ️ Om en elev inte finns i listan när hen skickar in loggas inget resultat och inget välkomstmejl skickas. Lägg alltid till elever *innan* testet.

## Webbapparna

Det finns två distributioner av webbappen med olika åtkomstinställningar:

**📊 Elevens resultatsida**
- **Åtkomst:** Alla (ingen inloggning krävs)
- **URL-format:** `WEBAPP_URL?token=xxx`
- Skickas automatiskt till eleven via välkomstmejl första gången hen lämnar in.

**🎓 Klassöversikt (lärare)**
- **Åtkomst:** Bara du (Google-inloggning krävs)
- **URL-format:** `LÄRAR_URL?view=klass`
- Öppnas direkt i webbläsaren. Visar alla elevers medel per område. Klicka på ett elevnamn för att se elevens individuella testresultat per område i ett detaljfönster.

> ⚠️ Det finns **två separata distributioner** – en för elever och en för läraren. De har olika URL:er och olika åtkomstinställningar. Blanda inte ihop dem.

## Vad som sköts automatiskt

När systemet är uppsatt behöver du normalt inte göra något efter att en elev lämnat in:

- Svaren rättas mot facit
- Resultatet loggas i RESULTAT_LOGG
- KLASSÖVERSIKT byggs om
- Om det är elevens första inlämning: token genereras och välkomstmejl skickas
- Om eleven lämnar in igen sparas det bästa resultatet per test

## Viktiga regler att komma ihåg

### Vid kodändringar – uppdatera version, inte distribution
När du ändrar koden i Apps Script måste du publicera ändringarna för att de ska gälla i webbappen. Gör **alltid** så här:
1. Klicka på **Distribuera → Hantera distributioner**.
2. Klicka på pennan ✏️ bredvid din befintliga distribution.
3. Under "Version" – välj **Ny version**.
4. Klicka Distribuera. URL:en förblir oförändrad.

> ⚠️ Skapar du en *ny* distribution får du en ny URL. Då fungerar inte elevernas sparade länkar längre och välkomstmejlen måste skickas om.

### Nya formulär kopplas manuellt
Google Apps Script kan inte automatiskt koppla ett nytt formulär till Master-kalkylarket. Det måste du göra manuellt via formulärets Svar-flik varje gång du skapar ett nytt test (se [avsnitt 7](#skapa-ett-nytt-test), steg 5).

### Rör aldrig RESULTAT_LOGG eller KLASSÖVERSIKT manuellt
Dessa flikar byggs om av scriptet. Manuella ändringar skrivs över eller kan orsaka fel.

## Flytta Mastern & ta bort elever

### Flytta Master-kalkylarket

Du kan lugnt flytta Master-kalkylarket till en annan mapp i Google Drive – **ingen kod behöver ändras**. Apps Script-koden är knuten till kalkylarkets fil-ID, inte till var filen ligger, så både scriptet och webbappens publicerade URL fortsätter fungera precis som förut.

> ⚠️ Det här gäller att *flytta* Mastern. Gör du istället en **kopia** av den får kopian ett nytt fil-ID – då måste du koppla om scriptet till kopian och göra en ny webbapp-distribution, eftersom den gamla fortfarande pekar på originalfilen.

Blanda inte ihop det här med `FOLDER_ID` i `formularskapare.gs` (se [avsnitt 6](#första-gången-sätta-upp-systemet), steg 3) – den styr bara **var nya Google Formulär sparas** när du skapar dem via menyn, inte var Mastern själv ligger. Flyttar du den mappen behöver du uppdatera `FOLDER_ID`; flyttar du Mastern behöver du inte ändra något alls.

### Ta bort elever och deras svar

Det finns ingen inbyggd "ta bort"-funktion i koden – det görs manuellt direkt i kalkylarket:

1. Ta bort elevens rad i **Elever**-fliken. Det gör också att elevens gamla resultatlänk slutar fungera (webbappen hittar då ingen elev med den token:en).
2. Ta bort elevens rader i **RESULTAT_LOGG** – sortera eller filtrera på kolumn B (Email) för att hitta dem.
3. Kör `uppdateraKlassoversiktManuellt()` i Apps Script så att **KLASSÖVERSIKT** byggs om direkt. Annars ligger de gamla resultaten kvar där tills nästa elev lämnar in något.
4. Vill du städa helt: ta även bort elevens rad(er) i respektive formulärs egen svarsflik (t.ex. "Verb 1 (svar)"). De påverkar inget i systemet om de ligger kvar, men kan vara bra att rensa av integritetsskäl.

## Felsökning

| Problem | Trolig orsak | Lösning |
|---|---|---|
| Elev får Google-felsida när hen öppnar sin länk | Länken i välkomstmejlet pekar på platshållar-URL (`DIN_WEBAPP_URL_HÄR`) – WEBAPP_URL var inte inställd när mejlet skickades | Kör funktionen `skickaOmLankar()` för att skicka korrekta länkar till alla elever med token |
| Inga resultat loggas trots att elever lämnat in | Trigern är inte satt, eller fliknamnet i Testregister stämmer inte med svarssheetens namn | Kontrollera triggern och att kolumn D i Testregister matchar exakt |
| Alla svar blir felaktiga (0%) | Facitets svar stämmer inte med elevernas svarformat | Korrigera facitfliken och kör `rattaOmAllaISheet()` för att rätta om befintliga svar |
| Välkomstmejl skickas aldrig | Elevens e-post i Elever-fliken stämmer inte med adressen i formuläret, eller eleven saknas i listan | Kontrollera att e-postadressen i Elever-fliken är identisk med den i formulärsvaret |
| KLASSÖVERSIKT ser konstig ut / kolumner på fel plats | Gammal data i loggen från testkörningar | Rensa RESULTAT_LOGG (behåll rubrikraden) och kör om rättningsfunktionen |
| Webbappen visar gamla resultat | Koden uppdaterades men en ny distribution skapades istället för en ny version | Se till att alltid använda "Ny version" i befintlig distribution, inte "Ny distribution" |

### Inbyggda hjälpfunktioner

Följande funktioner finns redan i `resultathantering.gs` och kan köras direkt från Apps Script:

| Funktion | Vad den gör |
|---|---|
| `skickaOmLankar()` | Skickar ett nytt mejl med korrekt länk till alla elever som har en token. Kör om elever fått en trasig länk. |
| `uppdateraKlassoversiktManuellt()` | Uppdaterar KLASSÖVERSIKT-fliken utan att vänta på ett nytt formulärinlämning. Praktisk efter manuella ändringar i RESULTAT_LOGG. |

### Hjälpfunktioner att lägga till vid behov

Dessa finns *inte* i koden – klistra in dem tillfälligt i `resultathantering.gs` om du behöver dem.

**Rätta om alla svar i en svarssheet:**

```js
// Byt svarssheetNamn till korrekt fliknamn och kör
function rattaOmAllaISheet() {
  var svarssheetNamn = "Verb 1 (svar)"; // ändra detta
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(svarssheetNamn);
  for (var rad = 2; rad <= sheet.getLastRow(); rad++) {
    onFormSubmit({ range: sheet.getRange(rad, 1) });
  }
}
```

**Testa ett enskilt svar utan att skicka in formuläret:**

```js
// Byt till rätt fliknamn och radnummer och kör
function testOnFormSubmit() {
  var svarssheetNamn = "Verb 1 (svar)"; // ändra detta
  var testRad = 2;                      // ändra detta
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(svarssheetNamn);
  onFormSubmit({ range: sheet.getRange(testRad, 1) });
}
```

---

Grammatiktester · [github.com/erengisle/grammatiktester](https://github.com/erengisle/grammatiktester)
