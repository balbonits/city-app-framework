#!/usr/bin/env bash
# The demo app with one planted raw color: the empty state's token was swapped for plain gray.
# It edits the existing rule (not a new one), so the grader can tell a fix from a deleted line.
set -euo pipefail
bash "$(dirname "$0")/../habit-web-base.sh"
node -e '
const fs = require("fs"), f = "public/styles.css", from = ".empty { color: var(--muted); }";
const css = fs.readFileSync(f, "utf8");
if (!css.includes(from)) { console.error(`fixture: ${f} no longer has "${from}"`); process.exit(1); }
fs.writeFileSync(f, css.replace(from, ".empty { color: gray; }"));'
git -c user.email=e2e@local -c user.name=e2e commit -qam "Make the empty state gray"
