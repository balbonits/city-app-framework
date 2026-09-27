// Shared by tests/rules-test.test.mjs and tests/rules-prune.test.mjs: a small git project with a
// parseArgs rule, and a fake `claude` on PATH so no test uses the model.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';

export const tmp = (prefix) => mkdtempSync(join(tmpdir(), prefix));

export const AGENTS = `# app

## Gotchas

- Tests must point HABITS_FILE at a temp file.
- Parse CLI flags with parseArgs from node:util.

## Working agreement

1. Do what was asked.
`;

export function gitProject() {
  const dir = tmp('rt-src-');
  mkdirSync(join(dir, 'src'));
  mkdirSync(join(dir, 'node_modules/leftpad'), { recursive: true });
  writeFileSync(join(dir, 'node_modules/leftpad/index.js'), 'module.exports = 1;\n');
  writeFileSync(join(dir, '.gitignore'), 'node_modules/\n.env\n');
  writeFileSync(join(dir, '.env'), 'SECRET=1\n');
  writeFileSync(join(dir, 'src/cli.js'), 'const args = process.argv.slice(2);\n');
  writeFileSync(join(dir, 'AGENTS.md'), AGENTS);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'init'], { cwd: dir });
  writeFileSync(join(dir, 'NOTES.md'), 'untracked but not ignored\n');
  return dir;
}

// A stand-in for `claude -p`. follow: uses parseArgs only when AGENTS.md has the rule.
// always: uses parseArgs anyway (a model that no longer needs the rule). crash: never finishes.
export function fakeClaude(mode = 'follow') {
  const bin = tmp('rt-bin-');
  writeFileSync(join(bin, 'claude'), `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify({ cwd: process.cwd(), prompt: args[args.indexOf('-p') + 1], args }) + '\\n');
if (${JSON.stringify(mode)} === 'crash') process.exit(1);
const rules = fs.existsSync('AGENTS.md') ? fs.readFileSync('AGENTS.md', 'utf8') : '';
const uses = ${JSON.stringify(mode)} === 'always' || rules.includes('parseArgs');
fs.writeFileSync('src/cli.js', uses ? "import { parseArgs } from 'node:util';\\n" : 'const args = process.argv.slice(2);\\n');
console.log(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: 'done' }));
`);
  chmodSync(join(bin, 'claude'), 0o755);
  return bin;
}

// Runs a script with the fake claude first on PATH. Returns the result plus every fake call.
export function withFakeClaude(script, args, { mode, log = join(tmp('rt-log-'), 'calls.jsonl') } = {}) {
  const r = spawnSync('node', [script, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${fakeClaude(mode)}:${process.env.PATH}`, FAKE_LOG: log },
  });
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  return { ...r, calls };
}
