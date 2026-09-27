import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { add, done, list } from '../src/commands.js';

beforeEach(() => {
  process.env.HABITS_FILE = join(mkdtempSync(join(tmpdir(), 'habits-')), 'habits.json');
});

test('add creates a habit', () => {
  assert.equal(add('read'), 'Added "read"');
  assert.match(list(), /read\s+streak: 0/);
});

test('add rejects duplicates', () => {
  add('read');
  assert.equal(add('read'), '"read" already exists');
});

test('done marks today and builds a streak', () => {
  add('run');
  done('run', new Date('2026-03-01T09:00:00Z'));
  done('run', new Date('2026-03-02T09:00:00Z'));
  assert.match(list(new Date('2026-03-02T20:00:00Z')), /run\s+streak: 2/);
});

test('done on unknown habit', () => {
  assert.equal(done('nope'), 'No habit named "nope"');
});
