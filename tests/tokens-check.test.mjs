// Tests for /city-app:ui:tokens (scripts/tokens-check.mjs). Static checks, no browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { findRawColors, rawColorsInCss, rawColorsInMarkup, tokensProblem } from '../scripts/tokens-check.mjs';

const SCRIPT = new URL('../scripts/tokens-check.mjs', import.meta.url).pathname;

test('CSS: colors are fine where a token is defined, and flagged anywhere else', () => {
  for (const ok of [':root { --bg: #fff; --danger: rgb(200 0 0); }', '.card { --card-bg: #eee; }', '.a { color: var(--text); }',
    '.a { background: var(--bg, #fff); }', '.a { font-family: "Tomato Sans", serif; }', 'a:hover { color: currentColor; }',
    '.a { grid-template-areas: "red-zone"; }', '.a { background: url(#glow); }', '.a { color: transparent; }']) {
    assert.deepEqual(rawColorsInCss(ok), [], ok);
  }
  assert.deepEqual(rawColorsInCss('.btn { color: #d32f2f; }'), ['color: #d32f2f']);
  assert.deepEqual(rawColorsInCss('.btn:focus-visible { outline: 2px solid red; }'), ['outline: 2px solid red']);
  assert.deepEqual(rawColorsInCss('  border: 1px solid rgb(0 0 0 / 50%);'), ['border: 1px solid rgb(0 0 0 / 50%)']);
});

test('markup and scripts: inline styles and element.style are checked', () => {
  assert.equal(rawColorsInMarkup('<p style="color: #333">x</p>').length, 1);
  assert.equal(rawColorsInMarkup("<p style='background: tomato'>x</p>").length, 1);
  assert.equal(rawColorsInMarkup("<Card style={{ color: '#fff' }} />").length, 1);
  assert.equal(rawColorsInMarkup("el.style.backgroundColor = 'red';").length, 1);
  assert.deepEqual(rawColorsInMarkup('<p style="color: var(--muted)">x</p>'), []);
  assert.deepEqual(rawColorsInMarkup('<a href="#main">Skip</a>'), []);
});

function project(files) {
  const dir = mkdtempSync(join(tmpdir(), 'tokens-'));
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(join(dir, file, '..'), { recursive: true });
    writeFileSync(join(dir, file), text);
  }
  return dir;
}

test('finds raw colors with file and line, skipping comments, tests, node_modules and tooling', () => {
  const dir = project({
    'src/app.css': ':root { --danger: #b3261e; }\n/* old: color: #000 */\n.btn { background: #d32f2f; }\n',
    'src/app.js': "el.style.color = 'red';\n",
    'test/fixture.html': '<p style="color: red">test</p>',
    'src/app.test.js': "el.style.color = 'red';\n",
    'node_modules/lib/x.css': '.x { color: red; }',
    'scripts/tool.js': "el.style.color = 'red';\n",
  });
  const found = findRawColors(dir);
  assert.deepEqual(found.map((f) => `${f.file}:${f.line}`).sort(), ['src/app.css:3', 'src/app.js:1']);
  assert.match(tokensProblem(found.find((f) => f.file === 'src/app.css')), /^src\/app\.css:3 writes a color out: background: #d32f2f\. Use a token: var\(--name\)/);
});

test('the command line exits 1 on raw colors and 0 when clean; --add-test never overwrites', () => {
  const dirty = project({ 'style.css': '.a { color: navy; }' });
  const r = spawnSync('node', [SCRIPT, '--dir', dirty], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /✗ style\.css:1 writes a color out: color: navy/);
  const clean = project({ 'style.css': ':root { --ink: navy; }\n.a { color: var(--ink); }' });
  assert.equal(spawnSync('node', [SCRIPT, '--dir', clean], { encoding: 'utf8' }).status, 0);
  const add = spawnSync('node', [SCRIPT, '--add-test', '--dir', clean], { encoding: 'utf8' });
  assert.match(add.stdout, /added {4}scripts\/tokens-check\.mjs\nadded {4}test\/tokens\.test\.js/);
  assert.equal(readFileSync(join(clean, 'scripts/tokens-check.mjs'), 'utf8'), readFileSync(SCRIPT, 'utf8'));
  writeFileSync(join(clean, 'test/tokens.test.js'), 'mine\n');
  assert.match(spawnSync('node', [SCRIPT, '--add-test', '--dir', clean], { encoding: 'utf8' }).stdout, /kept {5}test\/tokens\.test\.js/);
});
