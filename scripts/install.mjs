#!/usr/bin/env node
// Copies the kit into a project. Safe to re-run: never overwrites your files.
//
//   node scripts/install.mjs <project-dir> [--name "My App"]
//   node scripts/install.mjs <project-dir> --check    (report only, change nothing)
//
// - Missing files are copied from kit/.
// - An existing AGENTS.md is left alone (you get a hint to merge the working agreement).
// - An existing CLAUDE.md gets `@AGENTS.md` added at the top if it lacks it, because
//   Claude Code only loads AGENTS.md on its own when there is no CLAUDE.md.
// - An existing .claude/settings.json gets the kit's hooks merged in.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { name: { type: 'string' }, check: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } },
});

if (values.help || positionals.length !== 1) {
  console.log('Usage: node scripts/install.mjs <project-dir> [--name "My App"] [--check]');
  process.exit(values.help ? 0 : 1);
}

const kit = resolve(dirname(new URL(import.meta.url).pathname), '..', 'kit');
const target = resolve(positionals[0]);

// --check: say what's missing or unfinished, change nothing, exit 1 if anything required fails.
if (values.check) {
  const read = (file) => (existsSync(join(target, file)) ? readFileSync(join(target, file), 'utf8') : null);
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  const settings = read(join('.claude', 'settings.json')) ?? '';
  let testScript = false;
  try { testScript = Boolean(JSON.parse(read('package.json') ?? '{}').scripts?.test); } catch { /* not JSON */ }
  const checks = [
    ['AGENTS.md exists', agents !== null],
    ['AGENTS.md has no {{...}} placeholders', agents !== null && !agents.includes('{{')],
    ['CLAUDE.md imports AGENTS.md (@AGENTS.md)', claude !== null && /^@AGENTS\.md\s*$/m.test(claude)],
    ['guard hook installed', existsSync(join(target, '.claude', 'hooks', 'guard.mjs'))],
    ['test-gate hook installed', existsSync(join(target, '.claude', 'hooks', 'test-gate.mjs'))],
    ['hooks wired in .claude/settings.json', settings.includes('guard.mjs') && settings.includes('test-gate.mjs')],
  ];
  for (const [label, ok] of checks) console.log(`  ${ok ? 'ok     ' : 'missing'}  ${label}`);
  console.log(`  ${testScript ? 'ok     ' : 'warning'}  package.json has a test script (the finish gate runs it)`);
  process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
}

mkdirSync(target, { recursive: true });

const projectName = () => {
  if (values.name) return values.name;
  const pkg = join(target, 'package.json');
  if (existsSync(pkg)) {
    try { return JSON.parse(readFileSync(pkg, 'utf8')).name ?? basename(target); } catch { /* fall through */ }
  }
  return basename(target);
};

const files = (dir) => readdirSync(dir).flatMap((entry) => {
  const path = join(dir, entry);
  return statSync(path).isDirectory() ? files(path) : [path];
});

const report = [];
const note = (status, file, detail = '') => report.push(`  ${status.padEnd(8)} ${file}${detail ? `  (${detail})` : ''}`);

function mergeHooks(existingPath, kitPath) {
  const existing = JSON.parse(readFileSync(existingPath, 'utf8'));
  const incoming = JSON.parse(readFileSync(kitPath, 'utf8'));
  existing.hooks ??= {};
  let added = 0;
  for (const [event, groups] of Object.entries(incoming.hooks)) {
    existing.hooks[event] ??= [];
    const present = new Set(existing.hooks[event].flatMap((g) => (g.hooks ?? []).map((h) => h.command)));
    for (const group of groups) {
      if (group.hooks.every((h) => present.has(h.command))) continue;
      existing.hooks[event].push(group);
      added += 1;
    }
  }
  if (added) writeFileSync(existingPath, `${JSON.stringify(existing, null, 2)}\n`);
  return added;
}

for (const source of files(kit)) {
  const rel = relative(kit, source);
  const dest = join(target, rel);

  if (!existsSync(dest)) {
    mkdirSync(dirname(dest), { recursive: true });
    if (rel === 'AGENTS.md') {
      writeFileSync(dest, readFileSync(source, 'utf8').replace('{{PROJECT_NAME}}', projectName()));
    } else {
      cpSync(source, dest);
    }
    note('added', rel);
    continue;
  }

  if (rel === 'CLAUDE.md') {
    const text = readFileSync(dest, 'utf8');
    if (/^@AGENTS\.md\s*$/m.test(text)) {
      note('ok', rel, 'already imports AGENTS.md');
    } else {
      writeFileSync(dest, `@AGENTS.md\n\n${text}`);
      note('updated', rel, 'added @AGENTS.md so Claude loads it');
    }
  } else if (rel === join('.claude', 'settings.json')) {
    const added = mergeHooks(dest, source);
    note(added ? 'updated' : 'ok', rel, added ? `merged ${added} hook group(s)` : 'hooks already present');
  } else if (rel === 'AGENTS.md') {
    const text = readFileSync(dest, 'utf8');
    note('kept', rel, /## Working agreement/.test(text) ? 'has a working agreement' : 'merge the "Working agreement" section from kit/AGENTS.md');
  } else {
    note('kept', rel, 'exists, not overwritten');
  }
}

console.log(`Installed the kit into ${target}\n\n${report.join('\n')}\n`);
console.log([
  'Next:',
  '  1. Fill in the {{...}} placeholders in AGENTS.md (commands, layout, gotchas). Keep it short.',
  '  2. To approve a dependency, add its name to .claude/approved-deps.txt yourself.',
  '  3. Commit the files so every session (local or cloud) gets them.',
].join('\n'));
