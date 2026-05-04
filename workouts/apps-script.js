// Google Apps Script — Workout Log
// Extensions → Apps Script → paste → Save → Deploy → New deployment
// Type: Web App | Execute as: Me | Who has access: Anyone
//
// After pasting and deploying, set up the auto-import trigger:
//   Triggers (clock icon) → Add Trigger → processStagingFiles
//   Event source: Time-driven | Type: Minutes timer | Every 30 minutes

const SECRET = "thaiz-gym-2026";
const STAGING_FOLDER_ID = "1yPug7jK1iZFlkhSuMBbdUCf9AsZQz_bU";

// ---------------------------------------------------------------------------
// Auto-import: runs every 30 min, picks up CSV files the coach drops in the
// staging folder, appends rows to the Log sheet, then trashes the file.
// ---------------------------------------------------------------------------
function processStagingFiles() {
  const folder = DriveApp.getFolderById(STAGING_FOLDER_ID);
  const files = folder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const mime = file.getMimeType();

    let rows = [];

    if (mime === "application/vnd.google-apps.spreadsheet") {
      // CSV auto-converted to Google Sheet by Drive
      const stagingSheet = SpreadsheetApp.openById(file.getId()).getSheets()[0];
      const values = stagingSheet.getDataRange().getValues();
      rows = values.filter((r, i) => i > 0 && r[0] !== "" && r[0] !== "Date");
    } else if (mime === "text/csv" || mime === "text/plain") {
      const csv = file.getBlob().getDataAsString();
      rows = Utilities.parseCsv(csv)
        .filter((r, i) => i > 0 && r[0] !== "" && r[0] !== "Date")
        .map(r => r.map(cell => cell.trim()));
    }

    if (rows.length > 0) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName("Log");
      if (!sheet) {
        sheet = ss.insertSheet("Log");
        sheet.appendRow(["Date", "Workout", "Exercise", "Set", "Weight (kg)", "Reps", "Side", "Notes"]);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
      }
      rows.forEach(r => sheet.appendRow(r));
    }

    file.setTrashed(true);
  }
}

// ---------------------------------------------------------------------------
// Web app (kept for manual/terminal use)
// ---------------------------------------------------------------------------
function doGet(e) {
  const p = e.parameter;
  if (p.secret !== SECRET) return json({ error: "unauthorized" });

  if (p.action === "write") {
    try {
      const rows = JSON.parse(Utilities.newBlob(Utilities.base64Decode(p.data)).getDataAsString());
      return writeRows(rows);
    } catch (err) {
      return json({ error: err.message });
    }
  }

  if (p.action === "read") {
    return readRows(p.date || null);
  }

  return json({ error: "unknown action" });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.secret !== SECRET) return json({ error: "unauthorized" });
    return writeRows(payload.rows);
  } catch (err) {
    return json({ error: err.message });
  }
}

function writeRows(rows) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Log");
  if (!sheet) {
    sheet = ss.insertSheet("Log");
    sheet.appendRow(["Date", "Workout", "Exercise", "Set", "Weight (kg)", "Reps", "Side", "Notes"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
  }
  rows.forEach(r => {
    sheet.appendRow([r.date, r.workout || "", r.exercise, r.set, r.weight_kg, r.reps, r.side || "", r.notes || ""]);
  });
  return json({ status: "ok", saved: rows.length });
}

function readRows(filterDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Log");
  if (!sheet) return json({ rows: [] });
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  const result = filterDate ? rows.filter(r => r["Date"] === filterDate) : rows;
  return json({ rows: result });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
