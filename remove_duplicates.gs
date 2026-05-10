/**
 * Tar bort dubbletter där både ord (kolumn A) och ordklass (kolumn B) är identiska.
 * Om samma ord förekommer med olika ordklasser behålls alla rader.
 *
 * Kör funktionen från Appsscript-editorn eller lägg till en knapp i kalkylarket.
 */
function taBortDubbletter() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) return; // Inget att göra om arket är tomt eller bara har rubrikrad

  const harRubrik = true; // Ändra till false om det inte finns en rubrikrad
  const startRad = harRubrik ? 1 : 0;

  const sedda = new Set();
  const raderAttTaBort = [];

  for (let i = startRad; i < data.length; i++) {
    const ord = String(data[i][0]).trim().toLowerCase();
    const ordklass = String(data[i][1]).trim().toLowerCase();
    const nyckel = ord + "\t" + ordklass;

    if (sedda.has(nyckel)) {
      raderAttTaBort.push(i + 1); // Rader i Sheets är 1-indexerade
    } else {
      sedda.add(nyckel);
    }
  }

  // Ta bort nerifrån och upp så att radnumren inte förskjuts
  for (let i = raderAttTaBort.length - 1; i >= 0; i--) {
    sheet.deleteRow(raderAttTaBort[i]);
  }

  SpreadsheetApp.getUi().alert(
    `Klart! ${raderAttTaBort.length} dubblettrader togs bort.`
  );
}
