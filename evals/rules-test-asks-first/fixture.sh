#!/usr/bin/env bash
# A tiny Node CLI whose AGENTS.md has the rule under test. The settings file blocks a real run
# (--yes), so a wrong turn can't start test sessions from inside this eval.
set -euo pipefail

cat > package.json <<'JSON'
{
  "name": "habit-cli",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test" }
}
JSON

cat > AGENTS.md <<'MD'
# habit-cli

Tiny habit tracker for the terminal. Node 22, plain JavaScript (ESM), no dependencies.

## Commands

- `npm test`: run the tests
- `node src/cli.js <add|list> [name]`: run the CLI

## Gotchas

- Tests must point `HABITS_FILE` at a temp file.
- Parse CLI flags with parseArgs from node:util. Hand-rolled argv parsing broke --flag=value before.
MD
printf '@AGENTS.md\n' > CLAUDE.md

mkdir -p .claude src test
cat > .claude/settings.json <<'JSON'
{ "permissions": { "deny": ["Bash(*rules-test.mjs*--yes*)"] } }
JSON

cat > src/cli.js <<'JS'
#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = process.env.HABITS_FILE ?? 'habits.json';
const load = () => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { habits: [] });
const [command, ...rest] = process.argv.slice(2);
const name = rest.join(' ');

if (command === 'add') {
  const data = load();
  data.habits.push({ name, streak: 0 });
  writeFileSync(file, JSON.stringify(data));
} else if (command === 'list') {
  console.log(load().habits.map((h) => `${h.name} (${h.streak})`).join('\n'));
}
JS
cat > test/cli.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('add then list', () => {
  const env = { ...process.env, HABITS_FILE: join(mkdtempSync(join(tmpdir(), 'h-')), 'h.json') };
  execFileSync('node', ['src/cli.js', 'add', 'read'], { env });
  assert.match(execFileSync('node', ['src/cli.js', 'list'], { env, encoding: 'utf8' }), /read/);
});
JS

git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init
