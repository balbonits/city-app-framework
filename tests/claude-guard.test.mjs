// The tests must never start the real `claude` CLI (it is paid). Two layers keep that true:
// the test helper refuses to run unless the fake is what `claude` resolves to, and runClaude itself
// refuses under `node --test` unless CLAUDE_BIN points at a fake inside the temp folder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { claudeCommand } from '../experiments/lib/claude.mjs';
import { assertFakeResolved, fakeClaude, firstOnPath, tmp } from './helpers/rules.mjs';

const testEnv = { NODE_TEST_CONTEXT: 'child-v8' };

test('runClaude refuses the real claude under node --test', () => {
  assert.throws(() => claudeCommand(['-p', 'x'], testEnv), /Refusing to start the real claude/);
  const outside = process.platform === 'win32' ? 'C:\\Program Files\\claude\\claude.exe' : '/usr/local/bin/claude';
  assert.throws(() => claudeCommand(['-p', 'x'], { ...testEnv, CLAUDE_BIN: outside }), /Refusing to start the real claude/);
  assert.throws(() => claudeCommand(['-p', 'x'], { ...testEnv, CLAUDE_BIN: join(tmpdir(), '..', 'claude.exe') }), /Refusing/);
});

test('runClaude runs a fake inside the temp folder, and the real claude outside tests', () => {
  const fake = join(fakeClaude(), 'claude.cjs');
  assert.deepEqual(claudeCommand(['-p', 'x'], { ...testEnv, CLAUDE_BIN: fake }), [process.execPath, [fake, '-p', 'x']]);
  assert.deepEqual(claudeCommand(['-p', 'x'], {}), ['claude', ['-p', 'x']]);
});

test('the fake is first on PATH, found the way the OS would find it, and answers as the fake', () => {
  const dir = fakeClaude();
  const env = { PATH: `${dir}${delimiter}${process.env.PATH}`, CLAUDE_BIN: join(dir, 'claude.cjs') };
  assert.ok(firstOnPath('claude', env).startsWith(dir));
  assertFakeResolved(dir, env);
  const probe = spawnSync(process.execPath, [env.CLAUDE_BIN, '--version'], { encoding: 'utf8' });
  assert.equal(probe.stdout.trim(), 'fake-claude');
});

test('the helper throws when another claude comes first on PATH, or CLAUDE_BIN is wrong', () => {
  const dir = fakeClaude();
  const impostor = tmp('rt-impostor-');
  mkdirSync(impostor, { recursive: true });
  for (const name of ['claude', 'claude.exe']) writeFileSync(join(impostor, name), '');
  const env = { PATH: `${impostor}${delimiter}${dir}${delimiter}${process.env.PATH}`, CLAUDE_BIN: join(dir, 'claude.cjs') };
  assert.throws(() => assertFakeResolved(dir, env), /resolves to .*rt-impostor/);
  assert.throws(() => assertFakeResolved(dir, { ...env, PATH: `${dir}${delimiter}${env.PATH}`, CLAUDE_BIN: undefined }), /CLAUDE_BIN is not set/);
  assert.throws(() => assertFakeResolved(dir, { PATH: '', CLAUDE_BIN: join(dir, 'claude.cjs') }), /resolves to nothing/);
});