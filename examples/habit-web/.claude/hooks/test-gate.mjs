#!/usr/bin/env node
// Stop hook. The agent can't finish while:
//   - `npm test` fails, or
//   - the uncommitted diff adds .only / .skip / .todo to tests (a common way to "pass").
// Gives up after 3 blocks in one session so a stuck agent can still report back.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const payload = JSON.parse(readFileSync(0, 'utf8'));
const root = process.env.CLAUDE_PROJECT_DIR ?? payload.cwd ?? process.cwd();
const MAX_BLOCKS = 3;

const counter = join(tmpdir(), `claude-test-gate-${payload.session_id ?? 'unknown'}`);
const blocks = existsSync(counter) ? Number(readFileSync(counter, 'utf8')) || 0 : 0;
if (blocks >= MAX_BLOCKS) process.exit(0);

function block(reason) {
  writeFileSync(counter, String(blocks + 1));
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

const TEST_FILES = ['*.test.*', '*.spec.*'];
const SHORTCUT = /\b(it|test|describe)\.(only|skip|todo)\(|\bx(it|describe)\(/;
const git = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout ?? '';

// Added lines in tracked test files, plus every line of new (untracked) test files.
const added = git(['diff', 'HEAD', '--unified=0', '--', ...TEST_FILES]).split('\n').filter((l) => l.startsWith('+'));
for (const file of git(['ls-files', '--others', '--exclude-standard', '--', ...TEST_FILES]).split('\n').filter(Boolean)) {
  added.push(...readFileSync(join(root, file), 'utf8').split('\n').map((l) => `+${l}`));
}
const shortcuts = added.filter((line) => SHORTCUT.test(line));
if (shortcuts.length) {
  block(`Your change adds skipped or focused tests:\n${shortcuts.slice(0, 5).join('\n')}\nRemove them, or explain to the human why a test should be skipped.`);
}

const pkgPath = join(root, 'package.json');
const hasTests = existsSync(pkgPath) && Boolean(JSON.parse(readFileSync(pkgPath, 'utf8')).scripts?.test);
if (!hasTests) process.exit(0);

const env = { ...process.env, CI: '1' };
delete env.NODE_TEST_CONTEXT; // set when this hook itself runs under `node --test`; it masks failures
const run = spawnSync('npm', ['test', '--silent'], { cwd: root, encoding: 'utf8', timeout: 300_000, env });
if (run.status !== 0) {
  const tail = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim().split('\n').slice(-30).join('\n');
  block(`npm test is failing. Fix it before finishing (don't weaken or delete tests to get green).\n\n${tail}`);
}
