#!/usr/bin/env bash
set -euo pipefail
bash "$(dirname "$0")/../base.sh"
printf "npm run deploy => Deploys are the human's call.\n" > .claude/guard-rules.txt
git init -q && git add -A && git -c user.email=e2e@local -c user.name=e2e commit -qm init
