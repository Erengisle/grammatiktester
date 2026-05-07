/**
 * Skript 2: Resultathantering
 * Triggas av onFormSubmit. Rättar, loggar och uppdaterar elevblad.
 *
 * Flikar i kalkylarket:
 *   TESTREGISTER  – formulärsvar-sheet | testID | område | facitflik
 *   ELEVER        – A: email, B: namn, C: elevbladID
 *   RESULTAT_LOGG – loggning av alla inlämningar
 *
 * Konstanter:
 *   MALL_ID  – ID för elevbladsmallen
 *   MAPP_ID  – ID för mappen där elevblad sparas
 */

var MALL_ID = "DIN_MALL_ID_HÄR";
var MAPP_ID = "DIN_MAPP_ID_HÄR";

var FARG_ROD  = "#FF0000";
var FARG_GUL  = "#FFFF00";
var FARG_GRON = "#00FF00";

// ---------------------------------------------------------------------------
// Huvudtrigger
// ---------------------------------------------------------------------------

function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var svarSheet = e.range.getSheet();

  var testInfo = hittaTestInfo(ss, svarSheet.getName());
  if (!testInfo) {
    Logger.log("Inget testregister matchar sheet: " + svarSheet.getName());
    return;
  }

  var svarRad    = e.range.getRow();
  var timestamp  = svarSheet.getRange(svarRad, 1).getValue();
  var email      = svarSheet.getRange(svarRad, 2).getValue().toString().toLowerCase().trim();

  var elevInfo = hittaElev(ss, email);
  if (!elevInfo) {
    Logger.log("Eleven hittades inte: " + email);
    return;
  }

  var facitData  = hamtaFacit(ss, testInfo.facitflik);
  var svarData   = hamtaSvar(svarSheet, svarRad, facitData.length);
  var rattning   = ratta(svarData, facitData);

  loggaResultat(ss, timestamp, email, elevInfo.namn, testInfo.testId, testInfo.omrade, rattning);
  uppdateraElevblad(ss, elevInfo, testInfo, rattning, timestamp);
  uppdateraKlassoversikt(ss, email, elevInfo.namn, testInfo.testId, rattning);
}

// ---------------------------------------------------------------------------
// Hjälpfunktioner – datahämtning
// ---------------------------------------------------------------------------

function hittaTestInfo(ss, sheetnamn) {
  var reg = ss.getSheetByName("TESTREGISTER");
  if (!reg) return null;
  var data = reg.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === sheetnamn) {
      return { testId: data[i][1], omrade: data[i][2], facitflik: data[i][3] };
    }
  }
  return null;
}

function hittaElev(ss, email) {
  var elever = ss.getSheetByName("ELEVER");
  if (!elever) return null;
  var data = elever.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase().trim() === email) {
      return { email: data[i][0], namn: data[i][1], elevbladId: data[i][2], rad: i + 1 };
    }
  }
  return null;
}

function hamtaFacit(ss, facitflik) {
  var sheet = ss.getSheetByName(facitflik);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  return data.slice(1).map(function (r) { return r[1]; }); // Kolumn B = rätt svar
}

function hamtaSvar(svarSheet, rad, antal) {
  // Svar börjar i kolumn 3 (A=tidstämpel, B=email)
  return svarSheet.getRange(rad, 3, 1, antal).getValues()[0];
}

// ---------------------------------------------------------------------------
// Rättning
// ---------------------------------------------------------------------------

function ratta(svar, facit) {
  var ratt = 0;
  var detaljer = [];
  for (var i = 0; i < facit.length; i++) {
    var korrekt = svar[i] !== undefined &&
                  svar[i].toString().trim().toLowerCase() ===
                  facit[i].toString().trim().toLowerCase();
    if (korrekt) ratt++;
    detaljer.push({ fraga: i + 1, svar: svar[i], facit: facit[i], ratt: korrekt });
  }
  var procent = facit.length > 0 ? Math.round((ratt / facit.length) * 100) : 0;
  return { ratt: ratt, totalt: facit.length, procent: procent, detaljer: detaljer };
}

// ---------------------------------------------------------------------------
// Loggning
// ---------------------------------------------------------------------------

function loggaResultat(ss, timestamp, email, namn, testId, omrade, rattning) {
  var logg = ss.getSheetByName("RESULTAT_LOGG");
  if (!logg) return;
  logg.appendRow([
    timestamp, email, namn, testId, omrade,
    rattning.ratt, rattning.totalt, rattning.procent + "%"
  ]);
}

// ---------------------------------------------------------------------------
// Elevblad
// ---------------------------------------------------------------------------

