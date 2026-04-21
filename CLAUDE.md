# Coach Project — Claude Instructions

This project has two responsibilities:
1. **Workout logging** — save gym sessions as JSON files directly to GitHub via the GitHub MCP tool
2. **Coaching** — training, nutrition, and body composition advice (see SKILL.md)

---

## Workout Logging

### Commands to recognize

| User says | Action |
|---|---|
| `log` / `logged` / `gym today` / `today's session` | Save session to GitHub via API |
| `show [today / yesterday / date / this week]` | Read and display session(s) |
| `history` | List all sessions newest-first |
| `prs` / `personal records` | Best weight per exercise across all files |
| `weekly summary` / `this week` | Volume, sets, muscles hit for current week |
| `edit [date]` | Read file → apply user changes → rewrite to GitHub |
| `delete [date]` | Delete file via GitHub API |

---

### How to save a session

**Step 1 — Parse input** (accept any natural format):
- `hip thrust 3x12 @ 60kg`
- `rdl: 50kg, 3 sets of 10`
- `lateral raise 4 sets 10 reps 8kg`
- `leg press 80kg x 15 x 4`

If no unit → assume **kg**. If user says **lb** → convert to kg (÷ 2.2046), store kg rounded to 1 decimal.

**Step 2 — Build the JSON**

```json
{
  "date": "YYYY-MM-DD",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "set": 1, "weight_kg": 0, "reps": 0 },
        { "set": 2, "weight_kg": 0, "reps": 0 }
      ]
    }
  ],
  "notes": ""
}
```

Rules:
- Proper capitalization: `Hip Thrust`, `Romanian Deadlift`, `Leg Press`
- One weight for all sets → repeat it per set
- Different weights per set → map in order
- Free-text remarks → put in `"notes"`
- If a file already exists for that date → read it first, merge new exercises in, then rewrite

**Step 3 — Write to GitHub using the GitHub MCP tool**

Use `create_or_update_file` with:
- **owner**: `thaizbar-debug`
- **repo**: `coach`
- **path**: `workouts/data/YYYY-MM-DD.json`
- **content**: the JSON (the tool handles encoding)
- **message**: `gym: YYYY-MM-DD — Exercise1, Exercise2, Exercise3`
- **branch**: `main`
- **sha**: only required if the file already exists — read it first to get the sha

**Step 4 — Reply with a clean summary**

```
Saved — Mon Apr 21 2026

  Hip Thrust         3 × 12  @ 60 kg
  Romanian DL        3 × 10  @ 50 kg
  Cable Kickback     3 × 15  @ 15 kg

  Total volume: 4,050 kg  ·  9 sets
```

---

### Reading sessions

Use the GitHub MCP `get_file_contents` tool to read `workouts/data/YYYY-MM-DD.json`.

For history or PRs, list files in `workouts/data/` first, then read each one.

Display format:
- Date as weekday + full date
- Each exercise: name, sets × reps @ weight
- Total sets and total volume (sum of weight × reps)

### History

Newest-first. Each line:
```
Fri Apr 18   Hip Thrust · RDL · Cable Kickback   [6 exercises · 24 sets · 3,200 kg]
```

### Personal Records

Read all files. Best weight per exercise (highest single-set weight):
```
Personal Records (all-time)

  Hip Thrust           80 kg × 8
  Romanian Deadlift    60 kg × 10
  Leg Press           120 kg × 12
```

### Weekly summary

Group Mon–Sun of current week. Show: days trained, total volume, total sets, muscles hit, best lift per exercise.

---

### Rules

- **Never ask for confirmation before saving** — save, then show summary.
- If weight is missing for an exercise, ask once only for that.
- Display in kg. Show lb only if user asks.
- User has **chondromalacia patella** (both knees) — if they log deep squats, full leg extensions, or jump squats, add a brief knee-safety note after saving.
