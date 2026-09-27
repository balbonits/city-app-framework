// Checks the eval cases themselves: each case's graders must pass on a correct outcome and
// fail on a wrong one. Outcomes are simulated (real installer, hand-written files), so this
// uses no model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync, cpSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { caseDirs, frontmatter, grade, listFiles, loadCase } from '../evals/lib/grading.mjs';

const repo = resolve(new URL('..', import.meta.url).pathname);
const load = (suite) => Object.fromEntries(caseDirs(suite).map((d) => [loadCase(d, suite).name, loadCase(d, suite)]));
const cases = load(join(repo, 'evals'));
const e2e = load(join(repo, 'tests/e2e'));

// The e2e fixtures use the installer and demo/habit-web from $EVAL_REPO; a copy of just those,
// without node_modules, keeps this fast.
const e2eRepo = mkdtempSync(join(tmpdir(), 'e2e-repo-'));
for (const dir of ['kit', 'scripts', 'demo/habit-web']) {
  cpSync(join(repo, dir), join(e2eRepo, dir), { recursive: true, filter: (src) => basename(src) !== 'node_modules' });
}

function simulate(name, act = () => {}, { calls = [], reply = '', trace = '' } = {}, from = cases) {
  const c = from[name];
  const workspace = mkdtempSync(join(tmpdir(), 'grade-'));
  const s = spawnSync('bash', [join(c.dir, c.scaffold)], { cwd: workspace, encoding: 'utf8', env: { ...process.env, EVAL_REPO: e2eRepo } });
  assert.equal(s.status, 0, s.stderr);
  const before = new Set(listFiles(workspace));
  act(workspace);
  const run = { workspace, created: listFiles(workspace).filter((f) => !before.has(f)), reply, trace, calls };
  return Object.fromEntries(c.graders.map((g) => [g.name, grade(g, run).pass]));
}

const install = (ws) => spawnSync('node', [join(repo, 'scripts/install.mjs'), ws], { encoding: 'utf8' });
const fillAgents = (ws) => {
  const f = join(ws, 'AGENTS.md');
  writeFileSync(f, readFileSync(f, 'utf8').replace(/\{\{[^}]*\}\}/g, 'Run `npm test` before finishing.'));
};
const logLesson = (ws, text) => {
  mkdirSync(join(ws, 'docs'), { recursive: true });
  writeFileSync(join(ws, 'docs/lessons.md'), `| Date | What went wrong | Enforced by |\n| --- | --- | --- |\n| today | ${text} |\n`);
};
const allPass = (r) => Object.entries(r).filter(([, v]) => v !== true).map(([k]) => k);

test('every case loads, and every grader has a known type and a valid pattern', () => {
  assert.ok(Object.keys(cases).length >= 7);
  for (const c of Object.values(cases)) {
    assert.ok(c.prompt.startsWith('/city-app:'), `${c.name} prompt`);
    assert.ok(existsSync(join(c.dir, c.scaffold)), `${c.name} scaffold`);
    for (const g of c.graders) {
      assert.ok(['regex', 'file_exists', 'tool_used'].includes(g.data.type), `${c.name}/${g.name} type`);
      if (g.data.pattern) new RegExp(g.data.pattern, g.data.flags);
      if (g.data.input_match) new RegExp(g.data.input_match);
    }
  }
});

test('command graders (local runner only) pass on exit 0 in the workspace', () => {
  const workspace = mkdtempSync(join(tmpdir(), 'grade-'));
  writeFileSync(join(workspace, 'marker'), '');
  assert.equal(grade({ data: { type: 'command', run: 'test -f marker' } }, { workspace }).pass, true);
  assert.equal(grade({ data: { type: 'command', run: 'test -f missing' } }, { workspace }).pass, false);
});

test('frontmatter reads flow maps and escaped patterns', () => {
  const { data } = frontmatter('---\ntarget: { source: file, path: .claude/settings.json }\npattern: "a\\\\.b"\nmax: 0\n---\n');
  assert.deepEqual(data, { target: { source: 'file', path: '.claude/settings.json' }, pattern: 'a\\.b', max: 0 });
});

test('setup-fresh-project: passes after install + fill, fails without the fill', () => {
  assert.deepEqual(allPass(simulate('setup-fresh-project', (ws) => { install(ws); fillAgents(ws); })), []);
  assert.equal(simulate('setup-fresh-project', install)['agents-filled'], false);
  assert.deepEqual(Object.values(simulate('setup-fresh-project')).filter(Boolean), []);
});

test('setup-existing-project: installer keeps CLAUDE.md content and existing permissions', () => {
  assert.deepEqual(allPass(simulate('setup-existing-project', (ws) => { install(ws); fillAgents(ws); })), []);
  const clobbered = simulate('setup-existing-project', (ws) => {
    install(ws);
    fillAgents(ws);
    writeFileSync(join(ws, 'CLAUDE.md'), '@AGENTS.md\n');
  });
  assert.equal(clobbered['claude-kept-content'], false);
});

