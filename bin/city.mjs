#!/usr/bin/env node
// city - the City App CLI.
//
//   city new <name> --template web|cli [--json] [--verbose]
//
// Quiet by default: one progress line per step, details in <target>/.city/logs/new.log.
// Every run ends in exactly one line: PASS new: ... or FAIL new: ... run <next command>.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';
import { sha256File, ownerFor, writeLockfile } from '../scripts/lib/lockfile.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const INSTALL = join(ROOT, 'scripts', 'install.mjs');
const WORKDIR = process.cwd();
const KIT_VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version ?? '0.0.0';
const USAGE = 'city new <name> --template web|cli';

// Windows reserved device names, case-insensitive, matched on the bare stem (the part
// before any extension). Includes the superscript forms (COM¹, LPT³, ...) and the
// CONIN$/CONOUT$/CLOCK$ variants.
const RESERVED_STEMS = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM0', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT0', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
  'COM\u00b9', 'COM\u00b2', 'COM\u00b3',
  'LPT\u00b9', 'LPT\u00b2', 'LPT\u00b3',
  'CONIN$', 'CONOUT$', 'CLOCK$',
]);
const CORE_MODULES = new Set(builtinModules);

// Returns a short reason string if the name is invalid, or null if it is fine.
// Runs before anything touches the disk.
function invalidName(name) {
  if (typeof name !== 'string' || name.length === 0) return 'empty name';
  if (name.length > 214) return 'name too long (max 214)';
  // Checked first so reserved names with $, superscripts or capitals get the right reason.
  const stem = name.split('.')[0];
  if (RESERVED_STEMS.has(stem.toUpperCase())) return 'name is a Windows reserved device name';
  if (/[A-Z]/.test(name)) return 'uppercase letters are not allowed';
  if (name !== name.trim()) return 'leading or trailing spaces';
  if (name.endsWith('.') || name.endsWith(' ')) return 'name ends in a dot or space';
  if (name.startsWith('.') || name.startsWith('_')) return 'name starts with a dot or underscore';
  if (name.includes('/') || name.includes('\\')) return 'name contains a path separator';
  if (name === '..') return 'name contains ..';
  if (/[~'!()*]/.test(name)) return 'name contains a special character';
  if (encodeURIComponent(name) !== name) return 'name is not URL-safe';
  if (name === 'node_modules') return 'node_modules is reserved';
  if (name === 'favicon.ico') return 'favicon.ico is reserved';
  if (CORE_MODULES.has(name)) return 'name is a Node core module';
  return null;
}

let values = {};
let positionals = [];
try {
  ({ values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      template: { type: 'string' },
      json: { type: 'boolean' },
      verbose: { type: 'boolean' },
    },
  }));
} catch (err) {
  console.log(`FAIL new: ${err.message.split('. ')[0].toLowerCase()}, run ${USAGE}`);
  process.exit(1);
}

const logLines = [];
// Details go to the log; --verbose also shows them on stdout (never with --json).
const log = (...lines) => {
  for (const l of lines) {
    if (l === undefined || l === null || l === '') continue;
    logLines.push(String(l).trimEnd());
    if (values.verbose && !values.json) console.log(`  ${String(l).trimEnd()}`);
  }
};
const quiet = (...lines) => lines.forEach((l) => log(l));
const say = (...lines) => {
  if (!values.json) lines.forEach((l) => console.log(l));
  logLines.push(...lines);
};

function finish(ok, detail, next, extra = {}) {
  const line = `${ok ? 'PASS' : 'FAIL'} new: ${detail}${ok ? '' : `, run ${next}`}`;
  if (values.json) {
    console.log(JSON.stringify(sort({
      command: 'new',
      name: extra.name ?? positionals[1] ?? null,
      template: values.template ?? null,
      status: ok ? 0 : 1,
      result: line,
      ...extra,
    }), null, 2));
  } else {
    console.log(line);
  }
  process.exit(ok ? 0 : 1);
}

function sort(obj) {
  if (Array.isArray(obj) || typeof obj !== 'object' || obj === null) return obj;
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, sort(obj[k])]));
}

if (positionals[0] !== 'new') {
  quiet('Usage:', USAGE);
  finish(false, `unknown command ${positionals[0] ?? '(none)'}`, USAGE);
}
const [name] = positionals.slice(1);
if (!name || !['web', 'cli'].includes(values.template)) {
  quiet(`Missing or invalid --template (need web or cli).`, `Usage: ${USAGE}`);
  finish(false, 'invalid arguments', USAGE);
}
const reason = invalidName(name);
if (reason) {
  quiet(`Invalid name: ${name} (${reason})`);
  finish(false, `invalid name ${name}`, USAGE);
}

