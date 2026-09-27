import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, dayKey, streakLabel, toggleDay } from '../public/streak.js';

test('counts days in a row ending today', () => {
  assert.equal(currentStreak(['2026-09-25', '2026-09-26', '2026-09-27'], '2026-09-27'), 3);
});

test('a streak runs through yesterday until today is done', () => {
  assert.equal(currentStreak(['2026-09-25', '2026-09-26'], '2026-09-27'), 2);
});

test('a missed day resets the streak', () => {
  assert.equal(currentStreak(['2026-09-23', '2026-09-24', '2026-09-26'], '2026-09-27'), 1);
  assert.equal(currentStreak(['2026-09-20'], '2026-09-27'), 0);
});

test('streaks cross month and year ends in UTC', () => {
  assert.equal(currentStreak(['2026-12-30', '2026-12-31', '2027-01-01'], '2027-01-01'), 3);
  assert.equal(currentStreak(['2026-02-28', '2026-03-01'], '2026-03-01'), 2);
});

test('dayKey is the UTC date', () => {
  assert.equal(dayKey(new Date('2026-09-27T23:30:00-07:00')), '2026-09-28');
});

test('toggling a day adds it in order, or removes it', () => {
  assert.deepEqual(toggleDay(['2026-09-27'], '2026-09-25'), ['2026-09-25', '2026-09-27']);
  assert.deepEqual(toggleDay(['2026-09-25', '2026-09-27'], '2026-09-27'), ['2026-09-25']);
});

test('labels read naturally', () => {
  assert.equal(streakLabel(0), 'No streak yet');
  assert.equal(streakLabel(1), '1-day streak');
  assert.equal(streakLabel(12), '12-day streak');
});
