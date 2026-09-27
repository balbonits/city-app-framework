#!/usr/bin/env bash
# An empty project (just package.json) with the kit installed and AGENTS.md filled in.
set -euo pipefail
cp -R "$EVAL_REPO/experiments/fixture/empty/." .
node "$EVAL_REPO/scripts/install.mjs" . --name bm > /dev/null
node -e '
const fs = require("fs");
let s = fs.readFileSync("AGENTS.md", "utf8");
s = s.replace(/\{\{One sentence[^}]*\}\}/, "A command-line bookmark manager, run as `node bm.js`.")
  .replace(/- `npm run dev`[^\n]*\n/, "").replace(/- `npm run build`[^\n]*\n/, "")
  .replace(/\{\{Only what the file tree[^}]*\}\}/, "- New project: nothing here yet.")
  .replace(/\{\{Things an agent would get wrong[^}]*\}\}/, "- None yet.");
fs.writeFileSync("AGENTS.md", s);'
git init -q && git add -A && git -c user.email=e2e@local -c user.name=e2e commit -qm init
