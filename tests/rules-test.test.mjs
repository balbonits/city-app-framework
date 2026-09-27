// Tests for /city-app:rules:test (scripts/rules-test.mjs). A fake `claude` on PATH stands in for
// real sessions, so nothing here uses the model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, readlinkSync, chmodSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { copyProject, matchingLines, runCheck, verdict, withRule, withoutRule } from '../scripts/lib/rules.mjs';

const SCRIPT = new URL('../scripts/rules-test.mjs', import.meta.url).pathname;
const tmp = (prefix) => mkdtempSync(join(tmpdir(), prefix));

const AGENTS = `# app

## Gotchas

- Tests must point HABITS_FILE at a temp file.
- Parse CLI flags with parseArgs from node:util.

## Working agreement

1. Do what was asked.
`;

test('a rule already in the file: "without" drops that line, "with" keeps the file as is', () => {
  assert.deepEqual(matchingLines(AGENTS, 'Parse CLI flags with parseArgs'), [6]);
  assert.equal(withRule(AGENTS, 'Parse CLI flags with parseArgs'), AGENTS);
  const without = withoutRule(AGENTS, '- Parse CLI flags with parseArgs from node:util.');
  assert.ok(!without.includes('parseArgs'));
  assert.ok(without.includes('Tests must point HABITS_FILE'));
});

test('rules match on their words, ignoring backticks, list markers and case', () => {
  const text = '## Rules\n\n7. Parse CLI flags with `parseArgs` from `node:util`.\n';
  assert.deepEqual(matchingLines(text, 'parse cli flags with parseArgs from node:util'), [3]);
  assert.equal(withoutRule(text, 'Parse CLI flags with parseArgs'), '## Rules\n\n');
});

test('a new rule goes at the end of Gotchas, or at the end of the file, without a doubled marker', () => {
  const added = withRule(AGENTS, 'Lead with what I need to decide.');
  assert.match(added, /- Parse CLI flags with parseArgs from node:util\.\n- Lead with what I need to decide\.\n\n## Working agreement/);
  assert.equal(withoutRule(AGENTS, 'Lead with what I need to decide.'), AGENTS);
  assert.equal(withRule('# app\n\nSome text.\n', '- Use pnpm.'), '# app\n\nSome text.\n\n- Use pnpm.\n');
  assert.equal(withRule('', 'Use pnpm.'), '- Use pnpm.\n');
});

test('verdicts: keep, cut, make it a check, or unclear', () => {
  assert.match(verdict({ passed: 5, runs: 5 }, { passed: 0, runs: 5 }), /^The rule works.*Keep it\.$/);
  assert.match(verdict({ passed: 3, runs: 3 }, { passed: 3, runs: 3 }), /already does this.*cut it.*Only 3 runs each/);
  assert.match(verdict({ passed: 0, runs: 3 }, { passed: 0, runs: 3 }), /doesn't reliably fix it.*\/city-app:lesson/);
  assert.match(verdict({ passed: 0, runs: 5 }, { passed: 5, runs: 5 }), /does worse with the rule/);
  assert.match(verdict({ passed: 3, runs: 5 }, { passed: 2, runs: 5 }), /^Unclear/);
  assert.equal(verdict({ passed: 0, runs: 0 }, { passed: 0, runs: 3 }), 'No finished runs to compare.');
});

function gitProject() {
  const dir = tmp('rt-src-');
  mkdirSync(join(dir, 'src'));
  mkdirSync(join(dir, 'node_modules/leftpad'), { recursive: true });
  writeFileSync(join(dir, 'node_modules/leftpad/index.js'), 'module.exports = 1;\n');
  writeFileSync(join(dir, '.gitignore'), 'node_modules/\n.env\n');
  writeFileSync(join(dir, '.env'), 'SECRET=1\n');
  writeFileSync(join(dir, 'src/cli.js'), 'const args = process.argv.slice(2);\n');
  writeFileSync(join(dir, 'AGENTS.md'), AGENTS);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'init'], { cwd: dir });
  writeFileSync(join(dir, 'NOTES.md'), 'untracked but not ignored\n');
  return dir;
}

test('copies tracked and new files, leaves ignored ones out, links node_modules, commits a clean tree', () => {
  const src = gitProject();
  const dest = join(tmp('rt-copy-'), 'app');
  const { linked } = copyProject(src, dest, (d) => writeFileSync(join(d, 'AGENTS.md'), withoutRule(AGENTS, 'parseArgs')));
  assert.equal(linked, true);
  assert.ok(existsSync(join(dest, 'src/cli.js')) && existsSync(join(dest, 'NOTES.md')));
  assert.equal(existsSync(join(dest, '.env')), false);
  assert.ok(lstatSync(join(dest, 'node_modules')).isSymbolicLink());
  assert.equal(readlinkSync(join(dest, 'node_modules')), join(src, 'node_modules'));
  assert.ok(!readFileSync(join(dest, 'AGENTS.md'), 'utf8').includes('parseArgs'));
  assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: dest, encoding: 'utf8' }), '');
});

