#!/usr/bin/env node
// Design-token check: fails when a color is written out instead of coming from a token.
// Colors may only appear where a token is defined (a custom property, `--name: #hex`); everywhere
// else, use var(--name). Checks CSS files, inline style attributes, and element.style in JS.
// Used by /city-app:ui:tokens. Self-contained (Node built-ins only), so --add-test can copy it.
//
//   node tokens-check.mjs [--dir .]
//   node tokens-check.mjs --add-test [--dir .]   copy this file into the project and add test/tokens.test.js
//
// Exits 1 with file:line fix-it messages when it finds raw colors, 0 when there are none.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const NAMED = ['red', 'green', 'blue', 'white', 'black', 'gray', 'grey', 'orange', 'yellow', 'purple', 'pink', 'brown',
  'crimson', 'tomato', 'firebrick', 'darkred', 'maroon', 'salmon', 'coral', 'navy', 'teal', 'silver', 'gold', 'olive',
  'lime', 'aqua', 'cyan', 'magenta', 'fuchsia', 'indigo', 'violet', 'beige', 'ivory', 'khaki', 'lavender', 'tan'];
const COLOR = new RegExp(`#[0-9a-f]{3,8}\\b|\\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\\(|(?<![\\w-])(${NAMED.join('|')})(?![\\w-])`, 'i');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'out', '.next', '.ui-baselines', 'test', 'tests', '__tests__']);
const UI_FILE = /\.(css|scss|html|jsx|tsx|vue|svelte|js|mjs|ts)$/;

// Removes what may hold a color legitimately: comments, quoted strings, var(--x, fallback) and url(...).
const scrub = (value) => value.replace(/\/\*.*?\*\//g, '').replace(/"[^"]*"|'[^']*'/g, '""')
  .replace(/var\([^()]*(\([^()]*\)[^()]*)*\)/g, 'var()').replace(/url\([^)]*\)/g, 'url()');

// Declarations in a chunk of CSS: [{ prop, value }]. A custom property (--name) defines a token.
const declarations = (css) => [...css.matchAll(/(?:^|[;{\s])(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]+)/g)]
  .map(([, prop, value]) => ({ prop, value }));

export function rawColorsInCss(line) {
  return declarations(line)
    .filter(({ prop, value }) => !prop.startsWith('--') && COLOR.test(scrub(value)))
    .map(({ prop, value }) => `${prop}: ${value.trim()}`);
}

// Inline styles in markup (style="..." or style={{...}}) and element.style in scripts.
export function rawColorsInMarkup(line) {
  const found = [];
  for (const [, double, single] of line.matchAll(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    const style = double ?? single;
    if (COLOR.test(scrub(style))) found.push(`style="${style.trim()}"`);
  }
  for (const [, style] of line.matchAll(/style\s*=\s*\{\{([^}]*)\}\}/g)) {
    if (COLOR.test(scrub(style.replace(/'[^']*'|"[^"]*"/g, (q) => q.slice(1, -1))))) found.push(`style={{${style.trim()}}}`);
  }
  const js = line.match(/\.style(?:\.[a-zA-Z]+\s*=|\.setProperty\s*\()\s*(.*)$/);
  if (js && COLOR.test(scrub(js[1].replace(/'[^']*'|"[^"]*"|`[^`]*`/g, (q) => q.slice(1, -1))))) found.push(js[0].trim());
  return found;
}

const walk = (dir, root) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const path = join(dir, e.name);
  if (e.isDirectory()) return SKIP_DIRS.has(e.name) || (dir === root && e.name === 'scripts') ? [] : walk(path, root);
  return UI_FILE.test(e.name) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(e.name) ? [path] : [];
});

// Returns [{ file, line, found }] for every raw color outside a token definition.
export function findRawColors(dir = '.') {
  const root = resolve(dir);
  return walk(root, root).flatMap((path) => {
    const css = /\.s?css$/.test(path);
    let text = readFileSync(path, 'utf8');
    if (css) text = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
    return text.split('\n').flatMap((line, i) => {
      const found = css ? rawColorsInCss(line) : rawColorsInMarkup(line);
      return found.length ? [{ file: relative(root, path), line: i + 1, found }] : [];
    });
  });
}

export const tokensProblem = ({ file, line, found }) =>
  `${file}:${line} writes a color out: ${found.join('; ')}. Use a token: var(--name), adding --name to :root if there isn't one yet.`;

const testFile = `// Design tokens: every color comes from a token (var(--name)), never written out. Added by
// /city-app:ui:tokens. It runs with npm test, so an agent can't finish with a raw color.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRawColors, tokensProblem } from '../scripts/tokens-check.mjs';

test('colors come from design tokens', () => {
  const problems = findRawColors('.').map(tokensProblem);
  assert.deepEqual(problems, [], \`\\n\${problems.join('\\n')}\`);
});
`;

// Copies this file into the project and adds a test that runs it. Never overwrites.
export function addTest(dir) {
  const root = resolve(dir);
  const files = [
    ['scripts/tokens-check.mjs', (to) => copyFileSync(fileURLToPath(import.meta.url), to)],
    ['test/tokens.test.js', (to) => writeFileSync(to, testFile)],
  ];
  return files.map(([file, write]) => {
    const to = join(root, file);
    if (existsSync(to)) return `kept     ${file} (already there)`;
    mkdirSync(dirname(to), { recursive: true });
    write(to);
    return `added    ${file}`;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values: opt } = parseArgs({
    options: { dir: { type: 'string', default: '.' }, 'add-test': { type: 'boolean', default: false } },
  });
  if (opt['add-test']) {
    for (const line of addTest(opt.dir)) console.log(line);
    console.log('npm test now fails on colors written outside the tokens.');
    process.exit(0);
  }
  const problems = findRawColors(opt.dir);
  for (const p of problems) console.log(`✗ ${tokensProblem(p)}`);
  console.log(problems.length
    ? `${problems.length} place(s) write colors out. Move them into tokens.`
    : 'Every color comes from a token.');
  process.exit(problems.length ? 1 : 0);
}
