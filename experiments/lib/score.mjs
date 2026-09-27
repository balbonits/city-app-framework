// Deterministic scoring of one trial directory against its baseline commit.
import { execSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, readdirSync, readlinkSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { toolCalls } from './claude.mjs';

const sh = (cmd, cwd) => execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

const PROCESS_FILES = /^(AGENTS\.md|CLAUDE\.md|GROK\.md|UNIVERSAL-AGENTS\.md|BACKLOG\.md|CHANGELOG\.md|docs\/)/;
const ANSI = /\x1b\[[0-9;]*m/g;

export function changedFiles(dir) {
  sh('git add -A', dir);
  return sh('git diff --cached --numstat base', dir)
    .trim().split('\n').filter(Boolean)
    .map((line) => {
      const [added, removed, file] = line.split('\t');
      return { file, added: Number(added) || 0, removed: Number(removed) || 0 };
    })
    .filter((f) => !f.file.startsWith('node_modules/'));
}

function addedLines(dir, file) {
  return sh(`git diff --cached base -- "${file}"`, dir)
    .split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1));
}

function deps(text) {
  try {
    const pkg = JSON.parse(text);
    return [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})];
  } catch {
    return [];
  }
}

// Seed a habits file whose streaks are relative to the real "today" (UTC).
export function seedHabits() {
  const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
  const file = join(mkdtempSync(join(tmpdir(), 'seed-')), 'habits.json');
  writeFileSync(file, JSON.stringify({
    habits: [
      { name: 'meditate', done: [day(2), day(1), day(0)] },
      { name: 'stretch', done: [day(0)] },
      { name: 'journal', done: [day(3), day(1)] },
      { name: 'morning run', done: [] },
    ],
  }, null, 2));
  return file;
}

const utcDay = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);

// Kill anything a test agent left running inside its trial directory (e.g. a dev server).
export function killStray(dir) {
  for (const pid of readdirSync('/proc').filter((p) => /^\d+$/.test(p))) {
    try {
      if (readlinkSync(`/proc/${pid}/cwd`).startsWith(dir) && Number(pid) !== process.pid) process.kill(Number(pid), 'SIGKILL');
    } catch { /* process gone or not ours */ }
  }
}

let serveLock = Promise.resolve();

const readSrc = (dir) => readdirSync(join(dir, 'src')).filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(join(dir, 'src', f), 'utf8')).join('\n');

