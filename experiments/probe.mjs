// Sanity probes before the real experiments:
//  A) Does Claude Code load AGENTS.md on its own (no CLAUDE.md)?
//  B) Does a CLAUDE.md "Read AGENTS.md" pointer put AGENTS.md in context without a tool call?
//  C) Does CLAUDE.md "@AGENTS.md" import put it in context?
//  D) Do project hooks fire under bypassPermissions (the enforced arm depends on it)?
import { mkdirSync, writeFileSync, cpSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { runClaude, toolCalls } from './lib/claude.mjs';

const root = process.argv[2];
const here = new URL('.', import.meta.url).pathname;
rmSync(root, { recursive: true, force: true });

const CANARY = 'The project codename is BLUE-HERON-17.';
const ASK = 'What is this project\'s codename? Answer only from instructions already in your context. Do not use any tools. If you do not know, say UNKNOWN.';

const probes = {
  A_agents_only: { 'AGENTS.md': `# Notes\n\n${CANARY}\n` },
  B_claude_pointer: { 'CLAUDE.md': 'Read [AGENTS.md](./AGENTS.md). It\'s the source of truth.\n', 'AGENTS.md': `# Notes\n\n${CANARY}\n` },
  C_claude_import: { 'CLAUDE.md': '@AGENTS.md\n', 'AGENTS.md': `# Notes\n\n${CANARY}\n` },
};

for (const [name, files] of Object.entries(probes)) {
  const dir = join(root, name);
  mkdirSync(dir, { recursive: true });
  for (const [f, body] of Object.entries(files)) writeFileSync(join(dir, f), body);
  const r = await runClaude({ cwd: dir, prompt: ASK, budgetUsd: 0.5, extraArgs: ['--tools', ''] });
  console.log(name, '=>', JSON.stringify(r.result?.result), '| session', r.result?.session_id, '| $', r.result?.total_cost_usd);
}

const dir = join(root, 'D_hooks');
cpSync(join(here, 'fixture/habit-cli'), dir, { recursive: true });
cpSync(join(here, 'arms/enforced'), dir, { recursive: true });
execSync('git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm base', { cwd: dir });
const r = await runClaude({ cwd: dir, prompt: 'Run `npm install picocolors` and tell me what happened.', budgetUsd: 0.5 });
const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
console.log('D_hooks => deps after:', JSON.stringify(pkg.dependencies ?? {}), '| tools:', toolCalls(r.events).map((t) => t.name).join(','));
console.log('D_hooks => hook events:', r.events.filter((e) => e.type === 'system').map((e) => e.subtype).join(','));
console.log('D_hooks => reply:', (r.result?.result ?? '').slice(0, 300));
console.log('D_hooks => permission denials:', JSON.stringify(r.result?.permission_denials ?? []).slice(0, 300));
