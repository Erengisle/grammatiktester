/**
 * Skript: Facit-länkare
 *
 * Kopierar rätt rader från "FACIT_PDF" till en namngiven facitflik.
 *
 * Användning:
 *   1. Kör kopieraFacitDialog() via menyn för att välja övning och målflik.
 *   2. ELLER anropa kopieraFacitTillFlik("2 Adjektiv och substantiv - A och B", "Facit_Adj2")
 *      direkt från ett annat skript.
 *
 * Facitfliken får formatet som hamtaFacit() förväntar sig:
 *   A: Nr, B: Svar
 */

/**
 * Kopierar svar för en övning till en facitflik.
 * @param {string} övning  - Exakt övningsnamn enligt kolumn A i FACIT_PDF
 * @param {string} fliknamn - Målflikens namn (skapas om den saknas)
 */
function kopieraFacitTillFlik(övning, fliknamn) {
  var ss       = SpreadsheetApp.getActiveSpreadsheet();
  var källSheet = ss.getSheetByName("FACIT_PDF");

  if (!källSheet) {
    throw new Error('Fliken "FACIT_PDF" saknas. Kör "Importera PDF-facit" först.');
  }

  var data = källSheet.getDataRange().getValues();
  // Rad 1 = rubrik, hoppa över den
  var matchande = data.slice(1).filter(function (rad) {
    return rad[0].toString().trim() === övning.trim();
  });

  if (matchande.length === 0) {
    SpreadsheetApp.getUi().alert(
      'Inga svar hittades för övningen:\n"' + övning + '"\n\n' +
      'Kontrollera att övningsnamnet stämmer exakt med kolumn A i FACIT_PDF.'
    );
    return;
  }

  var målSheet = ss.getSheetByName(fliknamn);
  if (!målSheet) målSheet = ss.insertSheet(fliknamn);

  målSheet.clearContents();
  // Rubrikrad
  målSheet.getRange(1, 1, 1, 2).setValues([["Nr", "Svar"]]);
  målSheet.getRange(1, 1, 1, 2).setFontWeight("bold");

  // Svar: kolumn A = nr, kolumn B = svar (hamtaFacit() läser kolumn B = index 1)
  var svarRader = matchande.map(function (rad) {
    return [rad[1], rad[2]]; // nr, svar
  });
  målSheet.getRange(2, 1, svarRader.length, 2).setValues(svarRader);

  return matchande.length;
}

/**
 * Visar en dialog där läraren väljer övning och anger fliknamn.
 */
function kopieraFacitDialog() {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var källSheet = ss.getSheetByName("FACIT_PDF");

  if (!källSheet) {
    SpreadsheetApp.getUi().alert(
      'Fliken "FACIT_PDF" saknas. Kör "Importera PDF-facit" först.'
    );
    return;
  }

  // Hämta unika övningsnamn
  var data    = källSheet.getDataRange().getValues();
  var övningar = [];
  for (var i = 1; i < data.length; i++) {
    var namn = data[i][0].toString().trim();
    if (namn && övningar.indexOf(namn) === -1) övningar.push(namn);
  }

  if (övningar.length === 0) {
    SpreadsheetApp.getUi().alert("Inga övningar hittades i FACIT_PDF.");
    return;
  }

  var html = HtmlService.createHtmlOutput(byggerFacitDialogHtml(övningar))
    .setWidth(500)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Kopiera facit till flik");
}

function byggerFacitDialogHtml(övningar) {
  var options = övningar.map(function (ö) {
    return '<option value="' + ö + '">' + ö + '</option>';
  }).join("");

  return [
    '<style>body{font-family:Arial,sans-serif;padding:16px}',
    'label{display:block;margin-top:12px;font-weight:bold}',
    'select,input{width:100%;padding:6px;margin-top:4px;box-sizing:border-box}',
    'button{margin-top:16px;padding:8px 20px;background:#1a73e8;color:#fff;border:none;',
    'border-radius:4px;cursor:pointer}</style>',
    '<label>Övning (från FACIT_PDF)</label>',
    '<select id="ovning">' + options + '</select>',
    '<label>Facitflikens namn i kalkylarket</label>',
    '<input id="flik" type="text" placeholder="t.ex. Facit_Adj2" />',
    '<br><button onclick="kör()">Kopiera facit</button>',
    '<p id="status"></p>',
    '<script>',
    'function kör(){',
    '  var ö=document.getElementById("ovning").value;',
    '  var f=document.getElementById("flik").value.trim();',
    '  if(!f){document.getElementById("status").textContent="Ange ett fliknamn.";return;}',
    '  document.getElementById("status").textContent="Kopierar...";',
    '  google.script.run',
    '    .withSuccessHandler(function(n){',
    '      document.getElementById("status").textContent="Klart! "+n+" svar kopierades till "+f+".";',
    '    })',
    '    .withFailureHandler(function(e){',
    '      document.getElementById("status").textContent="Fel: "+e.message;',
    '    })',
    '    .kopieraFacitTillFlik(ö,f);',
    '}',
    '</script>'
  ].join("");
}
