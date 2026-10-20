// Shared by tests/rules-test.test.mjs and tests/rules-prune.test.mjs: a small git project with a
// parseArgs rule, and a fake `claude` that no test can bypass, so no test uses the model.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync } from 'node:fs';
import { delimiter, isAbsolute, join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { posixShell } from '../../scripts/lib/shell.mjs';

// Tests that run check commands or fixture scripts need a POSIX shell (Git Bash on Windows).
// Pass as a test option: test('name', { skip: SHELL_SKIP }, fn). False when a shell was found.
export const SHELL_SKIP = posixShell() ? false : 'needs a POSIX shell: install Git for Windows (Git Bash)';

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
// The real program is claude.cjs (Node runs it the same on every OS). `claude` and `claude.cmd` sit next
// to it so that looking `claude` up on PATH finds the fake first on macOS, Linux and Windows.
export function fakeClaude(mode = 'follow') {
  const bin = tmp('rt-bin-');
  writeFileSync(join(bin, 'claude.cjs'), `const fs = require('node:fs');
const args = process.argv.slice(2);
if (args[0] === '--version') { console.log('fake-claude'); process.exit(0); }
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify({ cwd: process.cwd(), prompt: args[args.indexOf('-p') + 1], args }) + '\\n');
if (${JSON.stringify(mode)} === 'crash') process.exit(1);
const rules = fs.existsSync('AGENTS.md') ? fs.readFileSync('AGENTS.md', 'utf8') : '';
const uses = ${JSON.stringify(mode)} === 'always' || rules.includes('parseArgs');
fs.writeFileSync('src/cli.js', uses ? "import { parseArgs } from 'node:util';\\n" : 'const args = process.argv.slice(2);\\n');
console.log(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: 'done' }));
`);
  writeFileSync(join(bin, 'claude'), `#!/usr/bin/env node\nrequire(require('node:path').join(__dirname, 'claude.cjs'));\n`);
  chmodSync(join(bin, 'claude'), 0o755);
  writeFileSync(join(bin, 'claude.cmd'), '@echo off\r\nnode "%~dp0claude.cjs" %*\r\n');
  return bin;
}

const pathKey = (env) => Object.keys(env).find((k) => k.toLowerCase() === 'path') ?? 'PATH';
const inside = (dir, file) => { const rel = relative(resolve(dir).toLowerCase(), resolve(file).toLowerCase()); return !rel.startsWith('..') && !isAbsolute(rel); };

// Where a command named `claude` would be found first: every PATH folder in order, trying the bare name
// and each Windows executable extension.
export function firstOnPath(name, env) {
  const exts = ['', ...(process.platform === 'win32' ? (env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean) : [])];
  for (const dir of (env[pathKey(env)] ?? '').split(delimiter).filter(Boolean)) {
    for (const ext of exts) {
      const file = join(dir, name + ext.toLowerCase());
      if (existsSync(file)) return file;
    }
  }
  return null;
}

// The guard. Throws unless `claude` resolves to the fake in fakeDir, CLAUDE_BIN points at it, and it
// answers as the fake. Called before every spawn, so a real claude can never run by mistake.
export function assertFakeResolved(fakeDir, env) {
  const found = firstOnPath('claude', env);
  if (!found || !inside(fakeDir, found)) {
    throw new Error(`Refusing to run: 'claude' resolves to ${found ?? 'nothing'}, not the fake in ${fakeDir}.`);
  }
  if (!env.CLAUDE_BIN || !inside(fakeDir, env.CLAUDE_BIN)) {
    throw new Error(`Refusing to run: CLAUDE_BIN is ${env.CLAUDE_BIN ?? 'not set'}, not the fake in ${fakeDir}.`);
  }
  const probe = spawnSync(process.execPath, [env.CLAUDE_BIN, '--version'], { encoding: 'utf8' });
  if (probe.stdout?.trim() !== 'fake-claude') throw new Error(`Refusing to run: ${env.CLAUDE_BIN} did not answer as the fake claude.`);
}

// Runs a script with the fake claude first on PATH. Returns the result plus every fake call.
export function withFakeClaude(script, args, { mode, log = join(tmp('rt-log-'), 'calls.jsonl') } = {}) {
  const fakeDir = fakeClaude(mode);
  const env = { ...process.env, FAKE_LOG: log, CLAUDE_BIN: join(fakeDir, 'claude.cjs') };
  const key = pathKey(env); // Windows calls it Path; a second PATH key would be ambiguous
  env[key] = `${fakeDir}${delimiter}${env[key] ?? ''}`;
  assertFakeResolved(fakeDir, env);
  const r = spawnSync('node', [script, ...args], { encoding: 'utf8', env });
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  return { ...r, calls };
}