/**
 * Skript 2: Resultathantering
 * Triggas av onFormSubmit. Rättar, loggar och uppdaterar klassöversikt.
 * Eleven får en länk till webbappen istället för ett Drive-dokument.
 *
 * Flikar i kalkylarket:
 *   Testregister  – A: TestID, B: Område, C: Facitflik, D: Svarssheet
 *   Elever        – A: Email, B: Namn, C: Token (unik länknyckel)
 *   RESULTAT_LOGG – A: Tidsstämpel, B: Email, C: TestID, D: Område,
 *                   E: Procent, F: Rätta, G: Totalt
 *   KLASSÖVERSIKT – A: Namn, B+: ett område per kolumn (rubrik i rad 1)
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
    ss.getSheetByName("Elever").getRange(elevInfo.rad, 3).setValue(token);
    elevInfo.token = token;
    skickaValkommen(elevInfo.email, elevInfo.namn, token);
  }

  var facitData = hamtaFacit(ss, testInfo.facitflik);
  var svarData  = hamtaSvar(svarSheet, svarRad, facitData.length);
  var rattning  = ratta(svarData, facitData);

  loggaResultat(ss, timestamp, email, testInfo.testId, testInfo.omrade, rattning);
  uppdateraKlassoversikt(ss, elevInfo.namn, testInfo.omrade, rattning);
}

// ---------------------------------------------------------------------------
// Datahämtning
// ---------------------------------------------------------------------------

function hittaTestInfo(ss, svarssheetNamn) {
  var reg  = ss.getSheetByName("Testregister");
  if (!reg) return null;
  var data = reg.getDataRange().getValues();
  // Rad 1 = rubrik, kolumn D (index 3) = Svarssheet
  for (var i = 1; i < data.length; i++) {
    if (data[i][3] === svarssheetNamn) {
      return { testId: data[i][0], omrade: data[i][1], facitflik: data[i][2] };
    }
  }
  return null;
}

function hittaElev(ss, email) {
  var elever = ss.getSheetByName("Elever");
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
  var elever = ss.getSheetByName("Elever");
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
  // Kolumn A = frågenummer, kolumn B = rätt svar
  return sheet.getDataRange().getValues().map(function (r) { return r[1]; });
}

function hamtaSvar(svarSheet, rad, antal) {
  // Kolumn A = tidstämpel, B = email, C+ = svar
  return svarSheet.getRange(rad, 3, 1, antal).getValues()[0];
}

// Returnerar bästa resultat per test för en elev (används av webbappen)
// RESULTAT_LOGG: A=Tidsstämpel, B=Email, C=TestID, D=Område, E=Procent, F=Rätta, G=Totalt
function hamtaElevResultat(ss, email) {
  var logg = ss.getSheetByName("RESULTAT_LOGG");
  if (!logg) return [];
  var data  = logg.getDataRange().getValues();
  var basta = {};

  for (var i = 1; i < data.length; i++) {
    if (!data[i][1] || data[i][1].toString().toLowerCase().trim() !== email) continue;
    var testId  = data[i][2];
    var procent = parseInt(data[i][4]) || 0;
    if (!basta[testId] || procent > basta[testId].procent) {
      basta[testId] = {
        testId:  testId,
        omrade:  data[i][3],
        datum:   data[i][0],
        procent: procent,
        ratt:    data[i][5],
        totalt:  data[i][6]
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
    var elevSvar  = svar[i] !== undefined ? svar[i].toString().trim().toLowerCase() : "";
    var rattSvar  = facit[i] !== undefined ? facit[i].toString().trim().toLowerCase() : "";
    var korrekt   = elevSvar === rattSvar;
    Logger.log("F" + (i+1) + ": elev='" + elevSvar + "' facit='" + rattSvar + "' → " + (korrekt ? "RÄTT" : "FEL"));
    if (korrekt) ratt++;
  }
  var procent = facit.length > 0 ? Math.round((ratt / facit.length) * 100) : 0;
  return { ratt: ratt, totalt: facit.length, procent: procent };
}

// ---------------------------------------------------------------------------
// Loggning
// RESULTAT_LOGG: A=Tidsstämpel, B=Email, C=TestID, D=Område, E=Procent, F=Rätta, G=Totalt
// ---------------------------------------------------------------------------

function loggaResultat(ss, timestamp, email, testId, omrade, rattning) {
  var logg = ss.getSheetByName("RESULTAT_LOGG");
  if (!logg) return;
  logg.appendRow([
    timestamp, email, testId, omrade,
    rattning.procent, rattning.ratt, rattning.totalt
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
// KLASSÖVERSIKT: A=Namn, rad 1 = rubriker, kolumn B+ = ett område per kolumn
// ---------------------------------------------------------------------------

function uppdateraKlassoversikt(ss, namn, omrade, rattning) {
  var oversikt = ss.getSheetByName("KLASSÖVERSIKT");
  if (!oversikt) return;

  var data  = oversikt.getDataRange().getValues();
  var kolom = -1;

  // Hitta kolumn för området (rad 1, från kolumn B)
  for (var k = 1; k < data[0].length; k++) {
    if (data[0][k] === omrade) { kolom = k + 1; break; }
  }
  if (kolom === -1) {
    kolom = oversikt.getLastColumn() + 1;
    oversikt.getRange(1, kolom).setValue(omrade);
  }

  // Hitta rad för eleven (kolumn A = Namn)
  var elevRad = -1;
  for (var r = 1; r < data.length; r++) {
    if (data[r][0].toString().trim() === namn) {
      elevRad = r + 1; break;
    }
  }
  if (elevRad === -1) {
    elevRad = oversikt.getLastRow() + 1;
    oversikt.getRange(elevRad, 1).setValue(namn);
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
