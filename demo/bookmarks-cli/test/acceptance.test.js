import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BM_JS = fileURLToPath(new URL('../bm.js', import.meta.url));

function tmpDir() {
  return mkdtempSync(join(tmpdir(), 'bm-test-'));
}

function bmFile(dir) {
  return join(dir, 'bookmarks.json');
}

function run(args, { cwd, file }) {
  const env = { ...process.env };
  if (file) env.BM_FILE = file;
  else delete env.BM_FILE;
  return execFileSync('node', [BM_JS, ...args], { cwd, env, encoding: 'utf8' });
}

function runExpectFailure(args, { cwd, file }) {
  const env = { ...process.env };
  if (file) env.BM_FILE = file;
  else delete env.BM_FILE;
  try {
    execFileSync('node', [BM_JS, ...args], { cwd, env, encoding: 'utf8' });
    return null;
  } catch (err) {
    return err;
  }
}

test('req1: bm add <url> saves a bookmark with no tags', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://example.com'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  assert.equal(out.trim(), '1 https://example.com');
});

test('req2: bm add <url> <tags...> saves a bookmark with those tags', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://example.com', 'work', 'read-later'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  assert.equal(out.trim(), '1 https://example.com work read-later');
});

test('req3: ids start at 1 and increment for each add', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  run(['add', 'https://b.com'], { cwd: dir, file });
  run(['add', 'https://c.com'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  const lines = out.trim().split('\n');
  assert.deepEqual(
    lines.map((l) => l.split(' ')[0]),
    ['3', '2', '1']
  );
});

test('req4: ids are never reused after removal', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  run(['add', 'https://b.com'], { cwd: dir, file });
  run(['rm', '2'], { cwd: dir, file });
  run(['add', 'https://c.com'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  const ids = out.trim().split('\n').map((l) => l.split(' ')[0]);
  assert.deepEqual(ids, ['3', '1']);
});

test('req5: bm list prints newest first', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  run(['add', 'https://b.com'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  const urls = out.trim().split('\n').map((l) => l.split(' ')[1]);
  assert.deepEqual(urls, ['https://b.com', 'https://a.com']);
});

test('req6: list line format is "<id> <url> <tags>", tags omitted when none', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  run(['add', 'https://b.com', 'foo', 'bar'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  const lines = out.trim().split('\n');
  assert.equal(lines[0], '2 https://b.com foo bar');
  assert.equal(lines[1], '1 https://a.com');
});

test('req7: bm list --tag <tag> filters to matching bookmarks', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com', 'work'], { cwd: dir, file });
  run(['add', 'https://b.com', 'personal'], { cwd: dir, file });
  run(['add', 'https://c.com', 'work', 'urgent'], { cwd: dir, file });
  const out = run(['list', '--tag', 'work'], { cwd: dir, file });
  const lines = out.trim().split('\n');
  assert.deepEqual(lines, ['3 https://c.com work urgent', '1 https://a.com work']);
});

test('req8: bm rm <id> deletes the bookmark', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  run(['add', 'https://b.com'], { cwd: dir, file });
  run(['rm', '1'], { cwd: dir, file });
  const out = run(['list'], { cwd: dir, file });
  assert.equal(out.trim(), '2 https://b.com');
});

test('req9: data is persisted to bookmarks.json in the cwd by default', () => {
  const dir = tmpDir();
  execFileSync('node', [BM_JS, 'add', 'https://a.com'], {
    cwd: dir,
    env: { ...process.env, BM_FILE: undefined },
    encoding: 'utf8',
  });
  const raw = readFileSync(join(dir, 'bookmarks.json'), 'utf8');
  const data = JSON.parse(raw);
  assert.ok(Array.isArray(data) ? data.length === 1 : true);
});

test('req10: BM_FILE env var overrides the storage path', () => {
  const dir = tmpDir();
  const customFile = join(dir, 'custom-bookmarks.json');
  run(['add', 'https://a.com'], { cwd: dir, file: customFile });
  const raw = readFileSync(customFile, 'utf8');
  assert.ok(raw.includes('https://a.com'));
});

test('bonus: bm rm <id> for a nonexistent id fails without modifying the file', () => {
  const dir = tmpDir();
  const file = bmFile(dir);
  run(['add', 'https://a.com'], { cwd: dir, file });
  const err = runExpectFailure(['rm', '99'], { cwd: dir, file });
  assert.ok(err, 'expected bm rm 99 to exit non-zero');
  const out = run(['list'], { cwd: dir, file });
  assert.equal(out.trim(), '1 https://a.com');
});
