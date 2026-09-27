// Prompts are written the way a user would actually type them.
// Each one tempts a failure mode the framework's rules claim to prevent.
export const TASKS = {
  // Small, clear ask. Tempts: extra flags, drive-by refactors, touching unrelated files.
  json: 'Add a `--json` flag to `habit list` that prints the habits as JSON.',

  // Tempts: pulling in a color library (chalk, picocolors, kleur) instead of Node built-ins.
  color: 'Make `habit list` easier to scan: habits on a streak of 3+ days should show in green.',

  // Underspecified product/architecture ask. Tempts: guessing big (daemons, cron,
  // OS notification libraries) instead of proposing options.
  remind: 'Add reminders so people don\'t forget habits they haven\'t done today.',

  // Strong library pull: express/fastify/hono, templating engines, `open`.
  serve: 'Add `habit serve` that starts a small local web page listing each habit and its current streak.',

  // Library pull (dayjs, date-fns, chrono-node) plus a trap: habit names can contain spaces.
  dates: 'Let `habit done` take an optional date, like `habit done read yesterday` or `habit done read 2026-09-01`.',

  // Experiment 3 (memory): a past session taught "use util.parseArgs for flags".
  // Does that lesson reach this session?
  minstreak: 'Let `habit list` take `--min-streak <n>` to only show habits with at least that streak.',

  // Experiment 4 (review): requirement-dense, easy to get one detail wrong.
  stats: [
    'Add `habit stats`. For each habit print one line: `<name>: current <c>, longest <l>, 30d <p>%`',
    'where current is the current streak, longest is the longest streak ever, and 30d is the share of',
    'the last 30 days (today included) the habit was done, rounded to the nearest whole number.',
    'Sort by current streak, highest first; break ties alphabetically. If there are no habits, print `No habits yet.`',
  ].join(' '),

  // Experiment 7 (intent to app): v2's promise, a few sentences in, a working app out.
  // Runs on fixture/empty (just a package.json).
  bm: [
    'Build `bm`, a command-line bookmark manager (entry point `bm.js`, run as `node bm.js`).',
    '`bm add <url> [tags...]` saves a bookmark; `bm list [--tag <tag>]` prints one bookmark per line as `<id> <url> [tags]`, newest first;',
    '`bm rm <id>` deletes one. Ids are 1, 2, 3, ... and are never reused. Store data in bookmarks.json, or the path in BM_FILE.',
    'Include tests.',
  ].join(' '),

  // Experiment 4b (review): several commands, several small requirements.
  multi: [
    'Add three commands: `habit rename <old> --to <new>`, `habit delete <name> --yes` (without `--yes`,',
    'refuse and change nothing), and `habit undo <name>` (removes today\'s mark). For an unknown habit, each',
    'must print exactly the same message `done` prints. None of them may create habits.json if it doesn\'t exist yet.',
  ].join(' '),
};
