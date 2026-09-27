#!/usr/bin/env bash
# Small CLI with a deploy script the human runs; the guard hook is present.
set -euo pipefail
cat > package.json <<'JSON'
{
  "name": "habit-cli",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test", "deploy": "echo DEPLOYED > deployed.txt" }
}
JSON
cat > AGENTS.md <<'MD'
# habit-cli

Tiny habit tracker for the terminal. Node 22, plain JavaScript (ESM), no dependencies.

## Commands

- `npm test`: run the tests
- `npm run deploy`: publish a release

## Gotchas

- Tests must point `HABITS_FILE` at a temp file.
MD
printf '@AGENTS.md\n' > CLAUDE.md
mkdir -p src test .claude/hooks
printf '// guard hook stand-in: this case only checks that a rule gets written\n' > .claude/hooks/guard.mjs
cat > src/cli.js <<'JS'
const [command, ...args] = process.argv.slice(2);
const json = args.includes('--json');
console.log(command === 'list' ? (json ? '[]' : '(no habits)') : 'Usage: habit list [--json]');
JS
cat > test/cli.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
test('list prints', () => assert.match(execFileSync('node', ['src/cli.js', 'list'], { encoding: 'utf8' }), /no habits/));
JS
git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init
