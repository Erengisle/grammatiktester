/**
 * Skript: PDF-facit-importerare
 *
 * Kör hämtaAlltFacitFrånPDF() en gång för att läsa facit-PDF:en från Drive
 * och fylla fliken "FACIT_PDF" med alla svar.
 *
 * Kolumner i FACIT_PDF:
 *   A: Övning (t.ex. "2 Adjektiv och substantiv - A och B")
 *   B: Nr     (t.ex. 2, 3, 4 ...)
 *   C: Svar   (t.ex. "lediga arbeten")
 *
 * Kör via: 📝 Formulär → Importera PDF-facit
 */

var PDF_FILNAMN    = "Form i fokus  B FACIT (1).pdf";
var PDF_MAPP_ID    = "1ro-cCTIcwdIgi556SFFIDQsuPr4XbKcD";
var FACIT_PDF_FLIK = "FACIT_PDF";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📝 Formulär")
    .addItem("Skapa nytt formulär", "skapaFormular")
    .addItem("Importera PDF-facit", "hämtaAlltFacitFrånPDF")
    .addItem("Kopiera facit till flik...", "kopieraFacitDialog")
    .addToUi();
}

function hämtaAlltFacitFrånPDF() {
  var mapp  = DriveApp.getFolderById(PDF_MAPP_ID);
  var filer = mapp.getFilesByName(PDF_FILNAMN);
  if (!filer.hasNext()) {
    SpreadsheetApp.getUi().alert(
      'Filen "' + PDF_FILNAMN + '" hittades inte i mappen.\n' +
      'Kontrollera att filnamnet stämmer exakt.'
    );
    return;
  }
  var pdfFil = filer.next();

  // Konvertera PDF → Google Doc (Drive gör text-extraktion)
  var docFil = Drive.Files.copy(
    { title: "__facit_tmp__", mimeType: MimeType.GOOGLE_DOCS },
    pdfFil.getId(),
    { convert: true, ocr: true, ocrLanguage: "sv" }
  );
  var doc   = DocumentApp.openById(docFil.id);
  var text  = doc.getBody().getText();
  DriveApp.getFileById(docFil.id).setTrashed(true); // städa bort tempfilen

  var rader = parsaFacitText(text);

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(FACIT_PDF_FLIK);
  if (!sheet) sheet = ss.insertSheet(FACIT_PDF_FLIK);

  sheet.clearContents();
  var rubrik = [["Övning", "Nr", "Svar"]];
  sheet.getRange(1, 1, 1, 3).setValues(rubrik);
  sheet.getRange(1, 1, 1, 3).setFontWeight("bold");

  if (rader.length > 0) {
    sheet.getRange(2, 1, rader.length, 3).setValues(rader);
  }

  SpreadsheetApp.getUi().alert(
    "Klart! " + rader.length + " svar importerade till fliken " + FACIT_PDF_FLIK + "."
  );
}

/**
 * Tolkar rå PDF-text och returnerar [[övning, nr, svar], ...]
 *
 * Formatet i PDF:en är:
 *   <nummer> <övningsrubrik>
 *   2 <svar>
 *   3 <svar>
 *   ...
 */
function parsaFacitText(text) {
  var rader       = [];
  var nuvarandeÖvning = "";
  var rader_text  = text.split("\n");

  // Mönster för övningsrubrik: rad som börjar med en siffra följt av mellanslag + stor bokstav
  var övningMönster = /^(\d+)\s+([A-ZÅÄÖ].{3,})/;
  // Mönster för svarrad: börjar med en siffra(or) följt av mellanslag
  var svarMönster   = /^(\d+)\s+(.+)/;

  for (var i = 0; i < rader_text.length; i++) {
    var rad = rader_text[i].trim();
    if (!rad) continue;

    var övningMatch = rad.match(övningMönster);
    if (övningMatch) {
      nuvarandeÖvning = övningMatch[1] + " " + övningMatch[2].trim();
      continue;
    }

    if (nuvarandeÖvning) {
      var svarMatch = rad.match(svarMönster);
      if (svarMatch) {
        var nr   = parseInt(svarMatch[1]);
        var svar = svarMatch[2].trim();
        // Filtrera bort sidnummer (t.ex. "s. 146")
        if (/^s\.\s*\d+$/.test(svar)) continue;
        rader.push([nuvarandeÖvning, nr, svar]);
      }
    }
  }

  return rader;
}
