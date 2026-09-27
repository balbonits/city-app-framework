#!/usr/bin/env node
// Checks a session transcript (stream-json lines) for "tests first": the first file written that is
// a test must come before the first file written that isn't a test, spec or config.
//   node tests-first.mjs <transcript.jsonl>
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST = /(^|\/)(test|tests|__tests__)\/|\.(test|spec)\.[cm]?[jt]sx?$/;
const NOT_CODE = /(^|\/)(docs\/|AGENTS\.md$|CLAUDE\.md$|README\.md$|package(-lock)?\.json$|\.gitignore$|\.claude\/)/;

export function testsFirst(events) {
  const writes = events.filter((e) => e.type === 'assistant').flatMap((e) => e.message?.content ?? [])
    .filter((c) => c.type === 'tool_use' && ['Write', 'Edit', 'MultiEdit'].includes(c.name))
    .map((c) => c.input?.file_path ?? '');
  const firstTest = writes.findIndex((f) => TEST.test(f));
  const firstCode = writes.findIndex((f) => !TEST.test(f) && !NOT_CODE.test(f));
  return firstTest !== -1 && (firstCode === -1 || firstTest < firstCode);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const events = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
  const ok = testsFirst(events);
  console.log(ok ? 'ok   tests were written before the code' : 'FAIL code was written before any test');
  process.exit(ok ? 0 : 1);
}
