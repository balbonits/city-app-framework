// Runs `claude plugin eval` case folders through the experiments harness instead of the
// official runner. Use it where the official runner's sandbox can't start (some containers):
// the agent is confined by permission rules instead. Same case files, same grader rules.
//
//   node evals/run-local.mjs [--dir evals] [--cases a,b] [--runs 2] [--no-baseline] [--no-plugin]
//
// Supports regex, file_exists and tool_used graders; llm graders are skipped.
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { runClaude, toolCalls } from '../experiments/lib/claude.mjs';
import { caseDirs, grade, listFiles, loadCase } from './lib/grading.mjs';

const { values: opt } = parseArgs({
  options: {
    dir: { type: 'string', default: 'evals' },
    cases: { type: 'string' },
    runs: { type: 'string', default: '2' },
    'no-baseline': { type: 'boolean', default: false },
    'no-plugin': { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
  },
});

const repo = resolve(new URL('..', import.meta.url).pathname);
const suite = resolve(repo, opt.dir);
const wanted = opt.cases?.split(',');
const cases = caseDirs(suite).map((d) => loadCase(d, suite)).filter((c) => !wanted || wanted.includes(c.name));
const arms = opt['no-baseline'] ? ['with'] : ['with', 'without'];

async function runOnce(c, arm, n) {
  const workspace = mkdtempSync(join(tmpdir(), `local-eval-${c.name.replace(/\W/g, '-')}-`));
  if (c.scaffold) {
    const s = spawnSync('bash', [join(c.dir, c.scaffold)], { cwd: workspace, encoding: 'utf8', env: { ...process.env, EVAL_REPO: repo } });
    if (s.status !== 0) throw new Error(`scaffold failed: ${s.stderr}`);
  }
  const before = new Set(listFiles(workspace));
  const extraArgs = arm === 'with' && !opt['no-plugin'] ? ['--plugin-dir', repo] : [];
  const r = await runClaude({ cwd: workspace, prompt: c.prompt, extraArgs, transcriptPath: `${workspace}.jsonl` });
  const run = {
    workspace,
    created: listFiles(workspace).filter((f) => !before.has(f)),
    reply: r.result?.result ?? '',
    trace: r.events.map((e) => JSON.stringify(e)).join('\n'),
    calls: toolCalls(r.events),
  };
  const results = c.graders.map((g) => ({ grader: g.name, ...grade(g, run) }));
  const scored = results.filter((x) => x.pass !== null);
  const score = scored.length ? scored.filter((x) => x.pass).length / scored.length : 0;
  const misses = results.filter((x) => x.pass === false).map((x) => `✗ ${x.grader} (${x.why})`).join('  ');
  console.log(`${c.name} [${arm}] run ${n}: ${score.toFixed(2)}  ${misses}`);
  return { case: c.name, arm, run: n, score, results, workspace };
}

const jobs = cases.flatMap((c) => arms.flatMap((arm) => Array.from({ length: Number(opt.runs) }, (_, i) => [c, arm, i + 1])));
console.log(`${cases.length} case(s) x ${arms.length} arm(s) x ${opt.runs} run(s) = ${jobs.length} test sessions`);

const out = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: Number(opt.concurrency) }, async () => {
  while (queue.length) {
    const [c, arm, n] = queue.shift();
    try { out.push(await runOnce(c, arm, n)); } catch (err) { console.error(`fail ${c.name} [${arm}] ${n}: ${err.message}`); }
  }
}));

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
console.log(`\n${'CASE'.padEnd(28)} WITH   ${arms.length > 1 ? 'WITHOUT' : ''}`);
for (const c of cases) {
  const s = (arm) => mean(out.filter((x) => x.case === c.name && x.arm === arm).map((x) => x.score)).toFixed(2);
  console.log(`${c.name.padEnd(28)} ${s('with').padEnd(6)} ${arms.length > 1 ? s('without') : ''}`);
}
mkdirSync(join(suite, 'results'), { recursive: true });
const file = join(suite, 'results', `local-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`\n${out.length} session(s) run. Details: ${relative(repo, file)}`);
