// Tests for /city-app:ui:check (scripts/ui-check.mjs) that need no browser. The browser path is
// tested in demo/, which has playwright and axe-core installed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { axeProblems, consoleProblem, fillPort, freePort, groupBySize, overflowProblem, startServer, stopServer } from '../scripts/ui-check.mjs';

const SCRIPT = new URL('../scripts/ui-check.mjs', import.meta.url).pathname;
const tmp = () => mkdtempSync(join(tmpdir(), 'ui-'));
const cli = (args) => spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, NODE_PATH: '' } });

test('fix-it messages name the page, the problem and what to do', () => {
  const nodes = ['#a', '#b', '#c', '#d', '#e'].map((t) => ({ target: [t] }));
  const [line] = axeProblems('/', [{ id: 'button-name', impact: 'critical', help: 'Buttons must have discernible text', helpUrl: 'https://x/button-name', nodes }]);
  assert.equal(line, 'Accessibility on /: Buttons must have discernible text (button-name, critical) at #a, #b, #c and 2 more. How to fix: https://x/button-name');
  assert.match(consoleProblem('/about', 'x is undefined'), /^Console error on \/about: x is undefined\. .*don't silence it/);
  assert.match(overflowProblem('/', { width: 390, scroll: 608, culprits: ['div.banner'] }), /608px wide on a 390px screen.*Too wide: div\.banner/);
});

test('the same problem at several sizes is one line listing the sizes', () => {
  const lines = groupBySize([
    { problem: 'A', size: 'phone' }, { problem: 'B', size: 'phone' }, { problem: 'A', size: 'tablet' },
  ]);
  assert.deepEqual(lines, ['A [phone, tablet]', 'B [phone]']);
});

test('without playwright and axe-core it says how to install them', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'package.json'), '{"name":"x"}');
  const r = cli(['--dir', dir]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /need playwright and axe-core as dev dependencies: npm install --save-dev playwright axe-core/);
});

test('refuses unknown sizes, and --add-test without a start command', () => {
  assert.equal(cli(['--sizes', 'watch']).status, 2);
  const r = cli(['--add-test', '--dir', tmp()]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--add-test needs --start/);
});

test('--add-test copies the script and adds a test, never overwriting', () => {
  const dir = tmp();
  const args = ['--add-test', '--dir', dir, '--start', 'PORT=4321 npm start', '--url', 'http://localhost:4321', '--pages', '/,/about'];
  const first = cli(args);
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, /added {4}scripts\/ui-check\.mjs\nadded {4}test\/ui\.test\.js/);
  assert.equal(readFileSync(join(dir, 'scripts/ui-check.mjs'), 'utf8'), readFileSync(SCRIPT, 'utf8'));
  const testText = readFileSync(join(dir, 'test/ui.test.js'), 'utf8');
  assert.match(testText, /start: "PORT=4321 npm start", url: "http:\/\/localhost:4321", pages: \["\/","\/about"\]/);
  writeFileSync(join(dir, 'test/ui.test.js'), 'mine\n');
  assert.match(cli(args).stdout, /kept {5}test\/ui\.test\.js \(already there\)/);
  assert.equal(readFileSync(join(dir, 'test/ui.test.js'), 'utf8'), 'mine\n');
  assert.ok(existsSync(join(dir, 'scripts/ui-check.mjs')));
});

test('starts the app and waits for it, and refuses a port that is already taken', async () => {
  const port = 40000 + Math.floor(Math.random() * 20000);
  const url = `http://localhost:${port}`;
  const child = await startServer(`node -e "require('http').createServer((q, s) => s.end('ok')).listen(${port})"`, url, tmp(), 10_000);
  assert.equal(await (await fetch(url)).text(), 'ok');
  await assert.rejects(startServer('true', url, tmp()), /already running at/);
  stopServer(child);
  await new Promise((r) => child.once('exit', r));
});

test('{port} becomes a free port in the start command and the url', async () => {
  assert.equal(fillPort('PORT={port} npm start', 5123), 'PORT=5123 npm start');
  assert.equal(fillPort('http://localhost:{port}/', 5123), 'http://localhost:5123/');
  assert.equal(fillPort(undefined, 5123), undefined);
  const port = await freePort();
  const server = createServer().listen(port);
  await new Promise((r) => server.once('listening', r));
  server.close();
});

test('says so when the app never answers', async () => {
  const busy = createServer();
  await new Promise((r) => busy.listen(0, r));
  const { port } = busy.address();
  busy.close();
  await assert.rejects(startServer('sleep 5', `http://localhost:${port}`, tmp(), 1500), /didn't answer .* within 1\.5s/);
});
