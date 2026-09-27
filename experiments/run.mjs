// Runs every task x arm x trial in an isolated copy of the fixture, then scores it.
//
//   node run.mjs --tasks json,color --arms bare,lean --trials 3 --out results/2026-09-27 --work /tmp/x
//
// Transcripts go to --work (large, not committed). Scores go to --out/raw/*.json.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { runClaude } from './lib/claude.mjs';
import { score, killStray } from './lib/score.mjs';
import { TASKS } from './tasks.mjs';

const { values: opt } = parseArgs({
  options: {
    tasks: { type: 'string', default: 'json,color,remind,serve,dates' },
    arms: { type: 'string', default: 'bare,shipped,full,lean,enforced' },
    trials: { type: 'string', default: '3' },
    start: { type: 'string', default: '1' },
    concurrency: { type: 'string', default: '5' },
    model: { type: 'string', default: 'claude-sonnet-5' },
    'arms-dir': { type: 'string', default: 'arms' },
    fixture: { type: 'string', default: 'fixture/habit-cli' },
    out: { type: 'string' },
    work: { type: 'string' },
  },
});

const here = new URL('.', import.meta.url).pathname;
const outDir = opt.out ?? join(here, 'results', new Date().toISOString().slice(0, 10));
const workDir = opt.work ?? join(here, '.work');
mkdirSync(join(outDir, 'raw'), { recursive: true });

const jobs = [];
for (const task of opt.tasks.split(',')) {
  for (const arm of opt.arms.split(',')) {
    for (let n = Number(opt.start); n < Number(opt.start) + Number(opt.trials); n++) jobs.push({ task, arm, n });
  }
}

async function runJob({ task, arm, n }) {
  const id = `${task}-${arm}-${n}`;
  const outFile = join(outDir, 'raw', `${id}.json`);
  if (existsSync(outFile)) return console.log(`skip ${id} (done)`);

  const dir = join(workDir, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(here, opt.fixture), dir, { recursive: true });
  cpSync(join(here, opt['arms-dir'], arm), dir, { recursive: true, filter: (src) => !src.endsWith('.keep') });
  execSync('git init -q && git add -A && git -c user.email=lab@local -c user.name=lab commit -qm base && git tag base', { cwd: dir });

  const started = Date.now();
  const result = await runClaude({
    cwd: dir,
    prompt: TASKS[task],
    model: opt.model,
    transcriptPath: join(workDir, `${id}.jsonl`),
  });
  killStray(dir);
  const scored = await score(dir, task, result);
  writeFileSync(outFile, JSON.stringify({ id, task, arm, n, model: opt.model, wallMs: Date.now() - started, reply: result.result?.result ?? null, ...scored }, null, 2));
  console.log(`done ${id}: accept=${scored.acceptance.pass} deps=${scored.depsAdded.join('+') || '-'} src+${scored.srcAdded} files=${scored.filesChanged} $${scored.costUsd?.toFixed(3)}`);
}

const queue = [...jobs];
const workers = Array.from({ length: Number(opt.concurrency) }, async () => {
  while (queue.length) {
    const job = queue.shift();
    try {
      await runJob(job);
    } catch (err) {
      console.error(`fail ${job.task}-${job.arm}-${job.n}: ${err.message}`);
    }
  }
});
await Promise.all(workers);
console.log(`finished ${jobs.length} jobs -> ${outDir}`);
