// Tests for the checks in experiments/checks/ that live evals use: they must pass on a right
// outcome and fail on a wrong one.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { testsFirst } from '../experiments/checks/tests-first.mjs';

const BOOKMARKS = new URL('../experiments/checks/bookmarks.mjs', import.meta.url).pathname;
const write = (file) => ({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Write', input: { file_path: file } }] } });

test('tests-first: a test must be written before the code', () => {
  assert.equal(testsFirst([write('/w/docs/spec.md'), write('/w/test/acceptance.test.js'), write('/w/bm.js')]), true);
  assert.equal(testsFirst([write('/w/bm.js'), write('/w/test/acceptance.test.js')]), false);
  assert.equal(testsFirst([write('/w/docs/spec.md'), write('/w/bm.js')]), false);
  assert.equal(testsFirst([write('/w/src/bm.test.mjs')]), true);
});

const BM = (nextId) => `const fs = require('fs');
const file = process.env.BM_FILE || 'bookmarks.json';
const db = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { next: 1, items: [] };
const [cmd, ...args] = process.argv.slice(2);
const save = () => fs.writeFileSync(file, JSON.stringify(db));
if (cmd === 'add') { const [url, ...tags] = args; db.items.push({ id: ${nextId}, url, tags }); db.next++; save(); }
else if (cmd === 'list') { const t = args[0] === '--tag' ? args[1] : null; for (const b of [...db.items].reverse()) if (!t || b.tags.includes(t)) console.log(b.id + ' ' + b.url + (b.tags.length ? ' [' + b.tags.join(', ') + ']' : '')); }
else if (cmd === 'rm') { db.items = db.items.filter((b) => b.id !== Number(args[0])); save(); }
`;
const bookmarks = (source) => {
  const dir = mkdtempSync(join(tmpdir(), 'bm-'));
  writeFileSync(join(dir, 'bm.js'), source);
  return spawnSync('node', [BOOKMARKS], { cwd: dir, encoding: 'utf8' });
};

test('bookmark checks pass on a right build and fail when ids get reused', () => {
  const good = bookmarks(BM('db.next'));
  assert.equal(good.status, 0, good.stdout);
  const reused = bookmarks(BM('db.items.length + 1'));
  assert.equal(reused.status, 1);
  assert.match(reused.stdout, /FAIL noReuse/);
});