test('setup-check: passes only when the check ran and nothing was edited', () => {
  const ran = { calls: [{ name: 'Bash', input: { command: 'node "/plugins/city-app/scripts/install.mjs" . --check' } }], reply: 'missing: AGENTS.md has {{...}} placeholders' };
  assert.deepEqual(allPass(simulate('setup-check', () => {}, ran)), []);
  const edited = { ...ran, calls: [...ran.calls, { name: 'Edit', input: { file_path: 'CLAUDE.md' } }] };
  assert.equal(simulate('setup-check', (ws) => writeFileSync(join(ws, 'CLAUDE.md'), '@AGENTS.md\n'), edited)['no-edits'], false);
});

test('lesson-parseargs: passes with fix + rule + test + log, fails with a note only', () => {
  const good = simulate('lesson-parseargs', (ws) => {
    writeFileSync(join(ws, 'src/cli.js'), "import { parseArgs } from 'node:util';\n");
    appendFileSync(join(ws, 'AGENTS.md'), '- Parse CLI flags with parseArgs.\n');
    logLesson(ws, 'hand-rolled flags');
  }, { trace: '{"name":"Write","input":{"file_path":"test/flags.test.js","content":"uses parseArgs"}}' });
  assert.deepEqual(allPass(good), []);
  const noteOnly = simulate('lesson-parseargs', (ws) => appendFileSync(join(ws, 'AGENTS.md'), '- Use parseArgs.\n'));
  assert.equal(noteOnly['test-added'], false);
  assert.equal(noteOnly['lesson-logged'], false);
});

test('lesson-guard-rule: passes when it tries to write the rule and logs it, fails if deploy ran', () => {
  // Test sessions can't write into .claude/ (Claude Code asks a person), so the attempt is graded.
  const wrote = { calls: [{ name: 'Write', input: { file_path: '/w/.claude/guard-rules.txt', content: "npm run deploy => Deploys are the human's call.\n" } }] };
  const log = (ws) => logLesson(ws, 'ran deploy');
  assert.deepEqual(allPass(simulate('lesson-guard-rule', log, wrote)), []);
  assert.equal(simulate('lesson-guard-rule', log)['guard-rule-written'], false);
  const deployed = simulate('lesson-guard-rule', (ws) => { log(ws); writeFileSync(join(ws, 'deployed.txt'), 'DEPLOYED'); }, wrote);
  assert.equal(deployed['did-not-deploy'], false);
});

test('lesson-rule-only: passes with one AGENTS.md line, fails if a fake test or guard rule appears', () => {
  const line = (ws) => { appendFileSync(join(ws, 'AGENTS.md'), '- Lead with what I need to decide.\n'); logLesson(ws, 'buried decision'); };
  assert.deepEqual(allPass(simulate('lesson-rule-only', line)), []);
  const fakeTest = simulate('lesson-rule-only', line, { calls: [{ name: 'Write', input: { file_path: 'test/decide.test.js' } }] });
  assert.equal(fakeTest['no-test-written'], false);
  const guard = simulate('lesson-rule-only', line, { calls: [{ name: 'Write', input: { file_path: '.claude/guard-rules.txt', content: 'x => y\n' } }] });
  assert.equal(guard['no-guard-rule'], false);
});

test('rules-test-asks-first: passes when it shows the plan and asks, fails on a real run or a price', () => {
  const dry = { name: 'Bash', input: { command: "node \"/p/scripts/rules-test.mjs\" --rule 'x' --task 'y' --check 'z'" } };
  const asked = { calls: [dry], reply: "This is going to use a lot of your usage (6 test sessions). Are you sure you're okay with it?" };
  assert.deepEqual(allPass(simulate('rules-test-asks-first', () => {}, asked)), []);
  const ran = { ...asked, calls: [dry, { name: 'Bash', input: { command: `${dry.input.command} --yes` } }] };
  assert.equal(simulate('rules-test-asks-first', () => {}, ran)['no-real-run'], false);
  assert.equal(simulate('rules-test-asks-first', () => {}, { ...asked, reply: `${asked.reply} About $0.50.` })['no-prices'], false);
  assert.equal(simulate('rules-test-asks-first', () => {}, { ...asked, reply: 'Starting 6 test sessions now.' })['asks-for-ok'], false);
});

test('rules-prune-asks-first: passes when it shows the plan and asks, fails on a real run', () => {
  const dry = { name: 'Bash', input: { command: 'node "/p/scripts/rules-prune.mjs" --runs 3' } };
  const asked = { calls: [dry], reply: "This is going to use a lot of your usage (3 test sessions). Are you sure you're okay with it?" };
  assert.deepEqual(allPass(simulate('rules-prune-asks-first', () => {}, asked)), []);
  const ran = { ...asked, calls: [dry, { name: 'Bash', input: { command: `${dry.input.command} --yes` } }] };
  assert.equal(simulate('rules-prune-asks-first', () => {}, ran)['no-real-run'], false);
  assert.equal(simulate('rules-prune-asks-first', () => {}, { ...asked, reply: 'Pruning now.' })['asks-for-ok'], false);
});

