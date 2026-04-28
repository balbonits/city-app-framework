# Anti-Overengineering

The operational rules behind "less is more." When in doubt, default to less.

These are ported and refined from v1's `wiki/Anti-Overengineering.md`. They're the practical implementation of the v2 "Simplicity Scales" principle.

---

## The four rules

### 1. Build exactly what's asked for

```ts
// Overengineered: generic form builder when asked for a login form
interface FormBuilder<T> {
  fields: FormField<T>[];
  validation: ValidationConfig<T>;
  transforms: TransformPipeline<T>;
}

// Right-sized: actual login form
interface LoginForm {
  email: string;
  password: string;
}
```

### 2. Prefer simple solutions

```ts
// Overengineered: custom state hook with caching, persistence, validation
const useAdvancedState = <T>(config: StateConfig<T>) => { /* ... */ };

// Simple: useState
const [user, setUser] = useState<User | null>(null);
```

### 3. Abstract only after 3+ identical patterns exist

```ts
// Too early: first usage, already abstracted
const createDataHook = <T>(endpoint: string) => { /* ... */ };

// Wait for the pattern to emerge
const useUsers = () => fetch('/users');
const usePosts = () => fetch('/posts');
const useComments = () => fetch('/comments');
// NOW consider: const useData = <T>(endpoint: string)
```

### 4. Stop at working

```ts
// Works, ship it
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// Don't anticipate future needs
const formatDate = (
  date: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
  timezone?: string,
  fallback?: string
) => { /* ... */ };
```

---

## Common temptations to resist

### "What if" syndrome

Tempted to add `sortConfig: SortConfig` because "what if we need to sort by other fields"? Don't. Sort by what was asked. If the next ask is "now also sort by author," refactor then.

### "Future flexibility" trap

Tempted to add `themeConfig: ThemeConfig` because "we might want themes someday"? Don't. Pick a theme. If "someday" arrives, refactor.

### "While I'm in here"

Tempted to fix that adjacent thing you noticed? Don't. Surface it as a `BACKLOG.md` item or ADR. The unrelated change pollutes the diff and the commit message and makes review harder.

### Premature error handling

Tempted to wrap everything in try/catch? Don't. Handle errors at boundaries (user input, external APIs, file system). Internal code can throw; let it.

### Premature memoization

Tempted to wrap every callback in `useCallback` and every value in `useMemo`? Don't. Profile first. Most of the time it's net-negative because the memoization itself costs.

---

## When to override

These rules are defaults, not laws. Override when:

- The simple version would actively break (security hole, data loss, accessibility-blocking).
- The user explicitly asks for the more elaborate version.
- Three identical patterns already exist and the abstraction is overdue.
- You're at a system boundary where validation/error-handling is non-negotiable.

When you override, say so in the response: "I'm adding error handling here because the user input crosses a trust boundary."

---

## Suggesting vs implementing

The rules above are about what you *implement*. They are not about what you *mention*.

If, while doing the requested work, you notice a clear adjacent improvement — a duplicated pattern that could be extracted, a likely future footgun, an obvious next step — say so in your response. Don't silently add it.

Good:

> Done. While I was in here I noticed `formatDate` is now used in 4 places — worth extracting? Also, the new endpoint has no rate limit yet; should I add one?

Bad:

> [silently extracts `formatDate` into a util, silently adds rate limiting, ships a 6-file diff for what was a 1-file ask]

The line is: suggestion-as-text is encouraged. Silent scope expansion is not. The human gets to decide which suggestions are worth picking up — usually some are, some aren't, some go to `BACKLOG.md` for later.

---

## Why these rules

Every line of code is a liability. Every abstraction is a guess about the future. Most guesses are wrong. The framework that ships, gets used, and learns from real friction beats the framework that anticipates everything.

Less code → fewer bugs → easier to read → easier to change.

Frameworks that try to be flexible up front rarely fit when the real shape arrives. Frameworks that fit the current shape and refactor as needed accumulate fewer wrong guesses.
