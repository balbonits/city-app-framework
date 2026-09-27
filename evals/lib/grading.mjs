// Reads `claude plugin eval` case folders and applies their graders to a finished run.
// Used by evals/run-local.mjs; covered by tests/grading.test.mjs.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// The frontmatter subset the case files use: key: value, quoted strings, numbers, flow maps, lists.
function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith('{')) {
    return Object.fromEntries(v.slice(1, -1).split(',').map((pair) => {
      const [k, ...rest] = pair.split(':');
      return [k.trim(), parseValue(rest.join(':'))];
    }));
  }
  if (v.startsWith('[')) return v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === 'true' || v === 'false') return v === 'true';
  return v;
}

export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text.trim() };
  const data = {};
  for (const line of m[1].split('\n')) {
    const at = line.indexOf(':');
    if (at > 0) data[line.slice(0, at).trim()] = parseValue(line.slice(at + 1));
  }
  return { data, body: m[2].trim() };
}

export const listFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  if (entry === '.git') return [];
  const path = join(dir, entry);
  return statSync(path).isDirectory() ? listFiles(path).map((f) => join(entry, f)) : [entry];
});

const globToRegex = (glob) => new RegExp(`^${glob
  .replace(/[.+^${}()|[\]\\]/g, '\\$&')
  .replace(/\*\*/g, '\u0000')
  .replace(/\*/g, '[^/]*')
  .replace(/\u0000/g, '.*')}$`);

// run: { workspace, created: [paths], reply: string, trace: string, calls: [{ name, input }] }
export function grade(grader, run) {
  const g = grader.data;
  if (g.type === 'regex') {
    let text;
    const target = g.target ?? 'last_message';
    if (target === 'last_message') text = run.reply;
    else if (target === 'trace') text = run.trace;
    else if (target === 'files') text = run.created.join('\n');
    else if (target.source === 'file') {
      const path = join(run.workspace, target.path);
      if (!existsSync(path)) return { pass: false, why: `${target.path} does not exist` };
      text = readFileSync(path, 'utf8');
    } else return { pass: false, why: `unknown target ${JSON.stringify(target)}` };
    const found = (text.match(new RegExp(g.pattern, `${g.flags ?? ''}g`)) ?? []).length;
    const match = g.match ?? 'contains';
    if (match === 'not_contains') return { pass: found === 0, why: `${found} match(es)` };
    if (String(match).startsWith('count:')) return { pass: found === Number(match.slice(6)), why: `${found} match(es)` };
    return { pass: found > 0, why: `${found} match(es)` };
  }
  if (g.type === 'file_exists') {
    const hit = run.created.some((f) => globToRegex(g.path).test(f));
    return { pass: (g.exists ?? true) ? hit : !hit, why: hit ? 'created' : 'not created' };
  }
  if (g.type === 'tool_used') {
    const re = g.input_match ? new RegExp(g.input_match) : null;
    const n = run.calls.filter((c) => c.name === g.tool && (!re || re.test(JSON.stringify(c.input)))).length;
    return { pass: n >= (g.min ?? 1) && n <= (g.max ?? Infinity), why: `${n} call(s)` };
  }
  return { pass: null, why: `${g.type} graders are skipped locally` };
}

export function loadCase(dir, suite) {
  const caseYaml = existsSync(join(dir, 'case.yaml')) ? readFileSync(join(dir, 'case.yaml'), 'utf8') : '';
  return {
    name: relative(suite, dir),
    dir,
    scaffold: caseYaml.match(/scaffold_script:\s*(\S+)/)?.[1],
    prompt: frontmatter(readFileSync(join(dir, 'prompt.md'), 'utf8')).body,
    graders: readdirSync(join(dir, 'graders')).filter((f) => f.endsWith('.md')).sort()
      .map((f) => ({ name: f.replace(/\.md$/, ''), ...frontmatter(readFileSync(join(dir, 'graders', f), 'utf8')) })),
  };
}

export const caseDirs = (suite) => readdirSync(suite).map((d) => join(suite, d)).filter((d) => existsSync(join(d, 'prompt.md')));
