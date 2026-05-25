/**
 * Skript: PDF-facit-importerare
 *
 * Kör fyllFacitPDF() en gång för att fylla fliken "FACIT_PDF" med
 * adjektiv-svaren ur Form i fokus B FACIT.
 *
 * OBS: Data är manuellt rensad från PDF:en eftersom PDF-layouten
 * har flera kolumner per sida som blandas vid automatisk textutläsning.
 *
 * Kolumner i FACIT_PDF:
 *   A: Övning (t.ex. "2 Adjektiv och substantiv - A och B")
 *   B: Nr     (t.ex. 2, 3, 4 ...)
 *   C: Svar   (t.ex. "lediga arbeten")
 *
 * Kör via: 📝 Formulär → Fyll FACIT_PDF
 */

var FACIT_PDF_FLIK = "FACIT_PDF";

// ---------------------------------------------------------------------------
// Meny
// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📝 Formulär")
    .addItem("Skapa nytt formulär", "skapaFormular")
    .addItem("Fyll FACIT_PDF (Adjektiv)", "fyllFacitPDF")
    .addItem("Kopiera facit till flik...", "kopieraFacitDialog")
    .addToUi();
}

// ---------------------------------------------------------------------------
// Adjektiv-data från Form i fokus B FACIT
// Övning B s. 145-154
// ---------------------------------------------------------------------------

