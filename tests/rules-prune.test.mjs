// Tests for /city-app:rules:prune (scripts/rules-prune.mjs) and the registry rules-test saves.
// A fake `claude` stands in for real sessions, so nothing here uses the model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gotchaItems, loadRegistry, pruneVerdict, saveRun } from '../scripts/lib/rules.mjs';
import { AGENTS, gitProject, tmp, withFakeClaude } from './helpers/rules.mjs';

const PRUNE = new URL('../scripts/rules-prune.mjs', import.meta.url).pathname;
const RULES_TEST = new URL('../scripts/rules-test.mjs', import.meta.url).pathname;
const RULE = 'Parse CLI flags with parseArgs from node:util.';
const spec = { rule: RULE, file: 'AGENTS.md', task: 'Add a --limit flag.', checks: ['grep -rqw parseArgs src'] };
const registryOf = (dir) => loadRegistry(join(dir, 'docs/rule-tests.json'));

function withRegistry(rules) {
  const dir = gitProject();
  mkdirSync(join(dir, 'docs'));
  writeFileSync(join(dir, 'docs/rule-tests.json'), JSON.stringify({ rules }, null, 2));
  return dir;
}
const past = { date: '2026-09-27', model: 'claude-sonnet-5', runs: 2, with: { passed: 2, runs: 2 }, without: { passed: 0, runs: 2 }, verdict: 'The rule works.' };

test('prune suggestions: cut, keep, make it a test, or unclear', () => {
  assert.match(pruneVerdict({ passed: 5, runs: 5 }, { passed: 5, runs: 5 }), /^Cut: the agent gets it right without the line now\.$/);
  assert.match(pruneVerdict({ passed: 0, runs: 3 }, { passed: 3, runs: 3 }), /^Keep: without the line.*3 runs, so treat it as a hint/);
  assert.match(pruneVerdict({ passed: 0, runs: 5 }, { passed: 1, runs: 5 }), /make it a test \(\/city-app:lesson\)/);
  assert.match(pruneVerdict({ passed: 2, runs: 5 }, null), /^Unclear/);
  assert.equal(pruneVerdict({ passed: 0, runs: 0 }, null), 'No finished runs.');
});

test('the project rules are the Gotchas list items', () => {
  assert.deepEqual(gotchaItems(AGENTS), ['Tests must point HABITS_FILE at a temp file.', RULE]);
  assert.deepEqual(gotchaItems('# app\n\n## Commands\n\n- npm test\n'), []);
});

test('saving a run adds history to the same rule, matched on its words', () => {
  const path = join(tmp('rp-reg-'), 'docs/rule-tests.json');
  saveRun(path, spec, past);
  saveRun(path, { ...spec, rule: '- parse cli flags with `parseArgs` from node:util.', task: 'New task.' }, { ...past, date: '2026-10-01' });
  const { rules } = loadRegistry(path);
  assert.equal(rules.length, 1);
  assert.equal(rules[0].rule, RULE);
  assert.equal(rules[0].task, 'New task.');
  assert.deepEqual(rules[0].history.map((h) => h.date), ['2026-09-27', '2026-10-01']);
});

test('rules-test --arms without runs one side and saves it for prune', () => {
  const dir = gitProject();
  const r = withFakeClaude(RULES_TEST, ['--dir', dir, '--rule', RULE, '--task', spec.task, '--check', spec.checks[0], '--runs', '2', '--arms', 'without', '--yes']);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.calls.length, 2);
  assert.doesNotMatch(r.stdout, /with rule {6}/);
  assert.match(r.stdout, /Saved to docs\/rule-tests\.json/);
  const [entry] = registryOf(dir).rules;
  assert.deepEqual(entry.history[0].without, { passed: 0, runs: 2 });
  assert.equal(entry.history[0].with, null);
});

test('without --yes prune only shows the plan: saved rules, untested lines, sessions needed', () => {
  const dir = withRegistry([
    { ...spec, history: [past], cut: null },
    { ...spec, rule: 'Colors come from tokens.', history: [past], cut: { date: '2026-09-27', why: 'noise' } },
    { ...spec, rule: 'A rule someone deleted by hand.', history: [past], cut: null },
  ]);
  const r = withFakeClaude(PRUNE, ['--dir', dir]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.calls.length, 0);
  assert.match(r.stdout, /1\. Parse CLI flags with parseArgs from node:util\.\n {5}last: with 2\/2, without 0\/2 \(claude-sonnet-5, 2026-09-27\)/);
  assert.doesNotMatch(r.stdout, /Colors come from tokens/);
  assert.match(r.stdout, /never tested.*\n {2}- Tests must point HABITS_FILE at a temp file\./);
  assert.match(r.stdout, /no longer in their file \(skipped\): "A rule someone deleted by hand\."/);
  assert.match(r.stdout, /Ready: 3 test sessions\. Nothing has run yet/);
});

test('prune --yes suggests cutting a rule the agent now follows anyway', () => {
  const dir = withRegistry([{ ...spec, history: [past], cut: null }]);
  const r = withFakeClaude(PRUNE, ['--dir', dir, '--runs', '2', '--yes'], { mode: 'always' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.calls.length, 2);
  assert.match(r.stdout, /Parse CLI flags with parseArgs from node:util\. \| 2\/2 \/ 0\/2 \| 2\/2 \| Cut: the agent gets it right/);
  assert.equal(registryOf(dir).rules[0].history.length, 2);
});

test('prune --yes keeps a rule the agent still needs; --full re-tests both ways', () => {
  const dir = withRegistry([{ ...spec, history: [past], cut: null }]);
  const keep = withFakeClaude(PRUNE, ['--dir', dir, '--runs', '2', '--yes']);
  assert.match(keep.stdout, /\| 0\/2 \| Keep: without the line the agent still gets it wrong/);
  const full = withFakeClaude(PRUNE, ['--dir', dir, '--runs', '2', '--full', '--yes']);
  assert.equal(full.calls.length, 4);
});

test('--cut removes the approved rule from AGENTS.md and marks it, once', () => {
  const dir = withRegistry([{ ...spec, history: [past], cut: null }]);
  const r = withFakeClaude(PRUNE, ['--dir', dir, '--cut', 'parseArgs']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Removed from AGENTS\.md \(line 6\)/);
  assert.ok(!readFileSync(join(dir, 'AGENTS.md'), 'utf8').includes('parseArgs'));
  assert.equal(registryOf(dir).rules[0].cut.why, 'without the rule 0/2 on claude-sonnet-5');
  const again = withFakeClaude(PRUNE, ['--dir', dir, '--cut', 'parseArgs']);
  assert.equal(again.status, 2);
  assert.match(again.stderr, /No saved rule matches/);
  assert.equal(r.calls.length + again.calls.length, 0);
  assert.ok(existsSync(join(dir, 'docs/rule-tests.json')));
});
