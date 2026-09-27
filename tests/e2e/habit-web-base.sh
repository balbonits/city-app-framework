#!/usr/bin/env bash
# The demo project (demo/habit-web) with its dev packages, as a clean git repo.
set -euo pipefail
cp -R "$EVAL_REPO/demo/habit-web/." .
git init -q && git add -A && git -c user.email=e2e@local -c user.name=e2e commit -qm init