const target = resolve(WORKDIR, name);

const writeLog = () => {
  const logPath = join(target, '.city', 'logs', 'new.log');
  mkdirSync(dirname(logPath), { recursive: true });
  writeFileSync(logPath, logLines.join('\n') + '\n');
};

// Refuse a target that exists and is not empty, before writing anything.
if (existsSync(target) && readdirSync(target, { withFileTypes: true }).length > 0) {
  const what = readdirSync(target, { withFileTypes: true }).map((e) => e.name).join(', ');
  log(`refused: ${name}/ already exists and is not empty (${what})`);
  say(`refused: ${name}/ already exists and is not empty`);
  finish(false, `${name}/ already exists and is not empty`, `city new <other-name> --template ${values.template}`);
}

// Step 1: create the directory and the minimal template files.
mkdirSync(target, { recursive: true });
writeFileSync(join(target, 'package.json'), `${JSON.stringify({
  name,
  private: true,
  type: 'module',
  scripts: { test: 'node --test' },
}, null, 2)}\n`);
writeFileSync(join(target, '.gitignore'), '.city/\n');
log(`created ${name}/ with package.json and .gitignore (template: ${values.template})`);
say(`created ${name}/`);

// Step 2: install the kit. Its output goes to the log, never stdout.
const install = spawnSync(process.execPath, [INSTALL, name, '--name', name], { cwd: WORKDIR, encoding: 'utf8' });
log(`install.mjs (exit ${install.status}):`, install.stdout, install.stderr);
if (install.status !== 0) {
  writeLog();
  say('install failed; see the log for details');
  finish(false, 'install failed', `node scripts/install.mjs ${name}`);
}
say('installed the kit');

// Step 3: fill the remaining {{...}} placeholders in AGENTS.md with short template defaults.
const agentsPath = join(target, 'AGENTS.md');
const defaults = values.template === 'web'
  ? {
    '{{One sentence: what this is and who uses it.}}': `${name} is a web app built with the city app kit.`,
    '{{Only what the file tree doesn\'t make obvious. Delete this section if there\'s nothing.}}': 'Delete this section once the layout is obvious from the file tree.',
    '{{Things an agent would get wrong without being told: unwritten rules ("names can contain spaces"), environment quirks, fragile areas, conventions that differ from the usual. Add a line when the same mistake happens twice.}}': 'Add a line here when an agent gets something wrong twice.',
  }
  : {
    '{{One sentence: what this is and who uses it.}}': `${name} is a command-line app built with the city app kit.`,
    '{{Only what the file tree doesn\'t make obvious. Delete this section if there\'s nothing.}}': 'Delete this section once the layout is obvious from the file tree.',
    '{{Things an agent would get wrong without being told: unwritten rules ("names can contain spaces"), environment quirks, fragile areas, conventions that differ from the usual. Add a line when the same mistake happens twice.}}': 'Add a line here when an agent gets something wrong twice.',
  };
let agents = readFileSync(agentsPath, 'utf8');
for (const [placeholder, value] of Object.entries(defaults)) {
  agents = agents.replaceAll(placeholder, value);
}
const leftover = agents.match(/\{\{[^}]*\}\}/g);
if (leftover) {
  log(`unfilled placeholders left in AGENTS.md: ${leftover.join(', ')}`);
}
writeFileSync(agentsPath, agents);
log('filled the AGENTS.md placeholders');
say('filled AGENTS.md');

// Step 4: write the lockfile (.city-app.json): version, answers, and a hash+owner per file.
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const files = {};
for (const p of walk(target)) {
  const rel = p.slice(target.length + 1).replaceAll('\\', '/');
  if (rel === '.city-app.json' || rel.startsWith('.city/')) continue;
  files[rel] = { sha256: sha256File(p), owner: ownerFor(rel) };
}
writeLockfile(target, {
  kitVersion: KIT_VERSION,
  answers: { name, template: values.template, testCommand: 'npm test' },
  files,
});
log(`wrote .city-app.json (${Object.keys(files).length} files, kit ${KIT_VERSION})`);
say('wrote .city-app.json');

// Step 5: verify the install.
const check = spawnSync(process.execPath, [INSTALL, name, '--check'], { cwd: WORKDIR, encoding: 'utf8' });
log(`install.mjs --check (exit ${check.status}):`, check.stdout, check.stderr);
writeLog();
if (check.status !== 0) {
  say('install check failed; see the log for details');
  finish(false, 'install check failed', `node scripts/install.mjs ${name} --check`);
}
say('install check passed');
say(`log: ${name}/.city/logs/new.log`);
finish(true, `${name} created (${values.template}), kit ${KIT_VERSION} installed`);
