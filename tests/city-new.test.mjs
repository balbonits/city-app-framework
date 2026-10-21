import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CITY = join(ROOT, 'bin', 'city.mjs');
const INSTALL = join(ROOT, 'scripts', 'install.mjs');

// Runs the real CLI with the temp dir as the working directory.
const cityIn = (cwd, ...args) => spawnSync(
  process.execPath,
  [CITY, ...args],
  { cwd, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } },
);
const check = (dir) => spawnSync(process.execPath, [INSTALL, dir, '--check'], { encoding: 'utf8' });
const lastLine = (stdout) => stdout.trimEnd().split('\n').pop();

// A snapshot of everything under a directory, so a refused run can be compared for changes.
const snapshot = (dir) => readdirSync(dir, { withFileTypes: true, recursive: true })
  .filter((e) => e.isFile())
  .map((e) => ({ path: join(e.parentPath, e.name), size: e.size }))
  .map(({ path, size }) => [path, size, readFileSync(path).toString('base64')])
  .sort();

test('AC1: city new demo --template cli installs the kit and passes --check', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  const r = cityIn(cwd, 'new', 'demo', '--template', 'cli');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(join(cwd, 'demo')), 'demo/ exists');
  const c = check(join(cwd, 'demo'));
  assert.equal(c.status, 0, c.stdout + c.stderr);
  assert.match(lastLine(c.stdout), /^PASS/);
});

test('AC2: .city-app.json is sorted, has kitVersion, answers, and a matching hash per scaffolded file', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  assert.equal(cityIn(cwd, 'new', 'demo', '--template', 'cli').status, 0);
  const target = join(cwd, 'demo');
  const lock = JSON.parse(readFileSync(join(target, '.city-app.json'), 'utf8'));
  const isSorted = (v) => {
    if (Array.isArray(v) || typeof v !== 'object' || v === null) return true;
    const keys = Object.keys(v);
    return keys.every((k, i) => k === [...keys].sort()[i])
      && Object.values(v).every(isSorted);
  };
  assert.ok(isSorted(lock), 'keys sorted at every level');
  assert.ok(lock.kitVersion, 'has kitVersion');
  assert.equal(lock.answers.testCommand, 'npm test', 'answers.testCommand');
  assert.equal(lock.answers.name, 'demo', 'answers.name');
  assert.equal(lock.answers.template, 'cli', 'answers.template');
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
  const rels = walk(target).map((p) => p.slice(target.length + 1).replaceAll('\\', '/'))
    .filter((rel) => rel !== '.city-app.json' && !rel.startsWith('.city/'));
  assert.ok(rels.length >= 4, 'scaffold has files');
  assert.deepEqual(Object.keys(lock.files).sort(), rels.sort(), 'lock lists exactly the scaffolded files');
  for (const rel of rels) {
    const entry = lock.files[rel];
    assert.ok(entry, `lockfile entry for ${rel}`);
    assert.match(entry.sha256, /^[0-9a-f]{64}$/, `64-hex sha256 for ${rel}`);
    assert.match(entry.owner, /^(kit|project)$/);
    const actual = createHash('sha256').update(readFileSync(join(target, rel))).digest('hex');
    assert.equal(entry.sha256, actual, `sha256 matches ${rel} on disk`);
  }
});

test('AC3: refuses a non-empty target and changes nothing', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  const target = join(cwd, 'demo');
  mkdirSync(target);
  writeFileSync(join(target, 'existing.txt'), 'keep me\n');
  const before = snapshot(cwd);
  const r = cityIn(cwd, 'new', 'demo', '--template', 'cli');
  assert.notEqual(r.status, 0);
  assert.deepEqual(snapshot(cwd), before, 'directory listing and contents unchanged');
  assert.match(lastLine(r.stdout), /^FAIL new: .*run city new/);
});

test('AC5: golden output, no ANSI, one final line; --json is one object with a matching status', () => {
  for (const [name, args, expected] of [
    ['pass', ['new', 'demo', '--template', 'cli'], 'tests/golden/city-new-pass.txt'],
    ['fail-exists', ['new', 'demo', '--template', 'cli'], 'tests/golden/city-new-fail-exists.txt'],
  ]) {
    const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
    if (name === 'fail-exists') {
      mkdirSync(join(cwd, 'demo'));
      writeFileSync(join(cwd, 'demo', 'existing.txt'), 'x\n');
    }
    const r = cityIn(cwd, ...args);
    const golden = readFileSync(join(ROOT, expected), 'utf8');
    assert.equal(r.stdout, golden, `golden ${name} matches`);
    assert.doesNotMatch(r.stdout, /\u001b\[/, 'no ANSI escapes');
    const finals = r.stdout.trimEnd().split('\n').filter((l) => /^(PASS|FAIL) new: /.test(l));
    assert.equal(finals.length, 1, 'exactly one final PASS/FAIL line');
    assert.equal(r.status, expected.includes('pass') ? 0 : 1, 'exit code matches the final line');
    // The --json run uses its own fresh tmpdir so it is independent of the run above.
    const jcwd = mkdtempSync(join(tmpdir(), 'city-new-'));
    if (name === 'fail-exists') {
      mkdirSync(join(jcwd, 'demo'));
      writeFileSync(join(jcwd, 'demo', 'existing.txt'), 'x\n');
    }
    const j = cityIn(jcwd, '--json', ...args);
    const parsed = JSON.parse(j.stdout);
    assert.equal(typeof parsed, 'object');
    assert.equal(parsed.status, j.status, '--json status matches the exit code');
  }
});

test('missing or invalid --template fails and names the command', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  for (const args of [['new', 'demo'], ['new', 'demo', '--template', 'nope']]) {
    const r = cityIn(cwd, ...args);
    assert.notEqual(r.status, 0);
    assert.match(lastLine(r.stdout), /city new <name> --template web\|cli/);
  }
});

