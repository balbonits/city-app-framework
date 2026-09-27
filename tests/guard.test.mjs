import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GUARD = new URL('../kit/.claude/hooks/guard.mjs', import.meta.url).pathname;

function project() {
  const dir = mkdtempSync(join(tmpdir(), 'guard-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'x', dependencies: { react: '^19.0.0' } }, null, 2));
  return dir;
}

function decide(dir, tool_name, tool_input) {
  const r = spawnSync('node', [GUARD], {
    input: JSON.stringify({ tool_name, tool_input, cwd: dir }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout ? JSON.parse(r.stdout).hookSpecificOutput.permissionDecision : 'allow';
}

const bash = (dir, command) => decide(dir, 'Bash', { command });

test('blocks installing new packages in any package manager and form', () => {
  const dir = project();
  for (const cmd of ['npm install chalk', 'npm i -D vitest', 'pnpm add zod', 'yarn add --dev kleur', 'bun add hono', 'cd app && npm install @tanstack/react-query@5']) {
    assert.equal(bash(dir, cmd), 'deny', cmd);
  }
});

test('allows installs from the lockfile and ordinary commands', () => {
  const dir = project();
  for (const cmd of ['npm install', 'npm ci', 'npm test', 'npm run build', 'git status', 'node src/cli.js list | grep x']) {
    assert.equal(bash(dir, cmd), 'allow', cmd);
  }
});

test('packages the human approved in .claude/approved-deps.txt go through', () => {
  const dir = project();
  mkdirSync(join(dir, '.claude'));
  writeFileSync(join(dir, '.claude/approved-deps.txt'), '# approved\nzod\n@tanstack/react-query\n');
  assert.equal(bash(dir, 'npm install zod'), 'allow');
  assert.equal(bash(dir, 'npm install @tanstack/react-query@5'), 'allow');
  assert.equal(bash(dir, 'npm install zod lodash'), 'deny');
});

test('the agent cannot edit the approval list itself, by tool or by shell', () => {
  const dir = project();
  assert.equal(decide(dir, 'Write', { file_path: join(dir, '.claude/approved-deps.txt'), content: 'chalk\n' }), 'deny');
  for (const cmd of ['echo chalk >> .claude/approved-deps.txt', 'printf "x\\n" | tee -a .claude/approved-deps.txt', "sed -i 's/a/b/' .claude/approved-deps.txt"]) {
    assert.equal(bash(dir, cmd), 'deny', cmd);
  }
  assert.equal(bash(dir, 'cat .claude/approved-deps.txt'), 'allow');
});

test('words inside a commit message never trigger a rule', () => {
  const dir = project();
  for (const cmd of [
    'git commit -m "docs: run npm install zod, then npm publish"',
    'git commit -m "guard blocks writes to .claude/approved-deps.txt (node --test covers it)"',
    'git commit -m "remove flaky rm test/old.test.js step"',
  ]) {
    assert.equal(bash(dir, cmd), 'allow', cmd);
  }
});

test('env assignments and npx do not hide a blocked command', () => {
  const dir = project();
  assert.equal(bash(dir, 'CI=1 npm install chalk'), 'deny');
  assert.equal(bash(dir, 'npx vercel --prod'), 'deny');
});

test('quoted package specs are checked by name', () => {
  const dir = project();
  mkdirSync(join(dir, '.claude'));
  writeFileSync(join(dir, '.claude/approved-deps.txt'), 'zod\n');
  assert.equal(bash(dir, 'npm install "zod@^3.23"'), 'allow');
  assert.equal(bash(dir, "npm install 'lodash'"), 'deny');
});

test('blocks package.json edits that add a dependency, allows other edits', () => {
  const dir = project();
  const file = join(dir, 'package.json');
  assert.equal(decide(dir, 'Edit', { file_path: file, old_string: '"react": "^19.0.0"', new_string: '"react": "^19.0.0",\n    "dayjs": "^1.11.0"' }), 'deny');
  assert.equal(decide(dir, 'Edit', { file_path: file, old_string: '"name": "x"', new_string: '"name": "y"' }), 'allow');
  assert.equal(decide(dir, 'Write', { file_path: file, content: JSON.stringify({ name: 'x', dependencies: { react: '^19.0.0' }, devDependencies: { vitest: '^4' } }) }), 'deny');
});

test('blocks force-push, production deploys, publishing, and deleting tests', () => {
  const dir = project();
  for (const cmd of ['git push --force origin main', 'git push -f', 'git -C . push -f', 'git push origin +main', 'vercel --prod', 'vercel deploy --prod --yes', 'npm publish', 'rm test/streak.test.js', 'git rm -r tests', 'rm src/__tests__/App.test.tsx']) {
    assert.equal(bash(dir, cmd), 'deny', cmd);
  }
  for (const cmd of ['git push origin feature/x', 'git push --force-with-lease origin feature/x', 'vercel', 'rm dist/bundle.js']) {
    assert.equal(bash(dir, cmd), 'allow', cmd);
  }
});
