import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const sources = readdirSync(new URL('../src/', import.meta.url))
  .filter((f) => f.endsWith('.js'))
  .map((f) => [f, readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8')]);

test('CLI flags are parsed with util.parseArgs, not by hand', () => {
  for (const [file, src] of sources) {
    const handRolled = /\b(args|argv|process\.argv)(\.slice\(\d\))?\.(includes|indexOf|findIndex|find)\(\s*['"`]-/.test(src)
      || /===\s*['"`]--[a-z]/.test(src) || /startsWith\(\s*['"`]--/.test(src) || /\/\^?--[a-z]/.test(src);
    assert.ok(!handRolled,
      `src/${file} parses a --flag by hand. Use parseArgs from 'node:util' ` +
      '(allowPositionals: true). It handles --flag=value and unknown flags; hand-rolled parsing broke before.');
  }
});