test('unknown flag fails with a FAIL line and the command', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  const r = cityIn(cwd, 'new', 'demo', '--template', 'cli', '--temp', 'cli');
  assert.notEqual(r.status, 0);
  assert.doesNotMatch(r.stderr, /SyntaxError|Traceback|at /, 'no stack trace');
  assert.match(lastLine(r.stdout), /^FAIL new: .*run city new <name> --template web\|cli$/);
});

test('invalid names are refused before touching disk', () => {
  const base = mkdtempSync(join(tmpdir(), 'city-new-'));
  const cwd = join(base, 'inner');
  mkdirSync(cwd);
  const r = cityIn(cwd, 'new', '../x', '--template', 'cli');
  assert.notEqual(r.status, 0);
  assert.match(lastLine(r.stdout), /^FAIL new: invalid name \.\.\/x, run city new <name> --template web\|cli$/);
  assert.ok(!existsSync(join(base, 'x')), 'nothing created outside the working dir');
  assert.ok(!existsSync(join(cwd, 'x')), 'nothing created inside the temp dir');
});

// F1: refuse bad app names before touching disk.
test('F1: bad app names are refused before touching disk', () => {
  const bad = [
    'Upper', 'con', 'CON', 'con.txt', 'nul.', 'com1', 'COM\u00b9', 'lpt\u00b3.md',
    'conin$', 'demo.', 'node_modules', 'favicon.ico', 'http', '_x', '.x',
    'a'.repeat(215), 'a b',
    '(x)', 'x~', "it's", 'a!', 'a*',
    'aux.tar.gz', 'COM0', 'lpt9', 'CLOCK$', 'conout$.log', 'prn',
  ];
  for (const n of bad) {
    const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
    const r = cityIn(cwd, 'new', n, '--template', 'cli');
    assert.equal(r.status, 1, `exit 1 for ${JSON.stringify(n)}`);
    assert.match(
      lastLine(r.stdout),
      new RegExp(`^FAIL new: invalid name ${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, run city new <name> --template web\\|cli$`),
      `FAIL line for ${JSON.stringify(n)}`,
    );
    assert.equal(readdirSync(cwd).length, 0, `cwd empty for ${JSON.stringify(n)}`);
  }
  // Positive control: a valid name passes.
  const ok = mkdtempSync(join(tmpdir(), 'city-new-'));
  const r = cityIn(ok, 'new', 'my-app.v2', '--template', 'cli');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(join(ok, 'my-app.v2')), 'my-app.v2/ created');
});

// F2: install --check names the kit's install script by absolute path.
test('F2: install --check FAIL hint names the kit install script by absolute path', () => {
  const empty = mkdtempSync(join(tmpdir(), 'city-new-'));
  const r = spawnSync(process.execPath, [INSTALL, empty, '--check'], { encoding: 'utf8' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  const line = lastLine(r.stdout);
  assert.match(line, /^FAIL install --check: \d+ missing, run node ".*" .*$/, 'FAIL hint shape');
  const m = line.match(/run node "([^"]+)"/);
  assert.ok(m, 'quoted path present');
  const quoted = m[1];
  assert.ok(existsSync(quoted), `quoted path exists: ${quoted}`);
  assert.equal(quoted, INSTALL, 'quoted path is the repo scripts/install.mjs');
});

// F3(a): .city-app.json owners per path.
test('F3a: .city-app.json owners per path', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  assert.equal(cityIn(cwd, 'new', 'demo', '--template', 'cli').status, 0);
  const lock = JSON.parse(readFileSync(join(cwd, 'demo', '.city-app.json'), 'utf8'));
  const owner = (rel) => lock.files[rel]?.owner;
  assert.equal(owner('.claude/hooks/guard.mjs'), 'kit');
  assert.equal(owner('.claude/hooks/test-gate.mjs'), 'kit');
  assert.equal(owner('.claude/settings.json'), 'kit');
  assert.equal(owner('AGENTS.md'), 'project');
  assert.equal(owner('CLAUDE.md'), 'project');
  assert.equal(owner('package.json'), 'project');
  assert.equal(owner('.gitignore'), 'project');
});

// F3(b): --json stdout is exactly one object.
test('F3b: --json stdout is exactly one object', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
  const r = cityIn(cwd, 'new', 'demo', '--template', 'cli', '--json');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const trimmed = r.stdout.trim();
  assert.ok(trimmed.startsWith('{'), 'stdout starts with {');
  assert.ok(trimmed.endsWith('}'), 'stdout ends with }');
  assert.doesNotMatch(r.stdout, /\u001b\[/, 'no ANSI escapes');
  const parsed = JSON.parse(r.stdout);
  assert.equal(typeof parsed, 'object');
  assert.equal(parsed.status, 0);
  assert.equal(parsed.name, 'demo', 'parsed.name is demo');
  assert.ok(parsed.result.startsWith('PASS new:'), 'result starts with PASS new:');
});

// F4: --verbose prints the Windows reserved device name reason for reserved stems.
test('F4: --verbose prints Windows reserved device name reason', () => {
  for (const n of ['con', 'COM\u00b9', 'conin$', 'aux.tar.gz']) {
    const cwd = mkdtempSync(join(tmpdir(), 'city-new-'));
    const r = cityIn(cwd, 'new', n, '--template', 'cli', '--verbose');
    assert.equal(r.status, 1, `exit 1 for ${JSON.stringify(n)}`);
    assert.ok(r.stdout.includes('Windows reserved device name'), `stdout contains reason for ${JSON.stringify(n)}`);
  }
});
