import { currentStreak, dayKey, streakLabel, toggleDay } from './streak.js';
import { load, save } from './store.js';

const form = document.querySelector('#add-form');
const input = document.querySelector('#habit-name');
const list = document.querySelector('#habits');
const empty = document.querySelector('#empty');

// ?demo shows sample habits and saves nothing: handy for screenshots and the UI checks.
const demo = new URLSearchParams(location.search).has('demo');
const daysAgo = (n) => dayKey(new Date(Date.now() - n * 86_400_000));
const sample = () => [
  { name: 'Read 10 pages', days: [daysAgo(2), daysAgo(1), daysAgo(0)] },
  { name: 'Stretch', days: [daysAgo(5), daysAgo(4), daysAgo(3), daysAgo(2), daysAgo(1)] },
  { name: 'Drink a glass of water first thing', days: [] },
];
let habits = demo ? sample() : load();
const store = (next) => { if (!demo) save(next); };

function habitItem(habit, index, today) {
  const item = document.createElement('li');
  item.className = 'habit';

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = habit.name;

  const streak = document.createElement('span');
  streak.className = 'streak';
  streak.textContent = streakLabel(currentStreak(habit.days, today));

  const done = document.createElement('button');
  done.type = 'button';
  done.className = 'done';
  done.setAttribute('aria-pressed', String(habit.days.includes(today)));
  const which = document.createElement('span');
  which.className = 'sr-only';
  which.textContent = `: ${habit.name}`;
  done.append('Done today', which);
  done.addEventListener('click', () => {
    habits[index] = { ...habit, days: toggleDay(habit.days, today) };
    store(habits);
    render();
  });

  item.append(name, streak, done);
  return item;
}

function render() {
  const today = dayKey();
  list.replaceChildren(...habits.map((habit, i) => habitItem(habit, i, today)));
  empty.hidden = habits.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  habits = [...habits, { name, days: [] }];
  store(habits);
  input.value = '';
  render();
});

render();
