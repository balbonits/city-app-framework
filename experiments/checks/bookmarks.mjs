#!/usr/bin/env node
// Hidden checks for the bookmark CLI spec (the E7 task), run in the project folder: add, list
// newest first with ids, --tag filter, rm, ids never reused. Exits 0 only if every check passes.
import { acceptance } from '../lib/score.mjs';

const result = acceptance.bm(process.cwd());
for (const [check, ok] of Object.entries(result)) if (check !== 'pass') console.log(`${ok ? 'ok  ' : 'FAIL'} ${check}`);
process.exit(result.pass ? 0 : 1);
