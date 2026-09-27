#!/usr/bin/env bash
# A tiny Node CLI whose last change hand-rolled a --json flag.
set -euo pipefail

cat > package.json <<'EOF'
{
  "name": "habit-cli",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test" }
}
EOF

cat > AGENTS.md <<'EOF'
# habit-cli

Tiny habit tracker for the terminal. Node 22, plain JavaScript (ESM), no dependencies.

## Commands

- `npm test`: run the tests
- `node src/cli.js <add|list> [name] [--json]`: run the CLI

## Gotchas

- Tests must point `HABITS_FILE` at a temp file.
EOF
printf '@AGENTS.md\n' > CLAUDE.md

mkdir -p src test
cat > src/store.js <<'EOF'
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = () => process.env.HABITS_FILE ?? 'habits.json';
export const load = () => (existsSync(file()) ? JSON.parse(readFileSync(file(), 'utf8')) : { habits: [] });
export const save = (data) => writeFileSync(file(), JSON.stringify(data, null, 2));
EOF
cat > src/cli.js <<'EOF'
#!/usr/bin/env node
import { load, save } from './store.js';

const [command, ...args] = process.argv.slice(2);
const json = args.includes('--json');
const name = args.filter((a) => a !== '--json').join(' ');

if (command === 'add') {
  const data = load();
  data.habits.push({ name, done: [] });
  save(data);
  console.log(`Added "${name}"`);
} else if (command === 'list') {
  const { habits } = load();
  console.log(json ? JSON.stringify(habits) : habits.map((h) => h.name).join('\n'));
} else {
  console.log('Usage: habit <add|list> [name] [--json]');
}
EOF
cat > test/cli.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('list --json prints JSON', () => {
  const env = { ...process.env, HABITS_FILE: join(mkdtempSync(join(tmpdir(), 'h-')), 'h.json') };
  execFileSync('node', ['src/cli.js', 'add', 'read'], { env });
  const out = execFileSync('node', ['src/cli.js', 'list', '--json'], { env, encoding: 'utf8' });
  assert.deepEqual(JSON.parse(out).map((h) => h.name), ['read']);
});
EOF

git init -q && git add -A && git -c user.email=eval@local -c user.name=eval commit -qm init
