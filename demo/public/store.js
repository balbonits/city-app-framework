// Habits live in this browser's localStorage: [{ name, days: ['YYYY-MM-DD', ...] }].
const KEY = 'habit-streaks';

export function load(storage = globalThis.localStorage) {
  try {
    return JSON.parse(storage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export const save = (habits, storage = globalThis.localStorage) => storage.setItem(KEY, JSON.stringify(habits));
