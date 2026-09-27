#!/usr/bin/env node
// A/B-tests one AGENTS.md rule on this project: the same task, run with and without the rule,
// each run in its own copy of the project, scored by checks (shell commands; exit 0 = pass).
// Used by /city-app:rules:test.
//
//   node scripts/rules-test.mjs --rule "<text>" --task "<prompt>" --check "<command>" [--check ...]
//     [--runs 3] [--file AGENTS.md] [--model claude-sonnet-5] [--concurrency 3] [--dir .] [--work <dir>] [--keep] [--yes]
//
// Without --yes it only prepares one copy per arm and runs the checks on the untouched code.
// That starts no Claude sessions. With --yes it runs 2 x --runs sessions.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { parseArgs } from 'node:util';
import { runClaude } from '../experiments/lib/claude.mjs';
import { killStray } from '../experiments/lib/score.mjs';
import { copyProject, matchingLines, runCheck, verdict, withRule, withoutRule } from './lib/rules.mjs';

const { values: opt } = parseArgs({
  options: {
    rule: { type: 'string' },
    task: { type: 'string' },
    check: { type: 'string', multiple: true },
    runs: { type: 'string', default: '3' },
    file: { type: 'string' },
    model: { type: 'string', default: 'claude-sonnet-5' },
    concurrency: { type: 'string', default: '3' },
    dir: { type: 'string', default: '.' },
    work: { type: 'string' },
    keep: { type: 'boolean', default: false },
    yes: { type: 'boolean', default: false },
  },
});

function fail(message) {
  console.error(message);
  process.exit(2);
}

const project = resolve(opt.dir);
const runs = Number(opt.runs);
const checks = opt.check ?? [];
if (!opt.rule?.trim()) fail('Missing --rule: the rule to test, for example --rule "Parse CLI flags with parseArgs from node:util."');
if (!opt.task?.trim()) fail('Missing --task: what to ask the agent. Pick a small task where the rule matters.');
if (!checks.length) fail('Missing --check: a shell command that exits 0 when the agent got it right.');
if (!Number.isInteger(runs) || runs < 1) fail('--runs must be a whole number, 1 or more.');

const file = opt.file ?? (existsSync(join(project, 'AGENTS.md')) || !existsSync(join(project, 'CLAUDE.md')) ? 'AGENTS.md' : 'CLAUDE.md');
const original = existsSync(join(project, file)) ? readFileSync(join(project, file), 'utf8') : '';
const found = matchingLines(original, opt.rule);
if (found.length > 1) fail(`The rule text matches ${found.length} lines in ${file} (lines ${found.join(', ')}). Use the whole line.`);

const arms = [
  { key: 'with', name: 'with rule', text: withRule(original, opt.rule) },
  { key: 'without', name: 'without rule', text: withoutRule(original, opt.rule) },
];
const prepare = (arm) => (dir) => { if (arm.text !== original) writeFileSync(join(dir, file), arm.text); };

// Runs share the project's node_modules, so they may not install or delete packages.
const SHARED_DEPS_BLOCKED = [
  'Bash(npm install *)', 'Bash(npm i *)', 'Bash(npm ci *)', 'Bash(npm uninstall *)', 'Bash(npm update *)',
  'Bash(pnpm install *)', 'Bash(pnpm i *)', 'Bash(pnpm add *)', 'Bash(pnpm remove *)', 'Bash(yarn)',
  'Bash(yarn install *)', 'Bash(yarn add *)', 'Bash(yarn remove *)', 'Bash(bun install *)', 'Bash(bun add *)',
  'Bash(bun remove *)', 'Bash(rm *node_modules*)',
];
const OTHER_PACKAGE_MANAGERS = ['Bash(pnpm test *)', 'Bash(pnpm run *)', 'Bash(yarn test *)', 'Bash(yarn run *)', 'Bash(bun test *)', 'Bash(bun run *)'];

// Neutral folder names: the path must not tell the agent which arm it's in.
const work = opt.work ? resolve(opt.work) : mkdtempSync(join(tmpdir(), 'ca-'));
mkdirSync(work, { recursive: true });

console.log(`Rule:    ${opt.rule}`);
console.log(found.length
  ? `         Already in ${file} (line ${found[0]}), so the "without rule" copies drop that line.`
  : `         Not in ${file} yet, so the "with rule" copies add it${/^##\s+Gotchas\b/im.test(original) ? ' under Gotchas' : ''}.`);
