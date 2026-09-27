// Proof that approved baselines catch visual changes: approve a page, check it again (no
// change), then serve a changed version of it (a bigger heading) and see the check fail.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runUiCheck } from '../scripts/ui-check.mjs';

test('a page that looks different from its approved screenshot fails, with a diff image', async () => {
  const baselines = mkdtempSync(join(tmpdir(), 'baselines-'));
  const check = (root, approve = false) => runUiCheck({
    start: `ROOT=${root} PORT={port} node server.mjs`, url: 'http://localhost:{port}', pages: ['/fixed.html'], sizes: ['phone'], baselines, approve,
  });
  const first = await check('test/fixtures', true);
  assert.equal(first.approved.length, 1);
  assert.deepEqual((await check('test/fixtures')).failures, []);
  const changed = (await check('test/fixtures/changed')).failures;
  assert.equal(changed.length, 1, changed.join('\n'));
  assert.match(changed[0], /^Looks different on \/fixed\.html: .*approve the new look with \/city-app:ui:baseline.*\[phone\]$/);
  const diff = changed[0].match(/diff: ([^)]+)\)/)?.[1];
  assert.ok(diff ? existsSync(diff) : /is now \d+x\d+/.test(changed[0]), 'diff image written, or the size change named');
});
