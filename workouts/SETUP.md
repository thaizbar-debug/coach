# One-time setup (5 minutes)

## 1. Create the Google Sheet

1. Go to Google Sheets → create a new blank sheet
2. Name it **"Workout Log"**

## 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**
2. Delete everything in the editor
3. Paste the contents of `workouts/apps-script.js`
4. Click **Save** (floppy disk icon)

## 3. Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the **Web app URL** — looks like:
   `https://script.google.com/macros/s/XXXXXX/exec`

## 4. Paste the URL into CLAUDE.md

Open `CLAUDE.md` in the repo and replace:
```
**SHEETS_URL:** *(paste your deployment URL here after setup)*
```
with:
```
**SHEETS_URL:** https://script.google.com/macros/s/XXXXXX/exec
```

Commit and push.

## 5. Backfill past sessions (optional)

Ask Claude in the project chat:
> `log for April 20: Romanian Deadlift 4x12 @ 27kg, Leg Press 3x15 @ 36.3kg...`

## Done

From now on, just type your workout in the claude.ai project chat:
> `logged: hip thrust 3x12 @ 65kg, RDL 3x10 @ 50kg`
