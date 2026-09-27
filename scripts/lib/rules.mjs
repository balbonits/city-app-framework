// Helpers for scripts/rules-test.mjs and rules-prune.mjs: placing a rule, copying a project, running
// checks, saving results, and reading them. No Claude calls here, so tests cover them for free.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, symlinkSync, appendFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const LIST_ITEM = /^\s*([-*]|\d+[.)])\s+/;
// Compare rules on their words: ignore list markers, markdown formatting, spacing and case.
const plain = (s) => s.replace(LIST_ITEM, '').replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const holds = (line, rule) => plain(line).includes(plain(rule));

// 1-based numbers of the lines that hold the rule.
export const matchingLines = (text, rule) => text.split('\n').flatMap((line, i) => (holds(line, rule) ? [i + 1] : []));

export const withoutRule = (text, rule) => text.split('\n').filter((line) => !holds(line, rule)).join('\n');

// Adds the rule as a list item at the end of "## Gotchas", or at the end of the file if there's no such section.
export function withRule(text, rule) {
  if (matchingLines(text, rule).length) return text;
  const item = LIST_ITEM.test(rule) ? rule.trim() : `- ${rule.trim()}`;
  if (!text.trim()) return `${item}\n`;
  const lines = text.trimEnd().split('\n');
  const start = lines.findIndex((l) => /^##\s+Gotchas\b/i.test(l));
  if (start === -1) return `${lines.join('\n')}\n\n${item}\n`;
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end === -1) end = lines.length;
  while (end > start + 1 && !lines[end - 1].trim()) end--;
  lines.splice(end, 0, item);
  return `${lines.join('\n')}\n`;
}

const walk = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  if (e.name === '.git' || e.name === 'node_modules') return [];
  const path = join(dir, e.name);
  return e.isDirectory() ? walk(path, base) : [relative(base, path)];
});

// Tracked plus untracked-but-not-ignored files, so ignored things (.env, dist, node_modules) stay out.
function projectFiles(src) {
  const git = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: src, encoding: 'utf8' });
  return git.status === 0 ? git.stdout.split('\0').filter(Boolean) : walk(src);
}

// Copies a project into dest and commits it, so the agent starts from a clean git tree.
// node_modules is linked, not copied: Claude's file tools won't write through a link that
// points outside the copy, and rules-test blocks package installs in runs that share it.
// prepare(dest) runs before the commit (that's where the rule gets added or removed).
export function copyProject(src, dest, prepare = () => {}) {
  mkdirSync(dest, { recursive: true });
  for (const file of projectFiles(src)) {
    if (!existsSync(join(src, file))) continue; // deleted, but still in the git index
    mkdirSync(dirname(join(dest, file)), { recursive: true });
    cpSync(join(src, file), join(dest, file), { recursive: true, verbatimSymlinks: true });
  }
  const linked = existsSync(join(src, 'node_modules'));
  if (linked) symlinkSync(join(src, 'node_modules'), join(dest, 'node_modules'), 'junction');
  prepare(dest);
  const git = (...args) => execFileSync('git', args, { cwd: dest, stdio: 'ignore' });
  git('init', '-q');
  mkdirSync(join(dest, '.git/info'), { recursive: true });
  appendFileSync(join(dest, '.git/info/exclude'), '\nnode_modules\n');
  git('add', '-A');
  git('-c', 'user.email=rules-test@local', '-c', 'user.name=rules-test', '-c', 'commit.gpgsign=false',
    'commit', '-qm', 'base', '--no-verify', '--allow-empty');
  return { linked };
}

// A check is a shell command run in the copy; exit code 0 means the agent got it right.
export function runCheck(dir, command, timeoutMs = 300_000) {
  const env = { ...process.env, CI: '1' };
  delete env.NODE_TEST_CONTEXT;
  return spawnSync('sh', ['-c', command], { cwd: dir, env, stdio: 'ignore', timeout: timeoutMs }).status === 0;
}

// withIt, withoutIt: { passed, runs }, counting finished runs only.
export function verdict(withIt, withoutIt) {
  if (!withIt.runs || !withoutIt.runs) return 'No finished runs to compare.';
  const a = withIt.passed / withIt.runs;
  const b = withoutIt.passed / withoutIt.runs;
  let says;
  if (a - b >= 0.4) says = 'The rule works: the agent gets it right with the rule and not without. Keep it.';
  else if (b - a >= 0.4) says = 'The agent does worse with the rule. Reword it or cut it.';
  else if (a >= 0.8 && b >= 0.8) says = 'The agent already does this without the rule. You can cut it.';
  else if (a < 0.5) says = "The rule doesn't reliably fix it. Make it a test or a guard rule instead (/city-app:lesson).";
  else says = 'Unclear. Try more runs (--runs 5) or a sharper check.';
  const fewest = Math.min(withIt.runs, withoutIt.runs);
  return fewest < 5 ? `${says} (Only ${fewest} run${fewest === 1 ? '' : 's'} each, so treat it as a hint.)` : says;
}

// The rules saved by rules-test, so rules-prune can re-test them later:
// { rules: [{ rule, file, task, checks, history: [{ date, model, runs, with, without, verdict }], cut }] }
export const loadRegistry = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { rules: [] });

export function saveRegistry(path, registry) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(registry, null, 2)}\n`);
}

// Saves how to test a rule (creating the entry if needed), and adds a run to its history if given.
// The latest task and checks win.
export function saveRun(path, { rule, file, task, checks }, run = null) {
  const registry = loadRegistry(path);
  let entry = registry.rules.find((r) => r.file === file && plain(r.rule) === plain(rule));
  if (!entry) {
    entry = { rule, file, task, checks, history: [], cut: null };
    registry.rules.push(entry);
  }
  Object.assign(entry, { task, checks });
  if (run) entry.history.push(run);
  saveRegistry(path, registry);
  return entry;
}

// The list items under "## Gotchas": the project's own rules (the working agreement is the kit's).
export function gotchaItems(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => /^##\s+Gotchas\b/i.test(l));
  if (start === -1) return [];
  const end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  return lines.slice(start + 1, end === -1 ? undefined : end)
    .filter((l) => LIST_ITEM.test(l)).map((l) => l.replace(LIST_ITEM, '').trim());
}

// withoutNow: { passed, runs } for the task run WITHOUT the rule on today's model.
// withLast: the latest { passed, runs } WITH the rule, if any.
export function pruneVerdict(withoutNow, withLast) {
  if (!withoutNow?.runs) return 'No finished runs.';
  const p = withoutNow.passed / withoutNow.runs;
  let says;
  if (p >= 0.8) says = 'Cut: the agent gets it right without the line now.';
  else if (p <= 0.2) {
    says = withLast?.runs && withLast.passed / withLast.runs < 0.5
      ? "Keep for now, but the line doesn't fix it either: make it a test (/city-app:lesson)."
      : 'Keep: without the line the agent still gets it wrong.';
  } else says = 'Unclear: re-test with more runs (--runs 5) or both ways (--full).';
  return withoutNow.runs < 5 ? `${says} (${withoutNow.runs} run${withoutNow.runs === 1 ? '' : 's'}, so treat it as a hint.)` : says;
}
