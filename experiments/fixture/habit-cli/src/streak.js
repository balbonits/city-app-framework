const DAY = 24 * 60 * 60 * 1000;

export function toDay(date) {
  return date.toISOString().slice(0, 10);
}

export function currentStreak(doneDays, today = new Date()) {
  const days = new Set(doneDays);
  let streak = 0;
  let cursor = new Date(`${toDay(today)}T00:00:00Z`);
  while (days.has(toDay(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY);
  }
  return streak;
}
