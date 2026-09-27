#!/usr/bin/env bash
# A project that already has its own CLAUDE.md and Claude settings.
set -euo pipefail
cat > package.json <<'JSON'
{
  "name": "notes-web",
  "description": "Markdown notes app with offline sync",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "test": "node --test", "lint": "eslint ." }
}
JSON
cat > CLAUDE.md <<'MD'
# Team notes

Prefer small PRs. Ask before renaming public components.
MD
mkdir -p .claude src test
cat > .claude/settings.json <<'JSON'
{
  "permissions": { "allow": ["Bash(npm run lint)"] }
}
JSON
echo 'export const title = (s) => s.trim();' > src/title.js
cat > test/title.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { title } from '../src/title.js';
test('trims', () => assert.equal(title('  a '), 'a'));
JS
git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init
