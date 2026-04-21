// Google Apps Script — Workout Log
// Extensions → Apps Script → paste → Save → Deploy → New deployment
// Type: Web App | Execute as: Me | Who has access: Anyone

const SECRET = "thaiz-gym-2026";

// All requests come in as GET (Google redirects POST→GET for web apps)
// Write: ?action=write&secret=...&data=BASE64_JSON
// Read all: ?action=read&secret=...
// Read by date: ?action=read&secret=...&date=YYYY-MM-DD

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
