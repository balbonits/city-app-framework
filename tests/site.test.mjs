// The white paper page (site/). Keeps it in step with the plugin, so it can't quietly go stale
// the way the v3 page did.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { findRawColors, tokensProblem } from '../scripts/tokens-check.mjs';

const repo = resolve(new URL('..', import.meta.url).pathname);
const html = readFileSync(join(repo, 'site/index.html'), 'utf8');

const pluginCommands = () => [
  ...readdirSync(join(repo, 'skills')).map((skill) => `/city-app:${skill}`),
  ...readdirSync(join(repo, 'commands')).flatMap((group) =>
    readdirSync(join(repo, 'commands', group)).map((file) => `/city-app:${group}:${file.replace(/\.md$/, '')}`)),
].sort();

test('lists every plugin command, and no others', () => {
  const onPage = [...new Set(html.match(/\/city-app:[a-z:-]*[a-z]/g))].sort();
  assert.deepEqual(onPage, pluginCommands());
});

test('shows the current plugin version', () => {
  const { version } = JSON.parse(readFileSync(join(repo, '.claude-plugin/plugin.json'), 'utf8'));
  const shown = [...html.matchAll(/\bv(\d+\.\d+\.\d+)\b/g)].map((m) => m[1]);
  assert.ok(shown.length > 0, 'the page shows no version');
  assert.deepEqual([...new Set(shown)], [version]);
});

test('links into the repo point at files that exist', () => {
  const paths = [...html.matchAll(/github\.com\/balbonits\/city-app-framework\/(?:blob|tree)\/main\/([^"#?]+)/g)].map((m) => m[1]);
  assert.ok(paths.length >= 5);
  for (const path of paths) assert.ok(existsSync(join(repo, decodeURIComponent(path))), `${path} is not in the repo`);
});

test('every link to a section of the page has a target', () => {
  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  assert.ok(targets.length >= 4);
  for (const id of targets) assert.match(html, new RegExp(`id="${id}"`), `#${id}`);
});

test('every file the page loads is there', () => {
  const files = [...html.matchAll(/(?:href|src)="(?!https?:|#)([^"]+)"/g)].map((m) => m[1]);
  const css = readFileSync(join(repo, 'site/styles.css'), 'utf8');
  files.push(...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]));
  assert.ok(files.length >= 4);
  for (const file of files) assert.ok(existsSync(join(repo, 'site', file)), `site/${file} is missing`);
});

test('colors come from design tokens', () => {
  const problems = findRawColors(join(repo, 'site')).map(tokensProblem);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});
