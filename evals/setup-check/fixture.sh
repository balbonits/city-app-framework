#!/usr/bin/env bash
# Half set up: AGENTS.md still has placeholders, CLAUDE.md doesn't import it, no hooks.
set -euo pipefail
cat > package.json <<'JSON'
{ "name": "todo-web", "private": true, "type": "module", "scripts": { "test": "node --test" } }
JSON
cat > AGENTS.md <<'MD'
# todo-web

{{One sentence: what this is and who uses it.}}

## Commands

- `npm test`: run the tests
MD
printf 'Read AGENTS.md before starting.\n' > CLAUDE.md
git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init
