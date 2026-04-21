# /coach — AI Personal Trainer & Nutritionist for Claude Code

A Claude Code skill that gives you a personalized, evidence-based coach inside your terminal or phone. On first use it runs a short questionnaire to build your profile (health conditions, goals, body stats) and saves it to memory — so every conversation after that is already personalized.

## What it does

- Builds a persistent profile from your health conditions, injuries, goals, and body composition data
- Gives personalized training programs, nutrition targets, macro splits, and supplement stacks
- Adapts every recommendation to your injuries and goal physique
- Integrates with [Dexacsan](https://dexacsan.com) DEXA scan data if you have it (optional — works without it too)
- Applies a longevity lens to every recommendation (VO2 max, bone density, lean mass, visceral fat)

## Installation

```bash
git clone https://github.com/thaizbar-debug/coach.git ~/.claude/skills/coach
```

Then restart Claude Code. Type `/coach` to start.

### Mobile (Claude.ai/code)

Same command — run it in your terminal once, and the skill will be available in the mobile app automatically.

## First use

When you first type `/coach`, it will ask you a few short questions about your stats, health conditions, and goals. After that, your profile is saved and you never have to answer them again.

Example first-use questions:
- Age, sex, weight, height
- Any injuries or joint issues
- Your goal (fat loss / muscle gain / recomp / longevity)
- Training schedule and equipment

## DEXA scan integration (optional)

If you have a [Dexacsan](https://dexacsan.com) account and the MCP server installed, the coach will automatically pull your latest scan data for precise recommendations. Without it, the coach works from the stats you provide.

To set up the Dexacsan MCP, follow the instructions at [dexacsan.com](https://dexacsan.com).

## Updating your profile

Just tell the coach:
- "Update my weight to X"
- "I started having shoulder pain"
- "My new goal is muscle building"

It will update your saved profile automatically.

## Examples

```
/coach what should I eat today?
/coach give me a full week training plan
/coach review my supplement stack
/coach I just got a DEXA scan — analyze it
/coach I hurt my lower back, adjust my program
```

## License

MIT
