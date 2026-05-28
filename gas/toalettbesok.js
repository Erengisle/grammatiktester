// ====================================================
// TOALETTBESÖK – serverside (Code.gs i Apps Script)
// Klistra in detta i ditt Google Apps Script-projekt.
// ====================================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('toalettbesok')
    .setTitle('Toalettbesök')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getClasses() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .map(s => s.getName());
}

function getStudents(className) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  return data
    .filter(row => row[0])
    .map(row => ({
      name: String(row[0]),
      left: row[1] ? String(row[1]) : '',
      returned: row[2] ? String(row[2]) : ''
    }));
}

function logLeave(className, studentName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const lastRow = sheet.getLastRow();
  const names = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < names.length; i++) {
    if (names[i][0] === studentName) {
      const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HH:mm');
      sheet.getRange(i + 2, 2).setValue(now);
      sheet.getRange(i + 2, 3).setValue('');
      return { success: true, time: now };
    }
  }
  return { success: false };
}

function logReturn(className, studentName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const lastRow = sheet.getLastRow();
  const names = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < names.length; i++) {
    if (names[i][0] === studentName) {
      const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HH:mm');
      sheet.getRange(i + 2, 3).setValue(now);
      return { success: true, time: now };
    }
  }
  return { success: false };
}

function resetStudent(className, studentName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const lastRow = sheet.getLastRow();
  const names = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < names.length; i++) {
    if (names[i][0] === studentName) {
      sheet.getRange(i + 2, 2, 1, 2).clearContent();
      return { success: true };
    }
  }
  return { success: false };
}

function clearSession(className) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, 2, lastRow - 1, 2).clearContent();
  }
  return { success: true };
}

function setupSheetHeaders(className) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  if (!sheet) return;
  sheet.getRange('B1').setValue('Gick klockan');
  sheet.getRange('C1').setValue('Kom tillbaka klockan');
}
