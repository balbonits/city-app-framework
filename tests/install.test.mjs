import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const INSTALL = new URL('../scripts/install.mjs', import.meta.url).pathname;
const install = (...args) => spawnSync('node', [INSTALL, ...args], { encoding: 'utf8' });
const read = (dir, file) => readFileSync(join(dir, file), 'utf8');

test('installs into a fresh folder, creating missing parent folders', () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'inst-')), 'does', 'not', 'exist');
  const r = install(dir, '--name', 'Habit App');
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['AGENTS.md', 'CLAUDE.md', '.claude/settings.json', '.claude/hooks/guard.mjs', '.claude/hooks/test-gate.mjs']) {
    assert.ok(existsSync(join(dir, f)), f);
  }
  assert.match(read(dir, 'AGENTS.md'), /^# Habit App/);
  assert.equal(read(dir, 'CLAUDE.md').trim(), '@AGENTS.md');
});

test('--check reports what is missing and changes nothing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  writeFileSync(join(dir, 'CLAUDE.md'), 'Read AGENTS.md first.\n');
  const before = read(dir, 'CLAUDE.md');
  const r = install(dir, '--check');
  assert.equal(r.status, 1);
  assert.match(r.stdout, /missing\s+AGENTS\.md exists/);
  assert.match(r.stdout, /missing\s+CLAUDE\.md imports AGENTS\.md/);
  assert.equal(read(dir, 'CLAUDE.md'), before);
  assert.ok(!existsSync(join(dir, 'AGENTS.md')));
});

test('--check passes once the kit is installed and AGENTS.md is filled in', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'x', scripts: { test: 'node --test' } }));
  install(dir);
  assert.equal(install(dir, '--check').status, 1, 'placeholders still present');
  writeFileSync(join(dir, 'AGENTS.md'), read(dir, 'AGENTS.md').replace(/\{\{[^}]*\}\}/g, 'filled'));
  const r = install(dir, '--check');
  assert.equal(r.status, 0, r.stdout);
  assert.doesNotMatch(r.stdout, /missing|warning/);
});

test('uses the package.json name when no --name is given', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'shop-web' }));
  install(dir);
  assert.match(read(dir, 'AGENTS.md'), /^# shop-web/);
});

test('never overwrites an existing AGENTS.md', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  writeFileSync(join(dir, 'AGENTS.md'), '# Mine\n');
  const r = install(dir);
  assert.equal(read(dir, 'AGENTS.md'), '# Mine\n');
  assert.match(r.stdout, /Working agreement/);
});

test('adds @AGENTS.md to an existing CLAUDE.md that lacks it, once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  writeFileSync(join(dir, 'CLAUDE.md'), 'Read AGENTS.md first.\n');
  install(dir);
  install(dir);
  assert.equal(read(dir, 'CLAUDE.md'), '@AGENTS.md\n\nRead AGENTS.md first.\n');
});

test('merges hooks into an existing settings.json without losing anything, once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'inst-'));
  mkdirSync(join(dir, '.claude'));
  writeFileSync(join(dir, '.claude/settings.json'), JSON.stringify({ permissions: { allow: ['Bash(npm test)'] } }));
  install(dir);
  install(dir);
  const settings = JSON.parse(read(dir, '.claude/settings.json'));
  assert.deepEqual(settings.permissions, { allow: ['Bash(npm test)'] });
  assert.equal(settings.hooks.PreToolUse.length, 1);
  assert.equal(settings.hooks.Stop.length, 1);
});
