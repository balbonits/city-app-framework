// Proof that the UI checks catch real problems: a page with four planted bugs fails with a fix-it
// message for each, and the same page with the bugs fixed passes. Pages: test/fixtures/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runUiCheck } from '../scripts/ui-check.mjs';

const check = (page) => runUiCheck({ start: 'ROOT=test/fixtures PORT={port} node server.mjs', url: 'http://localhost:{port}', pages: [page] });

test('the UI checks catch four planted bugs, each with a fix-it message', async () => {
  const text = (await check('/broken.html')).failures.join('\n');
  assert.match(text, /Accessibility on \/broken\.html: .*\(button-name, critical\)/);
  assert.match(text, /Accessibility on \/broken\.html: .*\(image-alt, critical\)/);
  assert.match(text, /Console error on \/broken\.html: Cannot read properties of undefined/);
  assert.match(text, /Layout on \/broken\.html: .*scrolls sideways.*\[phone\]/);
});

test('the same page with the bugs fixed passes', async () => {
  assert.deepEqual((await check('/fixed.html')).failures, []);
});
