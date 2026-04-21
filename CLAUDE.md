# Coach Project — Claude Instructions

This is a personal coaching project. It has two responsibilities:
1. **Workout logging** — write, read, and manage gym sessions stored as JSON in `workouts/data/`
2. **Coaching** — training, nutrition, and body composition advice (see SKILL.md)

---

## Workout Logging

### Commands to recognize

| User says | Action |
|---|---|
| `log` / `logged` / `gym today` / `today's session` | Save today's session → commit → push |
| `show [today / yesterday / date / this week]` | Read and display session(s) |
| `history` | List all sessions newest-first |
| `prs` / `personal records` | Best weight per exercise across all files |
| `weekly summary` / `this week` | Volume, sets, muscles hit for current week |
| `edit [date]` | Read → let user change values → rewrite → commit → push |
| `delete [date]` | Delete file → commit → push |

---

### How to log a session

**Step 1 — Parse input** (accept any natural format):
- `hip thrust 3x12 @ 60kg`
- `rdl: 50kg, 3 sets of 10`
- `lateral raise 4 sets 10 reps 8kg`
- `leg press 80kg x 15 x 4`

If no unit given → assume **kg**. If user says **lb** → convert to kg (÷ 2.2046), store kg rounded to 1 decimal.

**Step 2 — Write file**

Path: `workouts/data/YYYY-MM-DD.json`

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
- File already exists → **merge** new exercises in, don't overwrite
- Free-text remarks → put in `"notes"`

**Step 3 — Commit and push**
```
git add workouts/data/YYYY-MM-DD.json
git commit -m "gym: YYYY-MM-DD — Exercise1, Exercise2, Exercise3"
git push
```

**Step 4 — Reply with summary**
```
Saved — Mon Apr 21 2026

  Hip Thrust         3 × 12  @ 60 kg
  Romanian DL        3 × 10  @ 50 kg
  Cable Kickback     3 × 15  @ 15 kg

  Total volume: 4,050 kg  ·  9 sets
```

---

### Displaying sessions

Always show: date (weekday + full date), each exercise with sets/reps/weight, total sets, total volume (weight × reps summed).

### History

Newest-first. Each line:
```
Fri Apr 18   Hip Thrust · RDL · Cable Kickback   [6 exercises · 24 sets · 3,200 kg]
```

### Personal Records

Scan all files in `workouts/data/`. Best weight per exercise (highest single-set weight). Display:
```
Personal Records (all-time)

  Hip Thrust           80 kg × 8
  Romanian Deadlift    60 kg × 10
  Leg Press           120 kg × 12
```

### Weekly summary

Current Mon–Sun. Show: days trained, total volume, total sets, muscles hit, best lift per exercise this week.

---

### Rules

- **Never ask for confirmation before saving** — save, then show summary.
- **Always push** after every write. If push fails, say so explicitly.
- If weight is missing, ask once only for that.
- Display in kg. Show lb equivalent only if user asks.
- User has **chondromalacia patella** (both knees) — if they log deep squats, full leg extensions, or jump squats, add a brief knee-safety note after saving.
