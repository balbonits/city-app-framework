// Experiment 4: does a fresh-context reviewer catch what a solo agent misses?
// Paired design: implement once, score ("solo"), then review -> fix -> score again ("reviewed").
//
//   node e4-review.mjs --trials 6 --out results/e4-review --work /tmp/x
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { runClaude } from './lib/claude.mjs';
import { score, killStray } from './lib/score.mjs';
import { TASKS } from './tasks.mjs';

const { values: opt } = parseArgs({
  options: {
    trials: { type: 'string', default: '6' },
    task: { type: 'string', default: 'stats' },
    concurrency: { type: 'string', default: '3' },
    model: { type: 'string', default: 'claude-sonnet-5' },
    out: { type: 'string' },
    work: { type: 'string' },
  },
});

const here = new URL('.', import.meta.url).pathname;
const outDir = opt.out ?? join(here, 'results', 'e4-review');
const workDir = opt.work ?? join(here, '.work');
mkdirSync(join(outDir, 'raw'), { recursive: true });
const TASK = TASKS[opt.task];

const REVIEW_PROMPT = `Review the change in this repo. Run \`git diff --cached base\` to see it (everything is staged).

The change was supposed to do exactly this:

${TASK}

Check every requirement against the code, and verify by running the CLI with HABITS_FILE pointing at a temp file you seed with your own data. Report only real defects, each with a concrete failing example (input, expected, actual). If everything is correct, reply with exactly: NO DEFECTS
Do not edit any files.`;

const fixPrompt = (findings) => `A code reviewer checked the uncommitted change in this repo against this task:

${TASK}

Their findings:

${findings}

Verify each finding yourself. Fix the real ones and ignore any that are wrong. Run \`npm test\` before finishing.`;

async function trial(n) {
  const id = `${opt.task}-${n}`;
  const outFile = join(outDir, 'raw', `${id}.json`);
  if (existsSync(outFile)) return console.log(`skip ${id}`);
  const dir = join(workDir, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(here, 'fixture/habit-cli'), dir, { recursive: true });
  cpSync(join(here, 'arms/lean'), dir, { recursive: true });
  execSync('git init -q && git add -A && git -c user.email=lab@local -c user.name=lab commit -qm base && git tag base', { cwd: dir });

  const impl = await runClaude({ cwd: dir, prompt: TASK, model: opt.model, transcriptPath: join(workDir, `${id}-impl.jsonl`) });
  killStray(dir);
  const solo = await score(dir, opt.task, impl);

  const review = await runClaude({
    cwd: dir, prompt: REVIEW_PROMPT, model: opt.model, budgetUsd: 1,
    disallowed: ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'],
    transcriptPath: join(workDir, `${id}-review.jsonl`),
  });
  killStray(dir);
  const findings = (review.result?.result ?? '').trim();
  const clean = /^NO DEFECTS\.?$/i.test(findings) || /\bNO DEFECTS\b/.test(findings.split('\n').at(-1) ?? '');

  let fix = null;
  if (!clean) {
    fix = await runClaude({ cwd: dir, prompt: fixPrompt(findings), model: opt.model, transcriptPath: join(workDir, `${id}-fix.jsonl`) });
    killStray(dir);
  }
  const reviewed = clean ? solo : await score(dir, opt.task, fix);

  const cost = (r) => r?.result?.total_cost_usd ?? 0;
  writeFileSync(outFile, JSON.stringify({
    id, n, task: opt.task, model: opt.model,
    solo: { ...solo.acceptance, testsPass: solo.testsPass, costUsd: cost(impl) },
    review: { clean, findings, costUsd: cost(review) },
    reviewed: { ...reviewed.acceptance, testsPass: reviewed.testsPass, fixCostUsd: cost(fix) },
  }, null, 2));
  console.log(`done ${id}: solo=${solo.acceptance.pass} review=${clean ? 'clean' : 'defects'} reviewed=${reviewed.acceptance.pass} $${(cost(impl) + cost(review) + cost(fix)).toFixed(3)}`);
}

const queue = Array.from({ length: Number(opt.trials) }, (_, i) => i + 1);
await Promise.all(Array.from({ length: Number(opt.concurrency) }, async () => {
  while (queue.length) {
    const n = queue.shift();
    try { await trial(n); } catch (err) { console.error(`fail ${opt.task}-${n}: ${err.message}`); }
  }
}));
