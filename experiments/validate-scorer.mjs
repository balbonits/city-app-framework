// Scorer self-test: reference solutions must pass, the untouched fixture must fail.
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { score } from './lib/score.mjs';

const root = process.argv[2];
const here = new URL('.', import.meta.url).pathname;

const patch = (dir, file, from, to) => {
  const path = join(dir, file);
  const text = readFileSync(path, 'utf8');
  if (!text.includes(from)) throw new Error(`patch anchor missing in ${file}`);
  writeFileSync(path, text.replace(from, to));
};

const REFERENCE = {
  json: (d) => patch(d, 'src/cli.js', "list: () => list(),",
    "list: () => (args.includes('--json') ? JSON.stringify(listData(), null, 2) : list()),")
    || patch(d, 'src/cli.js', "import { add, done, list } from './commands.js';", "import { add, done, list, listData } from './commands.js';")
    || patch(d, 'src/commands.js', 'export function list(', "export function listData(today = new Date()) {\n  return load().habits.map((h) => ({ name: h.name, streak: currentStreak(h.done, today) }));\n}\n\nexport function list("),
  color: (d) => patch(d, 'src/commands.js', ".map((h) => `${h.name.padEnd(20)} streak: ${currentStreak(h.done, today)}`)",
    ".map((h) => {\n      const s = currentStreak(h.done, today);\n      const line = `${h.name.padEnd(20)} streak: ${s}`;\n      return s >= 3 && process.stdout.isTTY ? `\\x1b[32m${line}\\x1b[0m` : line;\n    })"),
  dates: (d) => patch(d, 'src/cli.js', "done: () => done(args.join(' ')),",
    "done: () => {\n    const last = args.at(-1);\n    const DAY = 86400000;\n    if (last === 'yesterday') return done(args.slice(0, -1).join(' '), new Date(Date.now() - DAY));\n    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(last ?? '')) return done(args.slice(0, -1).join(' '), new Date(`${last}T12:00:00Z`));\n    return done(args.join(' '));\n  },"),
  serve: (d) => patch(d, 'src/cli.js', "list: () => list(),",
    "list: () => list(),\n  serve: () => {\n    const port = Number(process.env.PORT ?? 3000);\n    createServer((req, res) => {\n      res.writeHead(200, { 'content-type': 'text/html' });\n      res.end(`<ul>${list().split('\\n').map((l) => `<li>${l}</li>`).join('')}</ul>`);\n    }).listen(port);\n    return `Serving on http://localhost:${port}`;\n  },")
    || patch(d, 'src/cli.js', "import { add, done, list } from './commands.js';", "import { createServer } from 'node:http';\nimport { add, done, list } from './commands.js';"),
};

const setup = (name) => {
  const dir = join(root, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(here, 'fixture/habit-cli'), dir, { recursive: true });
  execSync('git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm base && git tag base', { cwd: dir });
  return dir;
};

