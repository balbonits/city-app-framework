// Runs headless Claude Code in an isolated directory and returns the parsed result.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';

// Variables that would tie a nested run to the parent session or leak extra context.
const STRIP = [
  'CLAUDE_CODE_SESSION_ID', 'CLAUDE_CODE_REMOTE_SESSION_ID', 'SESSION_INGRESS_URL',
  'CLAUDE_CODE_SYNC_SESSION_REFS', 'CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2',
  'CLAUDE_CODE_MESSAGING_SOCKET', 'CLAUDE_CODE_MESSAGING_TOKEN',
  'CLAUDE_ADDITIONAL_DIRECTORIES', 'CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD',
  'CLAUDE_CODE_CHILD_SESSION', 'CLAUDE_CODE_REMOTE_SEND_KEEPALIVES',
  'CLAUDE_CODE_DIAGNOSTICS_FILE', 'CLAUDE_CODE_TEE_SDK_STDOUT', 'CLAUDE_CODE_SYNC_SKILLS',
  'CLAUDE_CODE_DEBUG', 'CLAUDE_AUTO_BACKGROUND_TASKS', 'CLAUDE_CODE_BG_TASKS_REPORT_RUNNING',
  'CLAUDE_CODE_SESSION_ATTENDED', 'CLAUDE_CODE_HOLD_UNANSWERED_PARKED_PERMISSION',
  'CLAUDE_PID', 'CLAUDECODE', 'AI_AGENT', 'CLAUDE_CODE_ENTRYPOINT', 'CLAUDE_AFTER_LAST_COMPACT',
  'CLAUDE_EFFORT', 'MAX_THINKING_TOKENS', 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE',
  'CLAUDE_CODE_ARTIFACT_MULTI_FILE', 'CLAUDE_CODE_ARTIFACT_TYPE_CATALOG', 'CLAUDE_CODE_ARTIFACT_ASSETS',
  'CLAUDE_CODE_ARTIFACT_TYPE_CLOUD_CREATE', 'CLAUDE_CODE_ARTIFACT_DB', 'CLAUDE_CODE_ARTIFACT_TYPES',
  'CLAUDE_CODE_WORKER_EPOCH', 'CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH', 'CLAUDE_CODE_USER_EMAIL',
];

export function isolatedEnv(extra = {}) {
  const env = { ...process.env };
  for (const key of STRIP) delete env[key];
  // Packages may be installed (that's part of what we measure) but never run install scripts.
  return { ...env, npm_config_ignore_scripts: 'true', ...extra };
}

// Test agents get file edits inside their own directory plus this command allowlist.
// Anything else is denied automatically (--permission-prompts none); nothing bypasses checks.
const ALLOWED_TOOLS = [
  'Read', 'Edit', 'Write', 'Glob', 'Grep', 'WebFetch', 'TodoWrite', 'Agent', 'Task', 'Skill',
  'Bash(npm test)', 'Bash(npm test:*)', 'Bash(npm run:*)', 'Bash(npm install:*)', 'Bash(npm i:*)',
  'Bash(npm view:*)', 'Bash(npm ls:*)', 'Bash(node:*)', 'Bash(HABITS_FILE=:*)',
  'Bash(ls:*)', 'Bash(cat:*)', 'Bash(head:*)', 'Bash(tail:*)', 'Bash(wc:*)', 'Bash(grep:*)',
  'Bash(find:*)', 'Bash(pwd)', 'Bash(echo:*)', 'Bash(printf:*)', 'Bash(diff:*)', 'Bash(mkdir:*)',
  'Bash(cd:*)', 'Bash(git status:*)', 'Bash(git diff:*)', 'Bash(git log:*)', 'Bash(git show:*)',
  'Bash(export:*)', 'Bash(mktemp:*)', 'Bash(env:*)', 'Bash(sed:*)', 'Bash(script:*)', 'Bash(sort:*)',
  'Bash(jq:*)', 'Bash(tr:*)', 'Bash(cut:*)', 'Bash(od:*)', 'Bash(xxd:*)', 'Bash(which:*)', 'Bash(test:*)',
  'Bash(true)', 'Bash(sleep:*)', 'Bash(curl -s:*)', 'Bash(curl http://localhost:*)', 'Bash(curl http://127.0.0.1:*)',
  'Bash(kill:*)', 'Bash(FORCE_COLOR=:*)', 'Bash(NO_COLOR=:*)', 'Bash(TERM=:*)', 'Bash(PORT=:*)',
  'Bash(rm -f /tmp/:*)', 'Bash(rm -rf /tmp/:*)', 'Bash(npx vitest:*)', 'Bash(npx tsc:*)', 'Bash(npx vite build:*)',
];

export function runClaude({
  cwd,
  prompt,
  model = 'claude-sonnet-5',
  budgetUsd = 2,
  transcriptPath,
  timeoutMs = 15 * 60 * 1000,
  disallowed = [],
  extraArgs = [],
}) {
  const args = [
    '-p', prompt,
    '--model', model,
    '--session-id', randomUUID(),
    '--no-session-persistence',
    '--setting-sources', 'project',
    '--strict-mcp-config',
    '--permission-mode', 'acceptEdits',
    '--permission-prompts', 'none',
    '--allowedTools', ALLOWED_TOOLS.join(','),
    '--disallowedTools', ['WebSearch', ...disallowed].join(','),
    '--max-budget-usd', String(budgetUsd),
    '--output-format', 'stream-json',
    '--verbose',
    '--include-hook-events',
    ...extraArgs,
  ];

  return new Promise((resolve) => {
    const child = spawn('claude', args, { cwd, env: isolatedEnv(), stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      if (transcriptPath) writeFileSync(transcriptPath, out);
      const events = out.split('\n').filter(Boolean).flatMap((line) => {
        try { return [JSON.parse(line)]; } catch { return []; }
      });
      const result = events.findLast((e) => e.type === 'result') ?? null;
      resolve({ code, events, result, stderr: err.slice(-4000) });
    });
  });
}

// Tool calls the agent made, in order: [{ name, input }]
export function toolCalls(events) {
  return events
    .filter((e) => e.type === 'assistant')
    .flatMap((e) => e.message?.content ?? [])
    .filter((c) => c.type === 'tool_use')
    .map((c) => ({ name: c.name, input: c.input }));
}

export function hookEvents(events) {
  return events.filter((e) => e.type === 'system' && /hook/i.test(e.subtype ?? ''));
}
