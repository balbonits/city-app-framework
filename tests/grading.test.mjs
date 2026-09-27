// Checks the eval cases themselves: each case's graders must pass on a correct outcome and
// fail on a wrong one. Outcomes are simulated (real installer, hand-written files), so this
// uses no model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { caseDirs, frontmatter, grade, listFiles, loadCase } from '../evals/lib/grading.mjs';

const repo = resolve(new URL('..', import.meta.url).pathname);
const suite = join(repo, 'evals');
const cases = Object.fromEntries(caseDirs(suite).map((d) => [loadCase(d, suite).name, loadCase(d, suite)]));

function simulate(name, act = () => {}, { calls = [], reply = '', trace = '' } = {}) {
  const c = cases[name];
  const workspace = mkdtempSync(join(tmpdir(), 'grade-'));
  const s = spawnSync('bash', [join(c.dir, c.scaffold)], { cwd: workspace, encoding: 'utf8' });
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
});

test('lesson-form-rule: passes with a rule only, fails if a test was written despite --form=rule', () => {
  const line = (ws) => { appendFileSync(join(ws, 'AGENTS.md'), '- Parse CLI flags with parseArgs.\n'); logLesson(ws, 'flags'); };
  assert.deepEqual(allPass(simulate('lesson-form-rule', line)), []);
  const wrote = simulate('lesson-form-rule', line, { calls: [{ name: 'Write', input: { file_path: 'test/flags.test.js' } }] });
  assert.equal(wrote['no-test-written'], false);
});
