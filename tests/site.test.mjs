// The white paper and its companion study (site/). Keeps them in step with the plugin and honest
// about their sources, so they can't quietly go stale the way the v3 page did.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { findRawColors, tokensProblem } from '../scripts/tokens-check.mjs';

const repo = resolve(new URL('..', import.meta.url).pathname);
const pages = ['index.html', 'instructions.html'];
const read = (page) => readFileSync(join(repo, 'site', page), 'utf8');

const pluginCommands = () => [
  ...readdirSync(join(repo, 'skills')).map((skill) => `/city-app:${skill}`),
  ...readdirSync(join(repo, 'commands')).flatMap((group) =>
    readdirSync(join(repo, 'commands', group)).map((file) => `/city-app:${group}:${file.replace(/\.md$/, '')}`)),
].sort();

for (const page of pages) {
  const html = read(page);

  test(`${page}: lists every plugin command, and no others`, () => {
    const onPage = [...new Set(html.match(/\/city-app:[a-z:-]*[a-z]/g))].sort();
    assert.deepEqual(onPage, pluginCommands());
  });

  test(`${page}: is written as a scientific case study`, () => {
    const sections = ['abstract', 'introduction', 'method', 'results', 'discussion', 'limitations', 'conclusion', 'references'];
    const missing = sections.filter((id) => !new RegExp(`<section[^>]*\\bid="${id}"`).test(html));
    assert.deepEqual(missing, [], `site/${page} is a white paper, and the owner wants it to read as a scientific case study, not a product page. Add these sections: ${missing.join(', ')}.`);
  });

  test(`${page}: every citation points to a reference, and every reference is cited`, () => {
    const refs = [...html.matchAll(/<li id="ref-(\d+)"/g)].map((m) => m[1]);
    const cited = new Set([...html.matchAll(/href="#ref-(\d+)"/g)].map((m) => m[1]));
    assert.ok(refs.length > 0, 'the paper lists no references');
    assert.deepEqual([...cited].filter((n) => !refs.includes(n)), [], 'citations with no matching reference');
    assert.deepEqual(refs.filter((n) => !cited.has(n)), [], 'references the text never cites');
  });

  test(`${page}: shows the current plugin version`, () => {
    const { version } = JSON.parse(readFileSync(join(repo, '.claude-plugin/plugin.json'), 'utf8'));
    const shown = [...html.matchAll(/\bv(\d+\.\d+\.\d+)\b/g)].map((m) => m[1]);
    assert.ok(shown.length > 0, 'the page shows no version');
    assert.deepEqual([...new Set(shown)], [version]);
  });

  test(`${page}: links into the repo point at files that exist`, () => {
    const paths = [...html.matchAll(/github\.com\/balbonits\/city-app-framework\/(?:blob|tree)\/main\/([^"#?]+)/g)].map((m) => m[1]);
    assert.ok(paths.length >= 5);
    for (const path of paths) assert.ok(existsSync(join(repo, decodeURIComponent(path))), `${path} is not in the repo`);
  });

  test(`${page}: every link to a section of the page has a target`, () => {
    const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    assert.ok(targets.length >= 4);
    for (const id of targets) assert.match(html, new RegExp(`id="${id}"`), `#${id}`);
  });

  test(`${page}: every file the page loads or links to is there`, () => {
    const files = [...html.matchAll(/(?:href|src)="(?!https?:|#)([^"]+)"/g)].map((m) => m[1]);
    const css = readFileSync(join(repo, 'site/styles.css'), 'utf8');
    files.push(...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]));
    assert.ok(files.length >= 4);
    for (const file of files) assert.ok(existsSync(join(repo, 'site', file)), `site/${file} is missing`);
  });
}

test('the two papers link to each other', () => {
  assert.match(read('index.html'), /href="instructions\.html"/);
  assert.match(read('instructions.html'), /href="index\.html"/);
});

test('colors come from design tokens', () => {
  const problems = findRawColors(join(repo, 'site')).map(tokensProblem);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});
