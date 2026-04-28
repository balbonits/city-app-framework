# Schema Migration (LocalStorage / Client-Side)

When evolving data models that are persisted client-side, always include a migration path. Users in the wild already have data in the old shape — silently changing the shape breaks them.

---

## Pattern

```ts
const SCHEMA_VERSION = 2;

function loadData(): AppData {
  const raw = localStorage.getItem('app-data');
  if (!raw) return getDefaultData();

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt data — fall back rather than crash.
    return getDefaultData();
  }

  const version = parsed.schemaVersion || 1;
  if (version < SCHEMA_VERSION) {
    return migrate(parsed, version);
  }

  return parsed;
}

function migrate(data: any, fromVersion: number): AppData {
  let migrated = { ...data };

  if (fromVersion < 2) {
    // example: rename a field
    migrated.newFieldName = migrated.oldFieldName;
    delete migrated.oldFieldName;
  }

  // Each version's migration is additive — they chain through.
  // if (fromVersion < 3) { ... }

  migrated.schemaVersion = SCHEMA_VERSION;
  return migrated;
}
```

---

## Rules

- **Bump the version every time the shape changes.** Even if the change feels minor.
- **Migrations are additive and chain.** A user on v1 going to v3 runs the v1→v2 migration, then v2→v3.
- **Never edit a previous migration after it ships.** Users in the wild ran it; rewriting it breaks them. Add a new step instead.
- **Test migrations explicitly.** Snapshot the old shape, run migration, assert the new shape.
- **Ship a fallback.** If parse fails entirely, fall back to default state rather than crashing.
- **Log migrations during dev.** `console.info('Migrated app-data from v1 to v2')` so you can spot breakage in console.

---

## When to skip

Speed Run Mode: throwaway personal tools where you'd rather wipe the data than write a migration. State this explicitly in the project's `AGENTS.md` so future-you doesn't trip over it.

---

## When to graduate beyond this pattern

If you find yourself writing 5+ migrations or the data model gets relational (cross-references, joins), it's time for IndexedDB with a real migration library (Dexie, idb-keyval) or a backend. LocalStorage was never meant for serious data.