console.log(`Task:    ${opt.task}`);
checks.forEach((c, i) => console.log(`${i ? '         ' : 'Checks:  '}${i + 1}. ${c}`));
console.log(`Model:   ${opt.model}`);
if (existsSync(join(project, 'node_modules'))) console.log('Note:    the copies share your node_modules, so test runs can\'t install or delete packages.');
const claudeMd = join(project, 'CLAUDE.md');
if (file === 'AGENTS.md' && existsSync(claudeMd) && !/^@AGENTS\.md\s*$/m.test(readFileSync(claudeMd, 'utf8'))) {
  console.log("Warning: CLAUDE.md doesn't import AGENTS.md (no @AGENTS.md line), so Claude won't read the rule in either arm. Run /city-app:setup first.");
}

if (!opt.yes) {
  const before = arms.map((arm) => {
    const dir = join(work, `dry-${arm.key}`);
    copyProject(project, dir, prepare(arm));
    const results = checks.map((c) => runCheck(dir, c));
    if (!opt.keep) rmSync(dir, { recursive: true, force: true });
    return results;
  });
  console.log('\nChecks on the code as it is now (before any agent runs):');
  checks.forEach((c, i) => {
    const [on, off] = [before[0][i], before[1][i]];
    let note = '';
    if (on !== off) note = ' <- it reads the rule file itself, so it measures the rule, not the agent. Point it at the code.';
    else if (on) note = " <- already passes. Fine for a \"don't do X\" rule; for a \"do Y\" rule it can't tell the two apart.";
    console.log(`  ${i + 1}. ${on === off ? (on ? 'passes' : 'fails') : `${on ? 'passes' : 'fails'} with the rule, ${off ? 'passes' : 'fails'} without`}${note}`);
  });
  console.log(`\nReady: ${2 * runs} test sessions (${runs} with the rule, ${runs} without). Nothing has run yet; add --yes to start.`);
  if (!opt.work && !opt.keep) rmSync(work, { recursive: true, force: true });
  process.exit(0);
}

async function runJob({ arm, n, slot }) {
  const dir = join(work, String(slot), basename(project));
  try {
    const { linked } = copyProject(project, dir, prepare(arm));
    const r = await runClaude({
      cwd: dir,
      prompt: opt.task,
      model: opt.model,
      transcriptPath: join(work, `${slot}.jsonl`),
      allowed: OTHER_PACKAGE_MANAGERS,
      disallowed: linked ? SHARED_DEPS_BLOCKED : [],
    });
    try { killStray(dir); } catch { /* no /proc on this OS */ }
    const finished = r.result !== null;
    const failed = finished ? checks.filter((c) => !runCheck(dir, c)) : [];
    const pass = finished && !failed.length;
    console.log(`${arm.name}, run ${n}: ${!finished ? "didn't finish (not counted)" : pass ? 'pass' : `fail (${failed.join('; ')})`}`);
    return { arm: arm.key, run: n, finished, pass, failed, reply: r.result?.result ?? null };
  } catch (err) {
    console.log(`${arm.name}, run ${n}: couldn't run (${err.message.split('\n')[0]}), not counted`);
    return { arm: arm.key, run: n, finished: false, pass: false, failed: [], reply: null };
  } finally {
    if (!opt.keep) rmSync(join(work, String(slot)), { recursive: true, force: true });
  }
}

// Alternate the arms so a run stopped halfway still compares like with like.
const queue = Array.from({ length: runs }, (_, i) => arms.map((arm) => ({ arm, n: i + 1 }))).flat()
  .map((job, i) => ({ ...job, slot: i + 1 }));
console.log(`\nRunning ${queue.length} test sessions...`);
const results = [];
await Promise.all(Array.from({ length: Number(opt.concurrency) }, async () => {
  while (queue.length) results.push(await runJob(queue.shift()));
}));

const tally = (key) => {
  const done = results.filter((r) => r.arm === key && r.finished);
  return { passed: done.filter((r) => r.pass).length, runs: done.length };
};
console.log(`\n${'Arm'.padEnd(14)} Passed`);
for (const arm of arms) console.log(`${arm.name.padEnd(14)} ${tally(arm.key).passed}/${tally(arm.key).runs}`);
console.log(`\n${verdict(tally('with'), tally('without'))}`);
writeFileSync(join(work, 'results.json'), JSON.stringify({ rule: opt.rule, task: opt.task, checks, model: opt.model, file, results }, null, 2));
console.log(`${results.length} test session(s) run. Details: ${join(work, 'results.json')}`);