var ADJEKTIV_FACIT = {
  "2 Adjektiv och substantiv - A och B": [
    [2,  "lediga arbeten"],
    [3,  "höga huset"],
    [4,  "hög lön ... dyra julklappar"],
    [5,  "rymlig lägenhet ... stora, gamla möbler"],
    [6,  "goda köttgrytan"],
    [7,  "snygg jacka ... tjock, varm jacka"],
    [8,  "bra betyg ... svåra prov"],
    [9,  "mjukt bröd ... hårt bröd"],
    [10, "bruna stövlar"],
    [11, "litet dammkorn"],
    [12, "röda nejlikorna"],
    [13, "intressant projekt"],
    [14, "dåliga betyg"],
    [15, "ledig dag"],
    [16, "vackert väder"],
    [17, "svarta skor ... svarta skor"],
    [18, "lilla rummet ... stora rummen"],
    [19, "nytt, politiskt parti"],
    [20, "god fiskrätt"],
    [21, "intressant bok"],
    [22, "personligt samtal"],
    [23, "rutiga överkastet"],
    [24, "full sysselsättning"],
    [25, "små bilarna"],
    [26, "utförligt reportage"],
    [27, "vackra parker"],
    [28, "definitiva besked"],
    [29, "gott samarbete"],
    [30, "ung/-a, -e politikern"],
    [31, "höga kostnader"],
    [32, "positiva erfarenheter"],
    [33, "små företag"],
    [34, "kvinnliga läkaren"],
    [35, "dumma fel"]
  ],

  "3 Adjektiv och substantiv - A, B och C": [
    [2,  "gemensamma utgifter"],
    [3,  "nya hus ... gamla huset"],
    [4,  "besvärliga hösta ... goda råd"],
    [5,  "korta meddelande"],
    [6,  "goda mat ... långa julhelgen"],
    [7,  "bussiga storasyster"],
    [8,  "nya bibliotek"],
    [9,  "arbetslösa ungdomar ... stora problemen"],
    [10, "nytt företag ... avundsjuka grannar"],
    [11, "gamla farfar"],
    [12, "värdefulla smycken"],
    [13, "stora helg"],
    [14, "nya äktenskap"],
    [15, "svåra mattetalet ... storebror"],
    [16, "svenska gymnasieskolan ... naturvetenskapliga programmet"],
    [17, "goda vin ... fina viner"],
    [18, "tunna höstkappa"],
    [19, "långa presskonferens ... nya sparpaket"],
    [20, "gamla serietidningar"],
    [21, "jämna födelsedag"],
    [22, "mörka kostym"],
    [23, "vita tyget"],
    [24, "memoarer ... fin kritik ... intressanta liv"],
    [25, "särskild anledning ... anteckningar"]
  ],

  "4 Adjektiv och substantiv - A-C + predikativt": [
    [2,  "moderna samhälle"],
    [3,  "ny/-a, -e kille"],
    [4,  "stora företaget"],
    [5,  "rolig nyhet"],
    [6,  "nöjda passagerarna"],
    [7,  "trötta"],
    [8,  "politiska artiklar ... intressanta"],
    [9,  "enorma framsteg"],
    [10, "ekonomiska situation"],
    [11, "felaktiga uppgifter"],
    [12, "tufft jobb"],
    [13, "sena planet"],
    [14, "tunt snötäcke"],
    [15, "mänskliga rättigheterna"],
    [16, "höga straff"],
    [17, "skönt ... lätta snöfallet"],
    [18, "svåra knäskada"],
    [19, "duktig tennisspelare"],
    [20, "mört"],
    [21, "höga månadslöner"],
    [22, "gamla möbler"],
    [23, "lyckliga"],
    [24, "grovt brott ... hemska saker"],
    [25, "vackra natur"],
    [26, "treåriga avtalet"],
    [27, "nya kläder ... jättetuffa"],
    [28, "liberala idéer"],
    [29, "arg"],
    [30, "viktigt ... stort språk"],
    [31, "korta jackan"],
    [32, "ledsna"],
    [33, "roligt program"],
    [34, "goda äpplena"],
    [35, "lugnt"],
    [36, "små flickor"],
    [37, "flotta hotell"],
    [38, "farligt"],
    [39, "litet ord"],
    [40, "tomma lägenheten"],
    [41, "gamla foton"],
    [42, "smutsiga kläderna"],
    [43, "ensamma faster"],
    [44, "lönsamt"],
    [45, "belåtna"],
    [46, "lediga jobb"],
    [47, "lilla rummet"],
    [48, "goda humör"],
    [49, "underligt"],
    [50, "hoppfullt"],
    [51, "uselt resultat"],
    [52, "gräsliga hatten"],
    [53, "dyra sjukhusvård"],
    [54, "färsk grädde"],
    [55, "arga hundarna ... farliga"],
    [56, "hett fotbad ... kalla fötter"],
    [57, "nödvändigt"],
    [58, "snälla barn"],
    [59, "nytt företag"],
    [60, "underbar man"],
    [61, "nya snabbtaget"],
    [62, "tungt"],
    [63, "liten siffra"],
    [64, "måttlig ... hård vind"],
    [65, "ny/-a, -e vaktmästare"]
  ]
};

// ---------------------------------------------------------------------------
// Fyll FACIT_PDF med rensad adjektiv-data
// ---------------------------------------------------------------------------

function fyllFacitPDF() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(FACIT_PDF_FLIK);
  if (!sheet) sheet = ss.insertSheet(FACIT_PDF_FLIK);

  sheet.clearContents();
  sheet.clearFormats();

  var rubrik = [["Övning", "Nr", "Svar"]];
  sheet.getRange(1, 1, 1, 3).setValues(rubrik);
  sheet.getRange(1, 1, 1, 3).setFontWeight("bold");

  var rader = [];
  var övningar = Object.keys(ADJEKTIV_FACIT);
  for (var i = 0; i < övningar.length; i++) {
    var övning = övningar[i];
    var svar   = ADJEKTIV_FACIT[övning];
    for (var j = 0; j < svar.length; j++) {
      rader.push([övning, svar[j][0], svar[j][1]]);
    }
  }

  if (rader.length > 0) {
    sheet.getRange(2, 1, rader.length, 3).setValues(rader);
  }

  SpreadsheetApp.getUi().alert(
    "Klart! " + rader.length + " adjektiv-svar skrivna till " + FACIT_PDF_FLIK + ".\n\n" +
    "Använd sedan \"Kopiera facit till flik...\" för att fylla en facitflik."
  );
}