function uppdateraElevblad(ss, elevInfo, testInfo, rattning, timestamp) {
  var elevbladId = elevInfo.elevbladId;

  // Skapa nytt elevblad om det saknas
  if (!elevbladId) {
    elevbladId = skapaNyttElevblad(elevInfo.email, elevInfo.namn);
    var eleverSheet = ss.getSheetByName("ELEVER");
    eleverSheet.getRange(elevInfo.rad, 3).setValue(elevbladId);
    elevInfo.elevbladId = elevbladId;
  }

  var elevSS   = SpreadsheetApp.openById(elevbladId);
  var resultat = elevSS.getSheetByName("Resultat") || elevSS.getSheets()[0];

  // Hitta befintligt bästa resultat för detta test
  var befintligRad = hittaBefintligTestRad(resultat, testInfo.testId);
  var procent      = rattning.procent;
  var farg         = beraknaFarg(procent);

  if (befintligRad) {
    var befintligProcent = parseInt(resultat.getRange(befintligRad, 4).getValue());
    if (procent <= befintligProcent) return; // Behåll bästa resultat
    skrivResultatRad(resultat, befintligRad, testInfo, rattning, timestamp, farg);
  } else {
    var nyRad = resultat.getLastRow() + 1;
    skrivResultatRad(resultat, nyRad, testInfo, rattning, timestamp, farg);
  }
}

function skapaNyttElevblad(email, namn) {
  var mall  = DriveApp.getFileById(MALL_ID);
  var mapp  = DriveApp.getFolderById(MAPP_ID);
  var kopia = mall.makeCopy(namn + " – Resultat", mapp);
  var id    = kopia.getId();

  // Dela med eleven
  kopia.addViewer(email);

  // Skicka e-post
  GmailApp.sendEmail(email, "Ditt resultatdokument", "", {
    htmlBody:
      "<p>Hej " + namn + "!</p>" +
      "<p>Ditt personliga resultatdokument är nu tillgängligt.</p>" +
      "<p><a href='https://docs.google.com/spreadsheets/d/" + id + "'>Öppna ditt resultatdokument</a></p>"
  });

  return id;
}

function hittaBefintligTestRad(sheet, testId) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === testId) return i + 1;
  }
  return null;
}

function skrivResultatRad(sheet, rad, testInfo, rattning, timestamp, farg) {
  var range = sheet.getRange(rad, 1, 1, 5);
  range.setValues([[
    testInfo.testId,
    testInfo.omrade,
    timestamp,
    rattning.procent,
    rattning.ratt + "/" + rattning.totalt
  ]]);
  range.getCell(1, 4).setBackground(farg);
}

// ---------------------------------------------------------------------------
// Klassöversikt
// ---------------------------------------------------------------------------

function uppdateraKlassoversikt(ss, email, namn, testId, rattning) {
  var oversikt = ss.getSheetByName("KLASSOVERSIKT");
  if (!oversikt) return;

  var data  = oversikt.getDataRange().getValues();
  var kolom = -1;

  // Hitta kolumn för testId (rad 1)
  for (var k = 1; k < data[0].length; k++) {
    if (data[0][k] === testId) { kolom = k + 1; break; }
  }
  if (kolom === -1) {
    kolom = oversikt.getLastColumn() + 1;
    oversikt.getRange(1, kolom).setValue(testId);
  }

  // Hitta rad för eleven (kolumn A)
  var elevRad = -1;
  for (var r = 1; r < data.length; r++) {
    if (data[r][0].toString().toLowerCase().trim() === email) {
      elevRad = r + 1; break;
    }
  }
  if (elevRad === -1) {
    elevRad = oversikt.getLastRow() + 1;
    oversikt.getRange(elevRad, 1).setValue(email);
    oversikt.getRange(elevRad, 2).setValue(namn);
  }

  var cell = oversikt.getRange(elevRad, kolom);
  var befintlig = parseInt(cell.getValue()) || 0;
  if (rattning.procent > befintlig) {
    cell.setValue(rattning.procent);
    cell.setBackground(beraknaFarg(rattning.procent));
  }
}

// ---------------------------------------------------------------------------
// Hjälpfunktion – färgkodning
// ---------------------------------------------------------------------------

function beraknaFarg(procent) {
  if (procent < 50) return FARG_ROD;
  if (procent < 75) return FARG_GUL;
  return FARG_GRON;
}

// ---------------------------------------------------------------------------
// Engångsfunktion: dela befintliga elevblad retroaktivt
// ---------------------------------------------------------------------------

function delaBefiintligaElevblad() {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var elever = ss.getSheetByName("ELEVER");
  var data   = elever.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var email      = data[i][0].toString().toLowerCase().trim();
    var namn       = data[i][1];
    var elevbladId = data[i][2];

    if (!elevbladId) continue;

    try {
      var fil = DriveApp.getFileById(elevbladId);
      fil.addViewer(email);
      Logger.log("Delade " + namn + " (" + email + ") – " + elevbladId);
    } catch (err) {
      Logger.log("Fel för " + email + ": " + err.message);
    }
  }

  Logger.log("Klart – alla befintliga elevblad delade.");
}
