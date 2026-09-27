#!/usr/bin/env node
// Re-tests the AGENTS.md rules that /city-app:rules:test saved (docs/rule-tests.json), for example
// after a model update, and says which ones the agent no longer needs. Used by /city-app:rules:prune.
//
//   node scripts/rules-prune.mjs [--dir .] [--runs 3] [--model claude-sonnet-5] [--full] [--yes]
//   node scripts/rules-prune.mjs --cut "<rule>"     remove a rule the human approved cutting
//
// By default it re-runs each rule's task only WITHOUT the rule, which takes half the usage of a
// full A/B: if the agent now gets it right anyway, the rule is a candidate to cut. --full runs both.
// Without --yes it only shows the plan and starts no Claude sessions.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { gotchaItems, loadRegistry, matchingLines, pruneVerdict, saveRegistry, withoutRule } from './lib/rules.mjs';

const { values: opt } = parseArgs({
  options: {
    dir: { type: 'string', default: '.' },
    runs: { type: 'string', default: '3' },
    model: { type: 'string', default: 'claude-sonnet-5' },
    registry: { type: 'string', default: 'docs/rule-tests.json' },
    concurrency: { type: 'string', default: '3' },
    full: { type: 'boolean', default: false },
    yes: { type: 'boolean', default: false },
    cut: { type: 'string' },
  },
});

function fail(message) {
  console.error(message);
  process.exit(2);
}

const project = resolve(opt.dir);
const registryPath = join(project, opt.registry);
const read = (file) => (existsSync(join(project, file)) ? readFileSync(join(project, file), 'utf8') : '');
const today = () => new Date().toISOString().slice(0, 10);
const score = (x) => (x ? `${x.passed}/${x.runs}` : '-');
const latest = (entry, arm) => [...entry.history].reverse().find((h) => h[arm])?.[arm] ?? null;

if (opt.cut) {
  const registry = loadRegistry(registryPath);
  const hits = registry.rules.filter((r) => !r.cut && matchingLines(r.rule, opt.cut).length);
  if (hits.length !== 1) {
    fail(hits.length
      ? `"${opt.cut}" matches ${hits.length} saved rules. Use more of the rule's text.`
      : `No saved rule matches "${opt.cut}". Run the script without --cut to list them.`);
  }
  const [entry] = hits;
  const text = read(entry.file);
  const lines = matchingLines(text, entry.rule);
  if (lines.length !== 1) fail(`The rule is on ${lines.length} lines of ${entry.file}, so nothing was changed. Remove it by hand.`);
  writeFileSync(join(project, entry.file), withoutRule(text, entry.rule));
  const last = entry.history.at(-1);
  entry.cut = { date: today(), why: last ? `without the rule ${score(last.without)} on ${last.model}` : 'approved by the human' };
  saveRegistry(registryPath, registry);
  console.log(`Removed from ${entry.file} (line ${lines[0]}): ${entry.rule}`);
  console.log(`Marked as cut in ${opt.registry}.`);
  process.exit(0);
}

const runs = Number(opt.runs);
if (!Number.isInteger(runs) || runs < 1) fail('--runs must be a whole number, 1 or more.');
const registry = loadRegistry(registryPath);
const active = registry.rules.filter((r) => !r.cut);
const present = active.filter((r) => matchingLines(read(r.file), r.rule).length === 1);
const gone = active.filter((r) => !present.includes(r));
const untested = gotchaItems(read('AGENTS.md'))
  .filter((line) => !registry.rules.some((r) => matchingLines(line, r.rule).length));

console.log(`Saved rule tests (${opt.registry}):`);
if (!present.length) console.log('  none yet');
present.forEach((r, i) => {
  const last = r.history.at(-1);
  console.log(`  ${i + 1}. ${r.rule}`);
  console.log(last
    ? `     last: with ${score(latest(r, 'with'))}, without ${score(latest(r, 'without'))} (${last.model}, ${last.date})`
    : '     not measured yet');
});
if (untested.length) {
  console.log('\nIn AGENTS.md Gotchas but never tested (use /city-app:rules:test to add them):');
  for (const line of untested) console.log(`  - ${line}`);
}
if (gone.length) console.log(`\nSaved but no longer in their file (skipped): ${gone.map((r) => `"${r.rule}"`).join(', ')}`);

const perRule = (opt.full ? 2 : 1) * runs;
const total = present.length * perRule;
console.log(`\nPlan: re-run each saved rule's task ${runs} time(s) ${opt.full ? 'with and without the rule' : 'without the rule'} on ${opt.model}.`);
if (!present.length) {
  console.log('Nothing to re-test yet.');
  process.exit(0);
}
if (!opt.yes) {
  console.log(`Ready: ${total} test sessions. Nothing has run yet; add --yes to start.`);
  process.exit(0);
}

const RULES_TEST = fileURLToPath(new URL('./rules-test.mjs', import.meta.url));
const retest = (r) => new Promise((done) => {
  const args = [RULES_TEST, '--dir', project, '--rule', r.rule, '--task', r.task, ...r.checks.flatMap((c) => ['--check', c]),
    '--runs', String(runs), '--arms', opt.full ? 'with,without' : 'without', '--file', r.file, '--model', opt.model,
    '--registry', opt.registry, '--concurrency', opt.concurrency, '--yes'];
  spawn('node', args, { stdio: 'inherit' }).on('close', done);
});

const rows = [];
for (const r of present) {
  const before = { with: latest(r, 'with'), without: latest(r, 'without') };
  console.log(`\n=== ${r.rule}`);
  await retest(r);
  const now = loadRegistry(registryPath).rules.find((x) => x.file === r.file && x.rule === r.rule)?.history.at(-1);
  const withNow = now?.with ?? before.with;
  rows.push({ rule: r.rule, before, now, says: pruneVerdict(now?.without, withNow) });
}

console.log('\nRule | before (with / without) | now without | suggestion');
for (const x of rows) console.log(`- ${x.rule} | ${score(x.before.with)} / ${score(x.before.without)} | ${score(x.now?.without)} | ${x.says}`);
console.log(`\n${total} test session(s) run on ${opt.model}. To cut a rule: node rules-prune.mjs --cut "<rule>"`);
