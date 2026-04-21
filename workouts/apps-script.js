// Google Apps Script — paste this into your Google Sheet's script editor
// Extensions → Apps Script → replace contents → Save → Deploy → New deployment
// Type: Web App | Execute as: Me | Who has access: Anyone
// Copy the deployment URL into CLAUDE.md as SHEETS_URL

const SECRET = "thaiz-gym-2026"; // simple key so only you can write

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.secret !== SECRET) {
      return json({ error: "unauthorized" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Log");
    if (!sheet) {
      sheet = ss.insertSheet("Log");
      sheet.appendRow(["Date", "Workout", "Exercise", "Set", "Weight (kg)", "Reps", "Side", "Notes"]);
      sheet.setFrozenRows(1);
    }

    const rows = payload.rows; // array of row objects
    rows.forEach(r => {
      sheet.appendRow([
        r.date,
        r.workout || "",
        r.exercise,
        r.set,
        r.weight_kg,
        r.reps,
        r.side || "",
        r.notes || ""
      ]);
    });

    return json({ status: "ok", saved: rows.length });
  } catch (err) {
    return json({ error: err.message });
  }
}

function doGet(e) {
  const payload = e.parameter;
  if (payload.secret !== SECRET) return json({ error: "unauthorized" });

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

  // optional filter by date param
  const filterDate = payload.date;
  const result = filterDate ? rows.filter(r => r["Date"] === filterDate) : rows;
  return json({ rows: result });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
