/**
 * Skript 1: Formulärskapare
 * Skapar Google Formulär från fliken "Frågor".
 * Kör via menyval: 📝 Formulär → Skapa nytt formulär
 */

var FOLDER_ID = "1G7pfwIGuEB3SxfaLWSJoghRIw-pYYbSJ";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📝 Formulär")
    .addItem("Skapa nytt formulär", "skapaFormular")
    .addItem("Visa formulärlänkar", "visaFormularlankar")
    .addToUi();
}

function skapaFormular() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Frågor");

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Fliken "Frågor" hittades inte.');
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("Inga frågor hittades i fliken.");
    return;
  }

  var rubrikrad = data[0]; // Rad 1
  var alternativ = rubrikrad.slice(1).filter(function (v) { return v !== ""; });
  var flerval = alternativ.length >= 2;

  var formularnamn = ss.getName() + " – Formulär";
  var formular = FormApp.create(formularnamn);

  // Flytta formuläret till angiven mapp
  var fil = DriveApp.getFileById(formular.getId());
  var mapp = DriveApp.getFolderById(FOLDER_ID);
  mapp.addFile(fil);
  DriveApp.getRootFolder().removeFile(fil);

  // Lägg till frågor
  for (var i = 1; i < data.length; i++) {
    var fragtext = data[i][0];
    if (!fragtext) continue;

    if (flerval) {
      var item = formular.addMultipleChoiceItem();
      item.setTitle(fragtext);
      item.setChoiceValues(alternativ);
    } else {
      var item = formular.addTextItem();
      item.setTitle(fragtext);
    }
  }

  var redigeringslank = formular.getEditUrl();
  var publiUrl = formular.getPublishedUrl();

  var html = HtmlService.createHtmlOutput(
    "<p>Formuläret <strong>" + formularnamn + "</strong> har skapats!</p>" +
    "<p><a href='" + redigeringslank + "' target='_blank'>✏️ Redigera formuläret</a></p>" +
    "<p><a href='" + publiUrl + "' target='_blank'>🔗 Öppna formuläret</a></p>"
  )
    .setWidth(400)
    .setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(html, "Formulär skapat");
}

// Listar alla formulär i FOLDER_ID (huvudmappen) och dess undermappar (t.ex. en per
// område), grupperat per undermapp, så man slipper leta i Drive.
function visaFormularlankar() {
  var huvudmapp = DriveApp.getFolderById(FOLDER_ID);
  var grupper = [];

  var toppformular = hamtaFormularILank(huvudmapp);
  if (toppformular.length > 0) grupper.push({ namn: "", formular: toppformular });

  var undermappar = [];
  var mappIterator = huvudmapp.getFolders();
  while (mappIterator.hasNext()) undermappar.push(mappIterator.next());
  undermappar.sort(function (a, b) { return a.getName().localeCompare(b.getName()); });

  for (var i = 0; i < undermappar.length; i++) {
    var formular = hamtaFormularILank(undermappar[i]);
    if (formular.length > 0) grupper.push({ namn: undermappar[i].getName(), formular: formular });
  }

  var totalt = 0;
  for (var g = 0; g < grupper.length; g++) totalt += grupper[g].formular.length;

  if (totalt === 0) {
    SpreadsheetApp.getUi().alert("Inga formulär hittades i mappen.");
    return;
  }

  var html = grupper.map(function (grupp) {
    var rubrik = grupp.namn ? "<p style='margin:14px 0 4px;font-weight:bold;'>" + grupp.namn + "</p>" : "";
    var rader = grupp.formular.map(function (f) {
      return "<p style='margin:2px 0;'><a href='" + f.lank + "' target='_blank'>🔗 " + f.namn + "</a></p>";
    }).join("");
    return rubrik + rader;
  }).join("");

  var output = HtmlService.createHtmlOutput(html)
    .setWidth(420)
    .setHeight(Math.min(500, 80 + totalt * 32 + grupper.length * 24));

  SpreadsheetApp.getUi().showModalDialog(output, "Formulärlänkar (" + totalt + " st)");
}

// Hämtar {namn, lank} för alla Google-formulär direkt i en mapp, sorterat på namn.
function hamtaFormularILank(mapp) {
  var filer = mapp.getFilesByType(MimeType.GOOGLE_FORMS);
  var formular = [];
  while (filer.hasNext()) {
    var fil = filer.next();
    formular.push({
      namn: fil.getName(),
      lank: FormApp.openById(fil.getId()).getPublishedUrl()
    });
  }
  formular.sort(function (a, b) { return a.namn.localeCompare(b.namn); });
  return formular;
}
