# Component Splitting

If a component or module exceeds 120-150 lines, strongly consider extracting sub-components or utility functions.

---

## Why 120-150

Past that line count, scrolling and grokking start to fight you. Smaller pieces are easier to test in isolation, easier to reuse, easier to understand without context. The number is a heuristic, not a law — 130 lines that flow naturally beat 90 lines split awkwardly.

---

## When it especially applies

- Complex UI components (forms, dashboards, charts, data tables)
- Game systems (physics, collision, rendering)
- Data transformation pipelines
- Anything with deep nesting (3+ levels of conditionals or loops)

---

## When to ignore the rule

- Throwaway prototypes (Speed Run Mode)
- A single tightly-coupled flow where splitting would obscure the data flow
- Files that are mostly type definitions or constants (length doesn't carry the same cognitive cost)
- Tests (length comes from coverage, not complexity)

---

## How to split

Look for:

1. **Repeated structure.** The same JSX shape rendered with different props → extract a sub-component.
2. **Independent concerns.** A render block that doesn't depend on the rest of the component's state → extract.
3. **Long event handlers.** A handler that does 30+ lines of logic before calling state → pull into a util or hook.
4. **Large derived data.** `useMemo` blocks > 20 lines → pull into a hook.
5. **Conditionals with bodies.** A `{condition && <BigBlock />}` where `BigBlock` is more than 10 lines → extract `BigBlock`.

When you split, name the new piece for what it does, not where it came from. `ProjectCard` is better than `ProjectsListItemInner`. The reader shouldn't need the parent to understand the child.

---

## What not to do

- **Don't split just to hit a line target.** A 120-line component that's clear is better than a 60-line one with three arbitrary helpers that obscure the flow.
- **Don't extract single-use components when they're tightly coupled to their parent.** Inline is fine when the child has no independent identity.
- **Don't introduce abstraction in the same change as the split.** First make it smaller, then (separately) consider whether it should be reusable.
