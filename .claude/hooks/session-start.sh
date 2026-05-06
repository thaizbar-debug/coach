#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-/home/user/coach}"

git pull origin main --ff-only 2>&1 || echo "git pull skipped (no remote or up to date)"
