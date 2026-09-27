// Lesson (docs/lessons.md): streaks broke for people west of UTC when one file used local dates.
// Days are UTC everywhere, and this test keeps it that way.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const LOCAL_DATE = /\.(getDate|getDay|getMonth|getFullYear|setDate|toLocaleDateString|toDateString)\(/;
const dir = new URL('../public/', import.meta.url);

test('app code uses UTC days, never local-time dates', () => {
  const problems = readdirSync(dir).filter((f) => f.endsWith('.js')).flatMap((file) =>
    readFileSync(new URL(file, dir), 'utf8').split('\n').flatMap((line, i) => (LOCAL_DATE.test(line)
      ? [`public/${file}:${i + 1} uses a local-time date method. Use dayKey() from public/streak.js instead: days are UTC, and local dates broke streaks for people west of UTC.`]
      : [])));
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});