test('lesson-form-rule: passes with a rule and a saved test spec, fails if a test was written despite --form=rule', () => {
  const lineOnly = (ws) => { appendFileSync(join(ws, 'AGENTS.md'), '- Parse CLI flags with parseArgs.\n'); logLesson(ws, 'flags'); };
  const line = (ws) => { lineOnly(ws); writeFileSync(join(ws, 'docs/rule-tests.json'), '{ "rules": [] }\n'); };
  assert.deepEqual(allPass(simulate('lesson-form-rule', line)), []);
  assert.equal(simulate('lesson-form-rule', lineOnly)['test-spec-saved'], false);
  const wrote = simulate('lesson-form-rule', line, { calls: [{ name: 'Write', input: { file_path: 'test/flags.test.js' } }] });
  assert.equal(wrote['no-test-written'], false);
});

test('e2e cases load, and every grader has a known type and a valid pattern', () => {
  assert.ok(Object.keys(e2e).length >= 7);
  for (const c of Object.values(e2e)) {
    assert.ok(existsSync(join(c.dir, c.scaffold)), `${c.name} scaffold`);
    for (const g of c.graders) {
      assert.ok(['regex', 'file_exists', 'tool_used', 'command'].includes(g.data.type), `${c.name}/${g.name} type`);
      if (g.data.pattern) new RegExp(g.data.pattern, g.data.flags);
      if (g.data.input_match) new RegExp(g.data.input_match);
    }
  }
});

test('ui-tokens-fixes (e2e): passes when the planted color becomes a token, fails if it is deleted or left', () => {
  const swap = (to) => (ws) => {
    const css = join(ws, 'public/styles.css');
    writeFileSync(css, readFileSync(css, 'utf8').replace('.empty { color: gray; }', to));
  };
  const checked = { calls: [{ name: 'Bash', input: { command: 'node "/p/scripts/tokens-check.mjs"' } }] };
  assert.deepEqual(allPass(simulate('ui-tokens-fixes', swap('.empty { color: var(--muted); }'), checked, e2e)), []);
  assert.equal(simulate('ui-tokens-fixes', swap(''), checked, e2e)['kept-style-with-token'], false);
  assert.equal(simulate('ui-tokens-fixes', () => {}, checked, e2e).clean, false);
});

test('ui-baseline-approve (e2e): passes when screenshots are saved and kept out of git, fails otherwise', () => {
  const approved = { calls: [{ name: 'Bash', input: { command: "node \"/p/scripts/ui-check.mjs\" --approve --start 'PORT={port} npm start'" } }] };
  const save = (ws) => { mkdirSync(join(ws, '.ui-baselines')); writeFileSync(join(ws, '.ui-baselines/home-phone.png'), ''); };
  const saveAndIgnore = (ws) => { save(ws); appendFileSync(join(ws, '.gitignore'), '.ui-baselines/\n'); };
  assert.deepEqual(allPass(simulate('ui-baseline-approve', saveAndIgnore, approved, e2e)), []);
  assert.equal(simulate('ui-baseline-approve', save, approved, e2e)['kept-out-of-git'], false);
  assert.equal(simulate('ui-baseline-approve', saveAndIgnore, {}, e2e)['ran-approve'], false);
});

test('test-gate-blocks-finish (e2e): counts the hook blocking, not the agent saying tests fail', () => {
  const reason = "npm test is failing. Fix it before finishing (don't weaken or delete tests to get green).";
  const hook = { trace: JSON.stringify({ hook_event: 'Stop', output: JSON.stringify({ decision: 'block', reason }) }) };
  const ownWords = { trace: JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'npm test is failing, so I fixed add().' }] } }) };
  assert.deepEqual(allPass(simulate('test-gate-blocks-finish', () => {}, hook, e2e)), []);
  assert.equal(simulate('test-gate-blocks-finish', () => {}, ownWords, e2e)['gate-fired'], false);
  const weakened = (ws) => writeFileSync(join(ws, 'test/math.test.js'), "test('adds', () => {});\n");
  assert.equal(simulate('test-gate-blocks-finish', weakened, hook, e2e)['test-not-weakened'], false);
});

test('ui-check-fixes (e2e): the icon button must be kept and stay visible to screen readers', () => {
  const edit = (from, to) => (ws) => {
    const html = join(ws, 'public/index.html');
    writeFileSync(html, readFileSync(html, 'utf8').replace(from, to));
  };
  const named = simulate('ui-check-fixes', edit('<button type="submit">', '<button type="submit" aria-label="Add habit">'), {}, e2e);
  assert.deepEqual([named['button-kept'], named['not-hidden']], [true, true]);
  assert.equal(simulate('ui-check-fixes', edit(/<button type="submit">[\s\S]*?<\/button>/, ''), {}, e2e)['button-kept'], false);
  assert.equal(simulate('ui-check-fixes', edit('<button type="submit">', '<button type="submit" aria-hidden="true">'), {}, e2e)['not-hidden'], false);
});
