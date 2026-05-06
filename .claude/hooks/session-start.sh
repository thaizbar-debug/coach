#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-/home/user/coach}"

git fetch origin main && git reset --hard origin/main

mkdir -p /root/.claude/skills/coach
cp "$CLAUDE_PROJECT_DIR/SKILL.md" /root/.claude/skills/coach/SKILL.md
