import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load, save } from '../public/store.js';

const memory = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)) };
};

test('saves and loads habits', () => {
  const storage = memory();
  save([{ name: 'Read', days: ['2026-09-27'] }], storage);
  assert.deepEqual(load(storage), [{ name: 'Read', days: ['2026-09-27'] }]);
});

test('starts empty, and survives broken data', () => {
  assert.deepEqual(load(memory()), []);
  const storage = memory();
  storage.setItem('habit-streaks', '{oops');
  assert.deepEqual(load(storage), []);
});