const empty = { events: [], result: null, code: 0 };
let ok = true;
for (const task of Object.keys(REFERENCE)) {
  const ref = setup(`${task}-reference`);
  REFERENCE[task](ref);
  const good = await score(ref, task, empty);
  const base = await score(setup(`${task}-untouched`), task, empty);
  const pass = good.acceptance.pass === true && base.acceptance.pass === false && good.testsPass;
  ok &&= pass;
  console.log(`${pass ? 'OK  ' : 'FAIL'} ${task}: reference=${JSON.stringify(good.acceptance)} untouched=${base.acceptance.pass}`);
}
// E3: both flag styles must pass acceptance; only the parseArgs one should satisfy the lesson,
// and the "check" arm's conventions test must catch the hand-rolled one.
const MINSTREAK = {
  parseArgs: (d) => {
    patch(d, 'src/cli.js', "import { add, done, list } from './commands.js';",
      "import { parseArgs } from 'node:util';\nimport { add, done, list } from './commands.js';");
    patch(d, 'src/cli.js', 'list: () => list(),',
      "list: () => {\n    const { values } = parseArgs({ args, options: { 'min-streak': { type: 'string' } } });\n    return list(new Date(), Number(values['min-streak'] ?? 0));\n  },");
    patch(d, 'src/commands.js', 'export function list(today = new Date()) {\n  const { habits } = load();',
      'export function list(today = new Date(), minStreak = 0) {\n  const habits = load().habits.filter((h) => currentStreak(h.done, today) >= minStreak);');
  },
  handRolled: (d) => {
    patch(d, 'src/cli.js', 'list: () => list(),',
      "list: () => {\n    const i = args.indexOf('--min-streak');\n    return list(new Date(), i === -1 ? 0 : Number(args[i + 1]));\n  },");
    patch(d, 'src/commands.js', 'export function list(today = new Date()) {\n  const { habits } = load();',
      'export function list(today = new Date(), minStreak = 0) {\n  const habits = load().habits.filter((h) => currentStreak(h.done, today) >= minStreak);');
  },
};
for (const [style, apply] of Object.entries(MINSTREAK)) {
  const d = setup(`minstreak-${style}`);
  apply(d);
  const s = await score(d, 'minstreak', empty);
  cpSync(join(here, 'arms-e3/check/test/conventions.test.js'), join(d, 'test/conventions.test.js'));
  const conv = execSync('node --test test/conventions.test.js 2>&1 || true', { cwd: d, encoding: 'utf8' });
  const convFails = /# fail 1/.test(conv);
  const expected = style === 'parseArgs'
    ? s.acceptance.pass && s.acceptance.usesParseArgs && !s.acceptance.handRolled && !convFails
    : s.acceptance.pass && !s.acceptance.usesParseArgs && s.acceptance.handRolled && convFails;
  ok &&= expected;
  console.log(`${expected ? 'OK  ' : 'FAIL'} minstreak/${style}: ${JSON.stringify(s.acceptance)} conventionsTestFails=${convFails}`);
}
// E4: reference stats implementation must pass; a version with an off-by-one window must fail.
const STATS_IMPL = (windowDays) => [
  'export function stats(today = new Date()) {',
  '  const { habits } = load();',
  "  if (habits.length === 0) return 'No habits yet.';",
  '  const day = (n) => toDay(new Date(today.getTime() - n * 86400000));',
  '  const rows = habits.map((h) => {',
  '    const days = [...new Set(h.done)].sort();',
  '    let longest = 0; let run = 0; let prev = null;',
  '    for (const d of days) {',
  "      run = prev && (Date.parse(d) - Date.parse(prev)) === 86400000 ? run + 1 : 1;",
  '      longest = Math.max(longest, run); prev = d;',
  '    }',
  `    const recent = Array.from({ length: ${windowDays} }, (_, i) => day(i)).filter((d) => h.done.includes(d)).length;`,
  '    return { name: h.name, current: currentStreak(h.done, today), longest, pct: Math.round((recent / 30) * 100) };',
  '  });',
  '  rows.sort((a, b) => b.current - a.current || a.name.localeCompare(b.name));',
  '  return rows.map((r) => `${r.name}: current ${r.current}, longest ${r.longest}, 30d ${r.pct}%`).join(\'\\n\');',
  '}',
].join('\n');
for (const [label, windowDays, shouldPass] of [['reference', 30, true], ['off-by-one', 31, false]]) {
  const d = setup(`stats-${label}`);
  writeFileSync(join(d, 'src/commands.js'), `${readFileSync(join(d, 'src/commands.js'), 'utf8')}\n${STATS_IMPL(windowDays)}\n`);
  patch(d, 'src/cli.js', "import { add, done, list } from './commands.js';", "import { add, done, list, stats } from './commands.js';");
  patch(d, 'src/cli.js', 'list: () => list(),', 'list: () => list(),\n  stats: () => stats(),');
  const s = await score(d, 'stats', empty);
  const good = s.acceptance.pass === shouldPass;
  ok &&= good;
  console.log(`${good ? 'OK  ' : 'FAIL'} stats/${label}: ${JSON.stringify(s.acceptance)}`);
}
// E4b: reference multi-command implementation passes; one that saves on unknown habits fails.
const MULTI_IMPL = (saveOnMissing) => `
const MISSING = (name) => \`No habit named "\${name}"\`;
function withHabit(name, change) {
  const data = load();
  const habit = data.habits.find((h) => h.name === name);
  if (!habit) { ${saveOnMissing ? 'save(data); ' : ''}return MISSING(name); }
  const message = change(data, habit);
  save(data);
  return message;
}
export const rename = (name, to) => withHabit(name, (d, h) => { h.name = to; return \`Renamed to "\${to}"\`; });
export const remove = (name) => withHabit(name, (d, h) => { d.habits = d.habits.filter((x) => x !== h); return \`Deleted "\${name}"\`; });
export const undo = (name, today = new Date()) => withHabit(name, (d, h) => { h.done = h.done.filter((x) => x !== toDay(today)); return 'Undone'; });
`;
const MULTI_CLI = `
  rename: () => { const i = args.indexOf('--to'); return rename(args.slice(0, i).join(' '), args.slice(i + 1).join(' ')); },
  delete: () => {
    const yes = args.includes('--yes');
    const name = args.filter((a) => a !== '--yes').join(' ');
    if (!yes) return 'Refusing to delete without --yes';
    return remove(name);
  },
  undo: () => undo(args.join(' ')),`;
