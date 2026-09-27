// Streak math in UTC calendar days. A habit's history is a sorted list of 'YYYY-MM-DD' days.

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const dayBefore = (day) => {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return dayKey(date);
};

// Days in a row, ending today, or yesterday if today isn't done yet.
export function currentStreak(days, today = dayKey()) {
  const done = new Set(days);
  let day = done.has(today) ? today : dayBefore(today);
  let streak = 0;
  while (done.has(day)) {
    streak++;
    day = dayBefore(day);
  }
  return streak;
}

export const toggleDay = (days, day = dayKey()) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort());

export const streakLabel = (n) => (n === 0 ? 'No streak yet' : `${n}-day streak`);
