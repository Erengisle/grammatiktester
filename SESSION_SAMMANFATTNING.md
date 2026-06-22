# Grammatiktester – Projektsammanfattning

Repo: `erengisle/grammatiktester`, branch `main`

---

## Vad systemet är

Ett automatiserat system för grammatiktest byggt på Google Kalkylark, Google Formulär och Apps Script. Elever skickar in svar via formulär, scriptet rättar automatiskt, loggar resultat och visar dem på personliga resultatsidor.

---

## Filer i repot

| Fil | Syfte |
|---|---|
| `gas/formularskapare.js` | Skapar Google Formulär från "Frågor"-fliken |
| `gas/resultathantering.js` | Trigger-script: rättar, loggar, skickar mejl |
| `gas/webbapp.js` | Router för webbappen (`?token=` och `?view=klass`) |
| `gas/webbapp1.html` | Elevens resultatsida (Studio-design) |
| `gas/klassoversikt.html` | Lärarens klassöversikt (webbapp) |
| `BRUKSANVISNING.html` | Dokumentation för kollegor |

---

## Tekniska lösningar

### Elevens resultatsida (`webbapp1.html`)
- Studio-design med färgkodade celler, sparklines och statistikkort
- Visar resultat per område och testomgång

### Klassöversikt (`klassoversikt.html`)
- Sorterbar tabell med alla elever och deras medel per område
- Färgkodning med CSS-klasser (inte inline styles – Apps Scripts autoescape-bugg gör att `#`-färger i style-attribut ersätts med "ZautoescZ")
- Klicka på ett elevnamn → modal med alla individuella testresultat per område
- Mörk bakgrund (opacity 0.85) i modalen för elevsekretess

### Resultathantering (`resultathantering.js`)
- `onFormSubmit` – triggas vid varje inlämning
- `hamtaKlassData(ss)` – bygger data för klassöversiktens webbapp, inkl. individuella testresultat per elev
- `skickaOmLankar()` – skickar om länk till alla elever med token (om fel URL skickades från start)
- `uppdateraKlassoversiktManuellt()` – kör `uppdateraKlassoversikt` med rätt `ss`-argument, för manuell körning
- `skickaValkommen(email, namn, token)` – intern funktion, kallas automatiskt vid första inlämning

---

## Två separata distributioner i Apps Script

| Distribution | Åtkomst | Används till |
|---|---|---|
| Elevwebbapp | **Alla** | `WEBAPP_URL` i scriptet – elevernas personliga länk |
| Lärarvy | **Bara jag** | `LÄRAR_URL?view=klass` – klassöversikten |

**Viktig regel:** Uppdatera alltid med "Ny version" i befintlig distribution – aldrig "Ny distribution" (då ändras URL:en och elevernas länkar slutar fungera).

---

## Kalkylarkstruktur (Master)

| Flik | Kolumner |
|---|---|
| Testregister | A: TestID, B: Område, C: Facitflik, D: Svarssheet |
| Elever | A: Email, B: Namn, C: Token (fylls i automatiskt) |
| RESULTAT_LOGG | A: Tidsstämpel, B: Email, C: TestID, D: Område, E: Procent, F: Rätta, G: Totalt |
| KLASSÖVERSIKT | Byggs om automatiskt – rör aldrig manuellt |
| FACIT_V01 … | B: Rätt svar, **ingen rubrikrad** |

---

## Kända fallgropar

- **`WEBAPP_URL` måste sättas innan elever skickar in** – annars får de trasiga välkomstmejl. Lös med `skickaOmLankar()`.
- **Apps Scripts autoescape** förstör inline styles med `#`-färger i `<?= ?>`-taggar → använd CSS-klasser istället för inline styles.
- **`uppdateraKlassoversikt()` tar `ss` som parameter** – kör aldrig direkt, använd `uppdateraKlassoversiktManuellt()`.
- **Facitfliken har ingen rubrikrad** – rad 1 är redan första svaret.
- **`ratta()` kan inte köras direkt** – den anropas internt. Använd `testOnFormSubmit()` (läggs till tillfälligt) för manuell test.
- **Två distributioner, inte en** – elevdistributionen ska ha åtkomst "Alla", lärardistributionen "Bara jag". Blanda inte ihop URL:erna.

---

## HtmlService-mallar (Apps Script)

- `<?= värde ?>` – echo med autoescape (använd för text)
- `<?!= värde ?>` – echo utan autoescape (undvik för säkerhetsrisker, men nödvändigt i vissa fall)
- `<? kod ?>` – scriptlet utan output (beräkningar, loopar)
- **Bygg alltid style-strängar i `<? ?>`-block** och echo:a dem som klasnamn, inte som inline styles

---

## Färgpaletten (Studio-design)

| Nivå | Bakgrund | Text | CSS-klass |
|---|---|---|---|
| 0–49 | `#ecd5c5` | `#7a3a26` | `lvl-red` |
| 50–74 | `#efe1c1` | `#6b5524` | `lvl-yellow` |
| 75–89 | `#d4e2cc` | `#2c5a40` | `lvl-green` |
| 90–100 | `#b8cdb4` | `#1c4030` | `lvl-dark` |
| Saknas | – | `#c9c5b8` | `lvl-none` |

CSS-varibler: `--bg: #f4f1ea`, `--surface: #fff`, `--ink: #1c1f1d`, `--mute: #7a7a76`, `--hair: #ece8de`, `--accent: #3a6b54`, `--warn: #a86a3e`
