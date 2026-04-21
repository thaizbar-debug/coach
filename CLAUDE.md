# Coach Project — Claude Instructions

This project has two responsibilities:
1. **Workout logging** — save gym sessions to a Google Sheet via curl
2. **Coaching** — training, nutrition, and body composition advice (see SKILL.md)

---

## Workout Database

**Storage:** Google Sheet "Workout Log" via Apps Script endpoint
**SHEETS_URL:** `https://script.google.com/macros/s/AKfycbzLuEh2dSOiZFjjsG84qMwok9oI7-yVq6N3WqB-MZ9l6CRHHPiKyFr8hSzLoT5EL_8lgg/exec`
**SECRET:** `thaiz-gym-2026`

Columns: Date | Workout | Exercise | Set | Weight (kg) | Reps | Side | Notes

---

## Commands to recognize

| User says | Action |
|---|---|
| `log` / `logged` / `gym today` / `today's session` | Parse → POST rows to sheet |
| `show [today / yesterday / date]` | GET from sheet, display clean |
| `history` | GET all rows, group by date, list |
| `prs` / `personal records` | GET all rows, find max weight per exercise |
| `weekly summary` / `this week` | GET rows for current Mon–Sun |

---

## How to log a session

**Step 1 — Parse input** (accept any natural format):
- `hip thrust 3x12 @ 60kg`
- `rdl: 50kg, 3 sets of 10`
- `lateral raise 4 sets 10 reps 8kg`
- `leg press 80kg x 15 x 4`

No unit → assume **kg**. User says **lb** → divide by 2.2046, round to 1 decimal, store kg.

**Step 2 — Build the payload**

Each set = one row object:
```json
{
  "secret": "thaiz-gym-2026",
  "rows": [
    { "date": "YYYY-MM-DD", "workout": "Session Name", "exercise": "Hip Thrust", "set": 1, "weight_kg": 60, "reps": 12, "side": "", "notes": "" },
    { "date": "YYYY-MM-DD", "workout": "Session Name", "exercise": "Hip Thrust", "set": 2, "weight_kg": 60, "reps": 12, "side": "", "notes": "" }
  ]
}
```

**Step 3 — Send via bash (GET with base64 data)**

```bash
DATA=$(echo 'JSON_ROWS_ARRAY' | base64 -w 0)
curl -s "SHEETS_URL?action=write&secret=thaiz-gym-2026&data=${DATA}"
```

Where `JSON_ROWS_ARRAY` is just the rows array (not the full payload). Check the response for `{"status":"ok"}`. If error, show it to the user.

**Step 4 — Confirm with clean summary**

```
Saved — Mon Apr 21 2026  |  Upper Body

  Incline DB Press     4 sets  |  9.1→11.3 kg  |  10–12 reps
  Lat Pulldown         4 × 8   |  31.8 kg
  DB Shoulder Press    3 sets  |  6.8→9.1 kg   |  10–12 reps
  ...

  Total: 27 sets  ·  Volume: 2,840 kg
```

---

## How to read sessions

**GET single date:**
```bash
curl -s "SHEETS_URL?action=read&secret=thaiz-gym-2026&date=YYYY-MM-DD"
```

**GET all rows:**
```bash
curl -s "SHEETS_URL?action=read&secret=thaiz-gym-2026"
```

Parse the JSON response and format cleanly.

---

## Display formats

**Single session:** group rows by exercise, show sets/reps/weight, total sets, total volume.

**History:** one line per date — `Mon Apr 21 | Upper Body | 9 exercises · 27 sets · 2,840 kg`

**PRs:** highest weight_kg per exercise across all rows:
```
Personal Records
  Lat Pulldown      31.8 kg × 8
  Romanian DL       27 kg × 12
```

**Weekly summary:** total sessions, total volume, total sets, muscles hit, best lift per exercise.

---

## Rules

- Never ask for confirmation before saving — save then confirm.
- If weight is missing, ask once only.
- Display in kg. Show lb only if asked.
- User has **chondromalacia patella** (both knees) — if they log deep squats, full leg extensions, or jump squats, add a brief knee-safety note.
- If curl returns an error or non-200, show the raw response and stop.

---

## Setup status

Google Sheet URL: *not yet configured — see setup instructions in workouts/SETUP.md*