for (const [label, saveOnMissing, shouldPass] of [['reference', false, true], ['saves-on-missing', true, false]]) {
  const d = setup(`multi-${label}`);
  writeFileSync(join(d, 'src/commands.js'), `${readFileSync(join(d, 'src/commands.js'), 'utf8')}${MULTI_IMPL(saveOnMissing)}`);
  patch(d, 'src/cli.js', "import { add, done, list } from './commands.js';", "import { add, done, list, rename, remove, undo } from './commands.js';");
  patch(d, 'src/cli.js', 'list: () => list(),', `list: () => list(),${MULTI_CLI}`);
  const s = await score(d, 'multi', empty);
  const good = s.acceptance.pass === shouldPass && (shouldPass || s.acceptance.noFileCreated === false);
  ok &&= good;
  console.log(`${good ? 'OK  ' : 'FAIL'} multi/${label}: ${JSON.stringify(s.acceptance)}`);
}
// E7: a reference bm.js passes; one that reuses ids after delete fails.
const BM = (reuseIds) => `import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const file = process.env.BM_FILE ?? 'bookmarks.json';
const db = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { next: 1, items: [] };
const [cmd, ...args] = process.argv.slice(2);
const save = () => writeFileSync(file, JSON.stringify(db));
if (cmd === 'add') {
  const id = ${reuseIds ? 'db.items.length + 1' : 'db.next++'};
  db.items.push({ id, url: args[0], tags: args.slice(1) }); save(); console.log('added ' + id);
} else if (cmd === 'list') {
  const i = args.indexOf('--tag');
  const items = db.items.filter((b) => i === -1 || b.tags.includes(args[i + 1])).reverse();
  console.log(items.map((b) => [b.id, b.url, ...b.tags].join(' ')).join('\\n'));
} else if (cmd === 'rm') {
  db.items = db.items.filter((b) => b.id !== Number(args[0])); save();
}
`;
for (const [label, reuse, shouldPass] of [['reference', false, true], ['reuses-ids', true, false]]) {
  const d = join(root, `bm-${label}`);
  rmSync(d, { recursive: true, force: true });
  mkdirSync(d, { recursive: true });
  cpSync(join(here, 'fixture/empty'), d, { recursive: true });
  execSync('git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm base && git tag base', { cwd: d });
  writeFileSync(join(d, 'bm.js'), BM(reuse));
  const s = await score(d, 'bm', empty);
  const good = s.acceptance.pass === shouldPass;
  ok &&= good;
  console.log(`${good ? 'OK  ' : 'FAIL'} bm/${label}: ${JSON.stringify(s.acceptance)}`);
}
// Reply detector: must be wording-neutral about how a pick is phrased, and must not
// count a plain list of changes as "offering options".
const { offersOptions } = await import('./lib/replies.mjs');
const REPLIES = [
  [true, 'Options:\n1. Cron job\n2. Desktop notifications\n3. Leave it\n\nMy pick: option 1.'],
  [true, 'This needs a decision:\n1. **Recommended**: keep it manual\n2. Add cron docs\n3. Notifications'],
  [true, '**A) A remind command**\n\n**B) OS notifications**\n\nWhich do you want?'],
  [true, 'Options:\n1. Cron\n2. Notifier\n\nRecommendation: option 1.'],
  [false, 'Changes:\n- src/commands.js: new remind()\n- test: 3 tests\n\nLet me know if you want a commit.'],
  [false, 'Added `remind`. All 10 tests pass.'],
];
for (const [expected, text] of REPLIES) {
  const good = offersOptions(text) === expected;
  ok &&= good;
  if (!good) console.log(`FAIL replies: expected ${expected} for ${JSON.stringify(text.slice(0, 40))}`);
}
console.log(`${REPLIES.every(([e, t]) => offersOptions(t) === e) ? 'OK  ' : 'FAIL'} reply detector: ${REPLIES.length} labeled examples`);
process.exit(ok ? 0 : 1);
