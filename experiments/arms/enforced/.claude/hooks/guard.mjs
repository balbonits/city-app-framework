#!/usr/bin/env node
// PreToolUse guard: blocks new dependencies unless a human approves them.
// Reads the hook payload from stdin, prints a deny decision or nothing.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const payload = JSON.parse(readFileSync(0, 'utf8'));
const { tool_name: tool, tool_input: input = {} } = payload;
const root = process.env.CLAUDE_PROJECT_DIR ?? payload.cwd ?? process.cwd();

const deny = (reason) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
};

const REASON =
  'Blocked: adding a dependency needs the human\'s approval. ' +
  'Use Node built-ins instead, or finish without it and ask, naming the package and why.';

const installsPackage = (command) =>
  command.split(/&&|\|\||;|\|/).some((part) => {
    const tokens = part.trim().split(/\s+/);
    const at = tokens.findIndex((t) => ['npm', 'pnpm', 'yarn', 'bun'].includes(t));
    if (at === -1 || !['i', 'install', 'add'].includes(tokens[at + 1])) return false;
    return tokens.slice(at + 2).some((t) => !t.startsWith('-'));
  });

if (tool === 'Bash' && installsPackage(input.command ?? '')) deny(REASON);

const depNames = (text) => {
  try {
    const pkg = JSON.parse(text);
    return new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
    ]);
  } catch {
    return null;
  }
};

const isPackageJson = (path = '') => path.endsWith('package.json') && !path.includes('node_modules');

if (['Edit', 'Write', 'MultiEdit'].includes(tool) && isPackageJson(input.file_path)) {
  const path = input.file_path.startsWith('/') ? input.file_path : join(root, input.file_path);
  const before = existsSync(path) ? readFileSync(path, 'utf8') : '{}';
  let after = before;
  if (tool === 'Write') after = input.content ?? '';
  if (tool === 'Edit') {
    after = input.replace_all
      ? before.split(input.old_string).join(input.new_string)
      : before.replace(input.old_string, input.new_string);
  }
  if (tool === 'MultiEdit') {
    for (const e of input.edits ?? []) after = after.replace(e.old_string, e.new_string);
  }
  const was = depNames(before) ?? new Set();
  const now = depNames(after);
  if (now && [...now].some((name) => !was.has(name))) deny(REASON);
}