test('copies a folder that is not a git repo too', () => {
  const src = tmp('rt-plain-');
  mkdirSync(join(src, 'src'));
  writeFileSync(join(src, 'src/a.js'), 'x\n');
  const dest = join(tmp('rt-copy-'), 'app');
  assert.equal(copyProject(src, dest).linked, false);
  assert.ok(existsSync(join(dest, 'src/a.js')));
});

test('a check passes on exit code 0, in the copy folder', () => {
  const dir = tmp('rt-check-');
  writeFileSync(join(dir, 'marker'), '');
  assert.equal(runCheck(dir, 'test -f marker'), true);
  assert.equal(runCheck(dir, 'grep -q nope marker'), false);
});

// A stand-in for `claude -p`: follows the parseArgs rule only when AGENTS.md has it.
function fakeClaude(mode = 'follow') {
  const bin = tmp('rt-bin-');
  writeFileSync(join(bin, 'claude'), `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify({ cwd: process.cwd(), prompt: args[args.indexOf('-p') + 1], args }) + '\\n');
if (${JSON.stringify(mode)} === 'crash') process.exit(1);
const rules = fs.existsSync('AGENTS.md') ? fs.readFileSync('AGENTS.md', 'utf8') : '';
fs.writeFileSync('src/cli.js', rules.includes('parseArgs') ? "import { parseArgs } from 'node:util';\\n" : 'const args = process.argv.slice(2);\\n');
console.log(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: 'done' }));
`);
  chmodSync(join(bin, 'claude'), 0o755);
  return bin;
}

function rulesTest(project, extra, { mode, log = join(tmp('rt-log-'), 'calls.jsonl') } = {}) {
  const r = spawnSync('node', [SCRIPT, '--dir', project, '--rule', 'Parse CLI flags with parseArgs', '--task', 'Add a --limit flag.',
    '--check', 'grep -rqw parseArgs src', ...extra], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${fakeClaude(mode)}:${process.env.PATH}`, FAKE_LOG: log },
  });
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  return { ...r, calls };
}

test('without --yes it starts no sessions and says how many a real run takes', () => {
  const r = rulesTest(gitProject(), ['--runs', '2']);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.calls.length, 0);
  assert.match(r.stdout, /Already in AGENTS\.md \(line 6\)/);
  assert.match(r.stdout, /1\. fails\n/);
  assert.match(r.stdout, /Ready: 4 test sessions \(2 with the rule, 2 without\)\. Nothing has run yet/);
});

test('with --yes it runs both arms in neutral folders, scores them, and keeps node_modules safe', () => {
  const project = gitProject();
  const work = tmp('rt-work-');
  const r = rulesTest(project, ['--runs', '2', '--yes', '--work', work]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /with rule {6}2\/2\nwithout rule {3}0\/2/);
  assert.match(r.stdout, /The rule works/);
  assert.match(r.stdout, /4 test session\(s\) run/);
  assert.equal(r.calls.length, 4);
  for (const call of r.calls) {
    assert.equal(call.prompt, 'Add a --limit flag.');
    assert.doesNotMatch(call.cwd, /with/);
    assert.ok(call.args.join(' ').includes('Bash(npm install *)'), 'installs are blocked when node_modules is shared');
  }
  assert.ok(existsSync(join(project, 'node_modules/leftpad/index.js')), 'cleanup must not delete through the link');
  assert.deepEqual(readdirSync(work).sort(), ['1.jsonl', '2.jsonl', '3.jsonl', '4.jsonl', 'results.json']);
  assert.equal(JSON.parse(readFileSync(join(work, 'results.json'), 'utf8')).results.length, 4);
});

test('runs that never finish are not counted', () => {
  const r = rulesTest(gitProject(), ['--runs', '1', '--yes'], { mode: 'crash' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /didn't finish \(not counted\)/);
  assert.match(r.stdout, /No finished runs to compare\./);
});

test('refuses missing inputs and rule text that matches more than one line', () => {
  const project = gitProject();
  const noCheck = spawnSync('node', [SCRIPT, '--dir', project, '--rule', 'x', '--task', 'y'], { encoding: 'utf8' });
  assert.equal(noCheck.status, 2);
  assert.match(noCheck.stderr, /Missing --check/);
  const vague = spawnSync('node', [SCRIPT, '--dir', project, '--rule', 'a', '--task', 'y', '--check', 'true'], { encoding: 'utf8' });
  assert.equal(vague.status, 2);
  assert.match(vague.stderr, /matches \d+ lines in AGENTS\.md/);
});

test('warns when CLAUDE.md does not import AGENTS.md, since the rule would never load', () => {
  const project = gitProject();
  writeFileSync(join(project, 'CLAUDE.md'), 'Be nice.\n');
  const r = rulesTest(project, []);
  assert.match(r.stdout, /CLAUDE\.md doesn't import AGENTS\.md/);
});
