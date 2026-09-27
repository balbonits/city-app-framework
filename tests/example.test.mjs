// Keeps demo/habit-web honest: still fully set up, and its app tests still pass.
// (Its UI checks need playwright and axe-core installed there; they run with its own npm test.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = new URL('..', import.meta.url).pathname;
const example = new URL('../demo/habit-web/', import.meta.url).pathname;

test('the example passes setup --check', () => {
  const r = spawnSync('node', ['scripts/install.mjs', example, '--check'], { cwd: repo, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
  assert.doesNotMatch(r.stdout, /missing|warning/);
});

test('demo/bookmarks-cli is set up, and its acceptance tests pass', () => {
  const demo = new URL('../demo/bookmarks-cli/', import.meta.url).pathname;
  const check = spawnSync('node', ['scripts/install.mjs', demo, '--check'], { cwd: repo, encoding: 'utf8' });
  assert.equal(check.status, 0, check.stdout);
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync('node', ['--test'], { cwd: demo, env, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("the example's app and lesson tests pass", () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync('node', ['--test', 'test/streak.test.js', 'test/store.test.js', 'test/dates.test.js'], { cwd: example, env, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
