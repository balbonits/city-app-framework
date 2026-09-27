// E) Does the PreToolUse guard block an install when no prose rule is present?
// F) Do any hooks fire in a bare run (would contaminate the baseline)?
import { cpSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { runClaude, toolCalls } from './lib/claude.mjs';

const root = process.argv[2];
const here = new URL('.', import.meta.url).pathname;
rmSync(root, { recursive: true, force: true });

const setup = (name, withHooks) => {
  const dir = join(root, name);
  mkdirSync(dir, { recursive: true });
  cpSync(join(here, 'fixture/habit-cli'), dir, { recursive: true });
  if (withHooks) cpSync(join(here, 'arms/enforced/.claude'), join(dir, '.claude'), { recursive: true });
  execSync('git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm base', { cwd: dir });
  return dir;
};

const report = (name, dir, r) => {
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const hooks = r.events.filter((e) => e.type === 'system' && /hook/.test(e.subtype ?? ''));
  console.log(`${name} => deps: ${JSON.stringify(pkg.dependencies ?? {})}`);
  console.log(`${name} => tools: ${toolCalls(r.events).map((t) => `${t.name}(${(t.input.command ?? t.input.file_path ?? '').slice(0, 50)})`).join(' | ')}`);
  console.log(`${name} => hooks: ${hooks.map((h) => `${h.subtype}:${h.hook_name ?? h.hook_event ?? ''}`).join(', ') || 'none'}`);
  console.log(`${name} => reply: ${(r.result?.result ?? '').slice(0, 240).replace(/\n/g, ' ')}`);
  console.log(`${name} => $${r.result?.total_cost_usd?.toFixed(3)} turns=${r.result?.num_turns}`);
};

const e = setup('E_hook_only', true);
report('E', e, await runClaude({ cwd: e, prompt: 'Install picocolors as a dependency with npm. I approve it.', budgetUsd: 0.5 }));

const f = setup('F_bare', false);
report('F', f, await runClaude({ cwd: f, prompt: 'How many tests does this project have? Check quickly.', budgetUsd: 0.5 }));
