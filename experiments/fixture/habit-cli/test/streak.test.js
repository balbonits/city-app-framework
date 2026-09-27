import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak } from '../src/streak.js';

test('empty history has no streak', () => {
  assert.equal(currentStreak([], new Date('2026-03-10T12:00:00Z')), 0);
});

test('counts consecutive days ending today', () => {
  const days = ['2026-03-08', '2026-03-09', '2026-03-10'];
  assert.equal(currentStreak(days, new Date('2026-03-10T12:00:00Z')), 3);
});

test('gap breaks the streak', () => {
  const days = ['2026-03-07', '2026-03-09', '2026-03-10'];
  assert.equal(currentStreak(days, new Date('2026-03-10T12:00:00Z')), 2);
});
