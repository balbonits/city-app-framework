#!/usr/bin/env node
// Stop guard: the agent can't finish while the test suite is red.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const payload = JSON.parse(readFileSync(0, 'utf8'));
if (payload.stop_hook_active) process.exit(0);

const run = spawnSync('npm', ['test', '--silent'], {
  cwd: process.env.CLAUDE_PROJECT_DIR ?? payload.cwd,
  encoding: 'utf8',
  timeout: 120_000,
});

if (run.status !== 0) {
  const tail = `${run.stdout}\n${run.stderr}`.trim().split('\n').slice(-25).join('\n');
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `npm test is failing. Fix it before finishing.\n\n${tail}`,
  }));
}
