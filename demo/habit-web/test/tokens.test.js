// Design tokens: every color comes from a token (var(--name)), never written out. Added by
// /city-app:ui:tokens. It runs with npm test, so an agent can't finish with a raw color.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRawColors, tokensProblem } from '../scripts/tokens-check.mjs';

test('colors come from design tokens', () => {
  const problems = findRawColors('.').map(tokensProblem);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});
