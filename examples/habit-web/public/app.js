import { currentStreak, dayKey, streakLabel, toggleDay } from './streak.js';
import { load, save } from './store.js';

const form = document.querySelector('#add-form');
const input = document.querySelector('#habit-name');
const list = document.querySelector('#habits');
const empty = document.querySelector('#empty');
let habits = load();

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
    save(habits);
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
  save(habits);
  input.value = '';
  render();
});

render();
