import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = () => process.env.HABITS_FILE ?? 'habits.json';

export function load() {
  if (!existsSync(file())) return { habits: [] };
  return JSON.parse(readFileSync(file(), 'utf8'));
}

export function save(data) {
  writeFileSync(file(), JSON.stringify(data, null, 2) + '\n');
}