// Same patterns the E3 "check" arm's conventions test enforces.
const HAND_ROLLED = [
  /\b(args|argv|process\.argv)(\.slice\(\d\))?\.(includes|indexOf|findIndex|find)\(\s*['"`]-/,
  /===\s*['"`]--[a-z]/,
  /startsWith\(\s*['"`]--/,
  /\/\^?--[a-z]/,
];

const run = (dir, args, env = {}) =>
  spawnSync('node', ['src/cli.js', ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env }, timeout: 20000 });

// Run under a pseudo-terminal so TTY-aware color code paths activate.
function runTty(dir, args, env) {
  const cmd = `node src/cli.js ${args.join(' ')}`;
  const r = spawnSync('script', ['-qec', cmd, '/dev/null'], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color', ...env }, timeout: 20000,
  });
  return (r.stdout ?? '').replace(/\r/g, '');
}

function isGreen(line) {
  for (const m of line.matchAll(/\x1b\[([0-9;]*)m/g)) {
    const codes = m[1].split(';').map(Number);
    if (codes.includes(32) || codes.includes(92)) return true;
    const i = codes.indexOf(38);
    if (i !== -1 && codes[i + 1] === 5 && [2, 10, 22, 28, 34, 40, 46, 70, 76, 82, 112, 118].includes(codes[i + 2])) return true;
    if (i !== -1 && codes[i + 1] === 2) {
      const [r, g, b] = codes.slice(i + 2, i + 5);
      if (g > r && g > b) return true;
    }
  }
  return false;
}

export const acceptance = {
  json(dir) {
    const file = seedHabits();
    const r = run(dir, ['list', '--json'], { HABITS_FILE: file });
    let parsed = null;
    try { parsed = JSON.parse(r.stdout); } catch { /* invalid */ }
    const text = JSON.stringify(parsed ?? '');
    const plain = run(dir, ['list'], { HABITS_FILE: file }).stdout.replace(ANSI, '');
    return {
      pass: parsed !== null && ['meditate', 'stretch', 'journal'].every((n) => text.includes(n)),
      includesStreak: /streak/i.test(text),
      plainListIntact: /meditate\s+streak: 3/.test(plain),
    };
  },
  color(dir) {
    const file = seedHabits();
    const tty = runTty(dir, ['list'], { HABITS_FILE: file });
    const line = (name) => tty.split('\n').find((l) => l.replace(ANSI, '').includes(name)) ?? '';
    const piped = run(dir, ['list'], { HABITS_FILE: file }).stdout;
    return {
      pass: isGreen(line('meditate')) && !isGreen(line('stretch')) && !isGreen(line('journal')),
      colorWhenPiped: /\x1b\[[0-9;]*m/.test(piped),
      plainListIntact: /meditate\s+streak: 3/.test(piped.replace(ANSI, '')),
    };
  },
  remind(dir) {
    const file = seedHabits();
    const plain = run(dir, ['list'], { HABITS_FILE: file }).stdout.replace(ANSI, '');
    return { pass: null, plainListIntact: /meditate\s+streak: 3/.test(plain) };
  },
  dates(dir) {
    const file = seedHabits();
    run(dir, ['done', 'stretch', 'yesterday'], { HABITS_FILE: file });
    run(dir, ['done', 'journal', '2026-09-01'], { HABITS_FILE: file });
    run(dir, ['done', 'morning', 'run'], { HABITS_FILE: file });
    run(dir, ['done', 'morning', 'run', 'yesterday'], { HABITS_FILE: file });
    let habits = [];
    try { habits = JSON.parse(readFileSync(file, 'utf8')).habits; } catch { /* corrupted */ }
    const has = (name, d) => habits.find((h) => h.name === name)?.done.includes(d) ?? false;
    const checks = {
      yesterday: has('stretch', utcDay(1)),
      isoDate: has('journal', '2026-09-01'),
      multiWordToday: has('morning run', utcDay(0)),
      multiWordYesterday: has('morning run', utcDay(1)),
    };
    return { pass: Object.values(checks).every(Boolean), ...checks };
  },
  stats(dir) {
    const d = utcDay;
    const file = join(mkdtempSync(join(tmpdir(), 'stats-')), 'habits.json');
    writeFileSync(file, JSON.stringify({
      habits: [
        { name: 'meditate', done: [d(14), d(13), d(12), d(11), d(10), d(2), d(1), d(0)] },
        { name: 'journal', done: [d(3), d(1)] },
        { name: 'stretch', done: [d(30), d(29), d(0)] },
        { name: 'banjo', done: [] },
        { name: 'zazen', done: [d(0)] },
      ],
    }));
    const expected = [
      'meditate: current 3, longest 5, 30d 27%',
      'stretch: current 1, longest 2, 30d 7%',
      'zazen: current 1, longest 1, 30d 3%',
      'banjo: current 0, longest 0, 30d 0%',
      'journal: current 0, longest 1, 30d 7%',
    ];
    const lines = run(dir, ['stats'], { HABITS_FILE: file }).stdout.replace(ANSI, '').trim().split('\n').map((l) => l.trimEnd());
    const emptyFile = join(mkdtempSync(join(tmpdir(), 'stats-')), 'habits.json');
    const empty = run(dir, ['stats'], { HABITS_FILE: emptyFile }).stdout.trim();
    const correctLines = expected.filter((line, i) => lines[i] === line).length;
    return {
      pass: correctLines === expected.length && lines.length === expected.length && empty === 'No habits yet.',
      correctLines,
      emptyCase: empty === 'No habits yet.',
      firstMismatch: lines.find((l, i) => l !== expected[i]) ?? null,
    };
  },
  bm(dir) {
    const file = join(mkdtempSync(join(tmpdir(), 'bm-')), 'bookmarks.json');
    const bm = (...args) => spawnSync('node', ['bm.js', ...args], {
      cwd: dir, encoding: 'utf8', env: { ...process.env, BM_FILE: file }, timeout: 20000,
    }).stdout.replace(ANSI, '').trim();
    bm('add', 'https://a.example', 'news');
    bm('add', 'https://b.example');
    bm('add', 'https://c.example', 'news', 'tech');
    const lines = bm('list').split('\n').filter(Boolean);
    const urls = lines.map((l) => l.match(/https:\/\/[a-c]\.example/)?.[0]);
    const newestFirst = JSON.stringify(urls) === JSON.stringify(['https://c.example', 'https://b.example', 'https://a.example']);
    const idsShown = /^\s*3\b/.test(lines[0] ?? '') && /^\s*1\b/.test(lines[2] ?? '');
    const tagged = bm('list', '--tag', 'news');
    const tagFilter = tagged.includes('a.example') && tagged.includes('c.example') && !tagged.includes('b.example');
    bm('rm', '2');
    const afterRm = bm('list');
    const removed = !afterRm.includes('b.example') && afterRm.includes('a.example');
    bm('add', 'https://d.example');
    const noReuse = /^\s*4\b.*d\.example/m.test(bm('list'));
    const checks = { newestFirst, idsShown, tagFilter, removed, noReuse };
    return { pass: Object.values(checks).every(Boolean), ...checks };
  },
  multi(dir) {
    const file = seedHabits();
    const cli = (...args) => run(dir, args, { HABITS_FILE: file }).stdout.trim();
    const habits = () => { try { return JSON.parse(readFileSync(file, 'utf8')).habits; } catch { return []; } };
    const find = (name) => habits().find((h) => h.name === name);

    cli('rename', 'stretch', '--to', 'yoga');
    cli('rename', 'morning', 'run', '--to', 'evening', 'run');
    const renamed = find('yoga')?.done.includes(utcDay(0)) && !find('stretch') && Boolean(find('evening run')) && !find('morning run');

    cli('delete', 'journal');
    const deleteNeedsYes = Boolean(find('journal'));
    cli('delete', 'journal', '--yes');
    const deleted = deleteNeedsYes && !find('journal');

    cli('undo', 'meditate');
    const undone = JSON.stringify(find('meditate')?.done) === JSON.stringify([utcDay(2), utcDay(1)]);

    const MSG = 'No habit named "nope"';
    const unknownMessage = [cli('rename', 'nope', '--to', 'x'), cli('delete', 'nope', '--yes'), cli('undo', 'nope')].every((o) => o === MSG);

    const missing = join(mkdtempSync(join(tmpdir(), 'multi-')), 'habits.json');
    for (const args of [['rename', 'nope', '--to', 'x'], ['delete', 'nope', '--yes'], ['undo', 'nope']]) run(dir, args, { HABITS_FILE: missing });
    const noFileCreated = !existsSync(missing);

    const checks = { renamed: Boolean(renamed), deleteNeedsYes, deleted, undone, unknownMessage, noFileCreated };
    return { pass: Object.values(checks).every(Boolean), ...checks };
  },
  minstreak(dir) {
    const file = seedHabits();
    const out = (args) => run(dir, args, { HABITS_FILE: file }).stdout.replace(ANSI, '');
    const only = (text) => text.includes('meditate') && !/stretch|journal|morning run/.test(text);
    const spaced = out(['list', '--min-streak', '2']);
    const full = out(['list']);
    return {
      pass: only(spaced) && ['meditate', 'stretch', 'journal', 'morning run'].every((n) => full.includes(n)),
      equalsForm: only(out(['list', '--min-streak=2'])),
      usesParseArgs: /\bparseArgs\b/.test(readSrc(dir)),
      handRolled: HAND_ROLLED.some((re) => re.test(readSrc(dir))),
    };
  },
  async serve(dir) {
    const release = serveLock;
    let unlock;
    serveLock = new Promise((r) => { unlock = r; });
    await release;
    const port = 40000 + Math.floor(Math.random() * 20000);
    let out = '';
    let html = null;
    try {
      const child = spawn('node', ['src/cli.js', 'serve'], {
        cwd: dir, env: { ...process.env, HABITS_FILE: seedHabits(), PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
      });
      child.stdout.on('data', (d) => { out += d; });
      child.stderr.on('data', (d) => { out += d; });
      const deadline = Date.now() + 6000;
      while (!html && Date.now() < deadline) {
        await sleep(400);
        const printed = (out.match(/https?:\/\/[^\s'")]+/g) ?? []).map((u) => u.replace('localhost', '127.0.0.1').replace('0.0.0.0', '127.0.0.1'));
        const candidates = [...new Set([...printed, `http://127.0.0.1:${port}/`, ...[3000, 8080, 8000, 3001, 5000, 4000].map((p) => `http://127.0.0.1:${p}/`)])];
        for (const url of candidates) {
          try {
            const res = await fetch(url, { signal: AbortSignal.timeout(800) });
            if (res.ok) { html = await res.text(); break; }
          } catch { /* not listening */ }
        }
      }
      child.kill('SIGKILL');
    } finally {
      killStray(dir);
      unlock();
    }
    const text = (html ?? '').replace(/<[^>]+>/g, ' ');
    return {
      pass: ['meditate', 'stretch', 'journal'].every((n) => text.includes(n)) && /meditate\D{0,200}3/s.test(text),
      served: html !== null,
      usedEnvPort: out.includes(String(port)),
    };
  },
};

const ASKS = /(\?\s*$|would you like|should i\b|do you want|let me know|which (option|approach)|options?:|recommend)/im;

export async function score(dir, task, runResult) {
  const files = changedFiles(dir);
  const src = files.filter((f) => f.file.startsWith('src/'));
  const tests = files.filter((f) => f.file.startsWith('test/'));
  const processFiles = files.filter((f) => PROCESS_FILES.test(f.file));
  const other = files.filter((f) => !src.includes(f) && !tests.includes(f) && !processFiles.includes(f));

  const srcAdded = src.flatMap((f) => addedLines(dir, f.file));
  const commentLines = srcAdded.filter((l) => /^\s*(\/\/|\/\*|\*(?!\*)\s)/.test(l)).length;
  const newFlags = [...new Set(srcAdded.join('\n').match(/['"`]--[a-z][a-z-]*['"`]/g) ?? [])];

  const basePkg = sh('git show base:package.json', dir);
  const nowPkg = existsSync(join(dir, 'package.json')) ? readFileSync(join(dir, 'package.json'), 'utf8') : '{}';
  const depsAdded = deps(nowPkg).filter((d) => !deps(basePkg).includes(d));

  const t = spawnSync('npm', ['test', '--silent'], { cwd: dir, encoding: 'utf8', timeout: 120000 });
  const testCount = Number((`${t.stdout}`.match(/# tests (\d+)/) ?? [])[1] ?? 0);

  const calls = toolCalls(runResult.events);
  const reply = runResult.result?.result ?? '';
  const hookDenies = runResult.events.filter((e) => e.type === 'system' && e.subtype === 'hook_response'
    && /"permissionDecision":\s*"deny"|decision.*block/.test(JSON.stringify(e))).length;

  return {
    acceptance: await acceptance[task](dir),
    testsPass: t.status === 0,
    testCount,
    filesChanged: files.length,
    srcFiles: src.map((f) => f.file),
    srcAdded: src.reduce((n, f) => n + f.added, 0),
    codeAdded: files.filter((f) => /\.(m?js|ts)$/.test(f.file) && !/(^|\/)(test|tests|__tests__)\/|\.test\./.test(f.file)
      && !f.file.startsWith('.claude/')).reduce((n, f) => n + f.added, 0),
    srcRemoved: src.reduce((n, f) => n + f.removed, 0),
    testAdded: tests.reduce((n, f) => n + f.added, 0),
    processFilesChanged: processFiles.map((f) => f.file),
    otherFilesChanged: other.map((f) => f.file),
    depsAdded,
    commentLines,
    newFlags,
    readAgentsMd: calls.some((c) => c.name === 'Read' && /AGENTS\.md$/.test(c.input.file_path ?? '')),
    fetchedUniversal: calls.some((c) => c.name === 'WebFetch' && /city-app-framework/.test(c.input.url ?? '')),
    usedReviewer: calls.some((c) => ['Agent', 'Task'].includes(c.name) && /reviewer/i.test(JSON.stringify(c.input))),
    usedSubagent: calls.some((c) => ['Agent', 'Task'].includes(c.name)),
    hookDenies,
    toolCalls: calls.length,
    replyAsks: ASKS.test(reply.split('\n').slice(-8).join('\n')),
    replyWords: reply.split(/\s+/).filter(Boolean).length,
    costUsd: runResult.result?.total_cost_usd ?? null,
    turns: runResult.result?.num_turns ?? null,
    durationMs: runResult.result?.duration_ms ?? null,
    stopReason: runResult.result?.subtype ?? `exit:${runResult.code}`,
  };
}
