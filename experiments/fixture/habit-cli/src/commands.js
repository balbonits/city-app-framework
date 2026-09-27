import { load, save } from './store.js';
import { currentStreak, toDay } from './streak.js';

export function add(name) {
  const data = load();
  if (data.habits.some((h) => h.name === name)) return `"${name}" already exists`;
  data.habits.push({ name, done: [] });
  save(data);
  return `Added "${name}"`;
}

export function done(name, today = new Date()) {
  const data = load();
  const habit = data.habits.find((h) => h.name === name);
  if (!habit) return `No habit named "${name}"`;
  const day = toDay(today);
  if (!habit.done.includes(day)) habit.done.push(day);
  save(data);
  return `Marked "${name}" done for ${day}`;
}

export function list(today = new Date()) {
  const { habits } = load();
  if (habits.length === 0) return 'No habits yet. Add one with: habit add <name>';
  return habits
    .map((h) => `${h.name.padEnd(20)} streak: ${currentStreak(h.done, today)}`)
    .join('\n');
}
