import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const GATE = new URL('../kit/.claude/hooks/test-gate.mjs', import.meta.url).pathname;

function repo(testBody) {
  const dir = mkdtempSync(join(tmpdir(), 'gate-'));
  mkdirSync(join(dir, 'test'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', scripts: { test: 'node --test' } }));
  writeFileSync(join(dir, 'test/a.test.js'), testBody);
  execSync('git init -q && git add -A && git -c user.email=t@t -c user.name=t commit -qm base', { cwd: dir });
  return dir;
}

const PASSING = "import { test } from 'node:test';\ntest('ok', () => {});\n";
const FAILING = "import { test } from 'node:test';\nimport assert from 'node:assert';\ntest('bad', () => assert.equal(1, 2));\n";

function stop(dir, session = randomUUID()) {
  const r = spawnSync('node', [GATE], {
    input: JSON.stringify({ session_id: session, cwd: dir, stop_hook_active: false }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout ? JSON.parse(r.stdout) : null;
}

test('lets the agent finish when tests pass', () => {
  assert.equal(stop(repo(PASSING)), null);
});

test('blocks finishing while tests fail, and shows the failure', () => {
  const out = stop(repo(FAILING));
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /npm test is failing/);
});

test('blocks newly skipped or focused tests even if the suite is green', () => {
  const dir = repo(PASSING);
  writeFileSync(join(dir, 'test/a.test.js'), `${PASSING}test.skip('later', () => {});\n`);
  const out = stop(dir);
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /skipped or focused/);
});

test('also catches .only in a brand-new, untracked test file', () => {
  const dir = repo(PASSING);
  writeFileSync(join(dir, 'test/new.test.js'), "import { test } from 'node:test';\ntest.only('focus', () => {});\n");
  const out = stop(dir);
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /test\.only/);
});

test('gives up after three blocks in one session so the agent can report back', () => {
  const dir = repo(FAILING);
  const session = randomUUID();
  for (let i = 0; i < 3; i++) assert.equal(stop(dir, session).decision, 'block');
  assert.equal(stop(dir, session), null);
});

test('does nothing in projects without a test script', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gate-'));
  writeFileSync(join(dir, 'package.json'), '{}');
  execSync('git init -q', { cwd: dir });
  assert.equal(stop(dir), null);
});
