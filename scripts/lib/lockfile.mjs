import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Recursively returns a copy of an object/array with the keys of every object sorted,
// so JSON.stringify output is stable across runs and platforms.
export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]),
    );
  }
  return value;
}

export const sha256File = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const PROJECT_FILES = new Set(['AGENTS.md', 'CLAUDE.md', 'package.json', '.gitignore']);

// Files copied from kit/.claude/ are kit-owned; the scaffold files are project-owned.
export const ownerFor = (rel) => (PROJECT_FILES.has(rel) ? 'project' : 'kit');

// Writes .city-app.json with sorted keys at every level, 2-space indent, trailing newline.
// files: { 'relative/with/slashes': { sha256, owner } }
export function writeLockfile(dir, { kitVersion, answers, files }) {
  const lock = sortKeys({ kitVersion, answers, files });
  writeFileSync(join(dir, '.city-app.json'), `${JSON.stringify(lock, null, 2)}\n`);
}
