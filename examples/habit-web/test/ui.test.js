// UI checks on every page: accessibility (axe), console errors, and nothing wider than the
// screen, at phone, tablet and desktop sizes. Added by /city-app:ui:check. It runs with npm test,
// so an agent can't finish while a page fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runUiCheck } from '../scripts/ui-check.mjs';

test('every page passes the UI checks', async () => {
  const { failures } = await runUiCheck({ start: "PORT={port} node server.mjs", url: "http://localhost:{port}", pages: ["/", "/?demo", "/about.html"] });
  assert.deepEqual(failures, [], `\n${failures.join('\n')}`);
});
