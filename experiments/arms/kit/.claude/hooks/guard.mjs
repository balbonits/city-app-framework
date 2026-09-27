#!/usr/bin/env node
// PreToolUse guard. Blocks the few actions that need a human, whatever the prompt says:
//   - adding a dependency (unless listed in .claude/approved-deps.txt, which only a human edits)
//   - force-pushing
//   - deploying to production or publishing a package
//   - deleting test files
// Prints a deny decision on stdout, or nothing to let the call through.
import { readFileSync, existsSync } from 'node:fs';
import { join, isAbsolute, basename } from 'node:path';

const payload = JSON.parse(readFileSync(0, 'utf8'));
const { tool_name: tool, tool_input: input = {} } = payload;
const root = process.env.CLAUDE_PROJECT_DIR ?? payload.cwd ?? process.cwd();
const APPROVALS = '.claude/approved-deps.txt';

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
  }));
  process.exit(0);
}

const approved = () => {
  const file = join(root, APPROVALS);
  if (!existsSync(file)) return new Set();
  return new Set(readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')));
};

const depReason = (names) =>
  `Blocked: adding ${names.join(', ')} needs the human's OK. Use what is already installed or built in. ` +
  `If you really need it, finish without it and ask, saying which package and why. ` +
  `(The human approves by adding the name to ${APPROVALS}.)`;

const packageName = (spec) => spec.replace(/^(@[^/@]+\/[^@]+|[^@]+).*$/, '$1');

// Shell commands, split on && || ; | so chained commands are checked too.
const segments = (command) => command.split(/&&|\|\||;|\|/).map((part) => part.trim().split(/\s+/));

// Only the program a segment starts with counts (after env assignments and sudo), so text
// inside a commit message ("run npm install zod") never triggers a rule.
const program = (tokens) => {
  const rest = [...tokens];
  while (rest.length && (/^\w+=/.test(rest[0]) || rest[0] === 'sudo')) rest.shift();
  if (rest[0] === 'npx') rest.shift();
  return rest;
};

const WRITERS = new Set(['tee', 'cp', 'mv', 'rm', 'truncate', 'ln', 'dd', 'node', 'python', 'python3', 'perl', 'ruby']);

function checkBash(command) {
  if (/>>?\s*['"]?[^\s'"]*approved-deps\.txt/.test(command)) {
    deny(`Blocked: ${APPROVALS} is the human's approval list. Ask them instead.`);
  }
  for (const segment of segments(command)) {
    const tokens = program(segment);
    const [cmd, sub] = tokens;
    const text = tokens.join(' ');
    if (/approved-deps\.txt/.test(text) && (WRITERS.has(cmd) || (cmd === 'sed' && tokens.some((t) => /^(-i|--in-place)/.test(t))))) {
      deny(`Blocked: ${APPROVALS} is the human's approval list. Ask them instead.`);
    }
    if (['npm', 'pnpm', 'yarn', 'bun'].includes(cmd) && ['i', 'install', 'add'].includes(sub)) {
      const names = tokens.slice(2).filter((t) => !t.startsWith('-'))
        .map((t) => packageName(t.replace(/^['"]|['"]$/g, '')));
      const missing = names.filter((n) => !approved().has(n));
      if (missing.length) deny(depReason(missing));
    }
    if (cmd === 'git' && tokens.includes('push') && tokens.some((t) => t === '--force' || t === '-f' || /^\+/.test(t))) {
      deny('Blocked: force-pushing rewrites shared history. Ask the human first.');
    }
    if ((cmd === 'vercel' && tokens.includes('--prod')) || (cmd === 'netlify' && tokens.includes('--prod'))
      || (['npm', 'pnpm'].includes(cmd) && sub === 'publish') || (cmd === 'yarn' && tokens.includes('publish'))
      || (cmd === 'firebase' && sub === 'deploy')) {
      deny('Blocked: production deploys and package publishes are the human\'s call. Say it is ready and stop.');
    }
    if ((tokens[0] === 'rm' || (tokens[0] === 'git' && tokens[1] === 'rm'))
      && tokens.some((t) => /(\.|_)(test|spec)\.[cm]?[jt]sx?$|(^|\/)(__tests__|tests?)(\/|$)/.test(t))) {
      deny('Blocked: deleting tests needs the human\'s OK. If a test is wrong, explain why instead of removing it.');
    }
  }
}

function deps(text) {
  try {
    const pkg = JSON.parse(text);
    return new Set(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
      .flatMap((key) => Object.keys(pkg[key] ?? {})));
  } catch {
    return null;
  }
}

function checkFileEdit() {
  const path = input.file_path ?? '';
  if (path.endsWith(APPROVALS)) deny(`Blocked: ${APPROVALS} is the human's approval list. Ask them instead.`);
  if (basename(path) !== 'package.json' || path.includes('node_modules')) return;
  const abs = isAbsolute(path) ? path : join(root, path);
  const before = existsSync(abs) ? readFileSync(abs, 'utf8') : '{}';
  let after = before;
  if (tool === 'Write') after = input.content ?? '';
  if (tool === 'Edit') {
    after = input.replace_all
      ? before.split(input.old_string).join(input.new_string)
      : before.replace(input.old_string, input.new_string);
  }
  if (tool === 'MultiEdit') for (const e of input.edits ?? []) after = after.replace(e.old_string, e.new_string);
  const was = deps(before) ?? new Set();
  const now = deps(after);
  const added = now ? [...now].filter((n) => !was.has(n) && !approved().has(n)) : [];
  if (added.length) deny(depReason(added));
}

if (tool === 'Bash') checkBash(input.command ?? '');
if (['Edit', 'Write', 'MultiEdit'].includes(tool)) checkFileEdit();
