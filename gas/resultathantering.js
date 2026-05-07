/**
 * Skript 2: Resultathantering
 * Triggas av onFormSubmit. Rättar, loggar och uppdaterar klassöversikt.
 * Eleven får en länk till webbappen istället för ett Drive-dokument.
 *
 * Flikar i kalkylarket:
 *   TESTREGISTER  – formulärsvar-sheet | testID | område | facitflik
 *   ELEVER        – A: email, B: namn, C: token (unik länknyckel)
 *   RESULTAT_LOGG – loggning av alla inlämningar
 *   KLASSOVERSIKT – bästa resultat per elev och test
 *
 * Konstant att fylla i:
 *   WEBAPP_URL – URL till den publicerade webbappen (Distribuera → Ny distribution)
 */

var WEBAPP_URL = "DIN_WEBAPP_URL_HÄR";

var FARG_ROD  = "#FF9999";
var FARG_GUL  = "#FFEB99";
var FARG_GRON = "#99E699";

// ---------------------------------------------------------------------------
// Huvudtrigger
// ---------------------------------------------------------------------------

function onFormSubmit(e) {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var svarSheet = e.range.getSheet();

  var testInfo = hittaTestInfo(ss, svarSheet.getName());
  if (!testInfo) {
    Logger.log("Inget testregister matchar sheet: " + svarSheet.getName());
    return;
  }

  var svarRad   = e.range.getRow();
  var timestamp = svarSheet.getRange(svarRad, 1).getValue();
  var email     = svarSheet.getRange(svarRad, 2).getValue().toString().toLowerCase().trim();

  var elevInfo = hittaElev(ss, email);
  if (!elevInfo) {
    Logger.log("Eleven hittades inte: " + email);
    return;
  }

  // Generera token om eleven saknar en
  var token = elevInfo.token;
  if (!token) {
    token = Utilities.getUuid();
    ss.getSheetByName("ELEVER").getRange(elevInfo.rad, 3).setValue(token);
    elevInfo.token = token;
    skickaValkommen(elevInfo.email, elevInfo.namn, token);
  }

  var facitData = hamtaFacit(ss, testInfo.facitflik);
  var svarData  = hamtaSvar(svarSheet, svarRad, facitData.length);
  var rattning  = ratta(svarData, facitData);

  loggaResultat(ss, timestamp, email, elevInfo.namn, testInfo.testId, testInfo.omrade, rattning);
  uppdateraKlassoversikt(ss, email, elevInfo.namn, testInfo.testId, rattning);
}

// ---------------------------------------------------------------------------
// Datahämtning
// ---------------------------------------------------------------------------

function hittaTestInfo(ss, sheetnamn) {
  var reg  = ss.getSheetByName("TESTREGISTER");
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
  var data   = elever.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase().trim() === email) {
      return { email: data[i][0], namn: data[i][1], token: data[i][2] || "", rad: i + 1 };
    }
  }
  return null;
}

function hittaElevMedToken(ss, token) {
  var elever = ss.getSheetByName("ELEVER");
  if (!elever) return null;
  var data   = elever.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === token) {
      return { email: data[i][0], namn: data[i][1], token: data[i][2] };
    }
  }
  return null;
}

function hamtaFacit(ss, facitflik) {
  var sheet = ss.getSheetByName(facitflik);
  if (!sheet) return [];
  return sheet.getDataRange().getValues().slice(1).map(function (r) { return r[1]; });
}

function hamtaSvar(svarSheet, rad, antal) {
  return svarSheet.getRange(rad, 3, 1, antal).getValues()[0];
}

// Returnerar bästa resultat per test för en elev (för webbappen)
function hamtaElevResultat(ss, email) {
  var logg = ss.getSheetByName("RESULTAT_LOGG");
  if (!logg) return [];
  var data  = logg.getDataRange().getValues();
  var basta = {}; // testId → raddata

  for (var i = 1; i < data.length; i++) {
    if (data[i][1].toString().toLowerCase().trim() !== email) continue;
    var testId  = data[i][3];
    var procent = parseInt(data[i][7]);
    if (!basta[testId] || procent > basta[testId].procent) {
      basta[testId] = {
        testId:    testId,
        omrade:    data[i][4],
        datum:     data[i][0],
        ratt:      data[i][5],
        totalt:    data[i][6],
        procent:   procent
      };
    }
  }

  return Object.keys(basta).map(function (k) { return basta[k]; });
}

// ---------------------------------------------------------------------------
// Rättning
// ---------------------------------------------------------------------------

function ratta(svar, facit) {
  var ratt = 0;
  for (var i = 0; i < facit.length; i++) {
    if (svar[i] !== undefined &&
        svar[i].toString().trim().toLowerCase() ===
        facit[i].toString().trim().toLowerCase()) ratt++;
  }
  var procent = facit.length > 0 ? Math.round((ratt / facit.length) * 100) : 0;
  return { ratt: ratt, totalt: facit.length, procent: procent };
}

// ---------------------------------------------------------------------------
// Loggning
// ---------------------------------------------------------------------------

function loggaResultat(ss, timestamp, email, namn, testId, omrade, rattning) {
  var logg = ss.getSheetByName("RESULTAT_LOGG");
  if (!logg) return;
  logg.appendRow([
    timestamp, email, namn, testId, omrade,
    rattning.ratt, rattning.totalt, rattning.procent
  ]);
}

// ---------------------------------------------------------------------------
// Välkomstmejl (skickas bara första gången)
// ---------------------------------------------------------------------------

function skickaValkommen(email, namn, token) {
  var lank = WEBAPP_URL + "?token=" + token;
  GmailApp.sendEmail(email, "Dina grammatikresultat", "", {
    htmlBody:
      "<p>Hej " + namn + "!</p>" +
      "<p>Du kan följa dina resultat på:</p>" +
      "<p><a href='" + lank + "' style='font-size:16px;'>📊 Öppna min resultatsida</a></p>" +
      "<p>Spara gärna länken – den fungerar för alla dina inlämningar.</p>"
  });
}

// ---------------------------------------------------------------------------
// Klassöversikt
// ---------------------------------------------------------------------------

function uppdateraKlassoversikt(ss, email, namn, testId, rattning) {
  var oversikt = ss.getSheetByName("KLASSOVERSIKT");
  if (!oversikt) return;

  var data  = oversikt.getDataRange().getValues();
  var kolom = -1;

  for (var k = 1; k < data[0].length; k++) {
    if (data[0][k] === testId) { kolom = k + 1; break; }
  }
  if (kolom === -1) {
    kolom = oversikt.getLastColumn() + 1;
    oversikt.getRange(1, kolom).setValue(testId);
  }

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

  var cell      = oversikt.getRange(elevRad, kolom);
  var befintlig = parseInt(cell.getValue()) || 0;
  if (rattning.procent > befintlig) {
    cell.setValue(rattning.procent);
    cell.setBackground(beraknaFarg(rattning.procent));
  }
}

// ---------------------------------------------------------------------------
// Färgkodning
// ---------------------------------------------------------------------------

function beraknaFarg(procent) {
  if (procent < 50) return FARG_ROD;
  if (procent < 75) return FARG_GUL;
  return FARG_GRON;
}
