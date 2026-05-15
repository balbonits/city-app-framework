# Domain Quartet

When a project has multiple domain entities (Event, Venue, User, etc.), give each one matching files across infrastructure layers — components, API helpers, mocks, types.

---

## The pattern

For each domain `X`, a project has:

```text
Components/X/        # UI: feature components, forms, lists, detail views
Helpers/XApi.ts      # API: fetch / post functions for the entity
Mocks/mockX.ts       # Mock data + mock API functions
Types/xTypes.ts      # Type definitions, default values, variants
```

```mermaid
flowchart TB
    classDef domain fill:#1e293b,stroke:#0f172a,color:#ffffff,stroke-width:3px
    classDef ui fill:#1e40af,stroke:#1e3a8a,color:#ffffff,stroke-width:2px
    classDef api fill:#7c2d12,stroke:#9a3412,color:#ffffff,stroke-width:2px
    classDef mock fill:#854d0e,stroke:#713f12,color:#ffffff,stroke-width:2px
    classDef types fill:#065f46,stroke:#064e3b,color:#ffffff,stroke-width:2px

    Domain(["fa:fa-cube  <b>Domain entity X</b><br/><i>e.g. Event, Booking, User</i>"]):::domain
    UI["fa:fa-window-maximize  <b>Components/X/</b><br/>UI components, forms, lists"]:::ui
    API["fa:fa-plug  <b>Helpers/XApi.ts</b><br/>fetch / post functions"]:::api
    Mock["fa:fa-vial  <b>Mocks/mockX.ts</b><br/>mock data + functions"]:::mock
    Types["fa:fa-tags  <b>Types/xTypes.ts</b><br/>types, defaults, variants"]:::types

    Domain --> UI
    Domain --> API
    Domain --> Mock
    Domain --> Types
    UI -.->|reads| Types
    API -.->|reads| Types
    Mock -.->|implements| API
```

Adding a new domain entity is a four-file checklist. Removing one means deleting the matching set.

Cross-cutting infrastructure (UI atoms in `Components/UI/`, layouts, contexts, routes) does *not* get a quartet — only domain entities.

---

## Why

- **Predictable.** "Where does X live?" has a four-line answer instead of a tour.
- **Symmetric.** Adding or removing a domain is one concept across the codebase, not five locations to remember.
- **AI-navigable.** "Look at how `Event` is wired" gives an agent four files in known locations rather than a hunt across the tree.
- **Mock/real parity falls out naturally.** With `Mocks/mockX.ts` always paired with `Helpers/XApi.ts` of the same shape, swapping one for the other is one-for-one. See `conventions/mock-api.md` if you adopt that pattern.

---

## Example

For an `Event` domain entity:

```text
Components/Event/
  EventCard.tsx
  EventDetail.tsx
  EventForms/
    SelectEventType.tsx
    EventInfo.tsx
    Confirm.tsx
Helpers/EventApi.ts          # getEvent, listEvents, createEvent, ...
Mocks/mockEvents.ts          # mockEvents array + MockAPI.Events.* fns
Types/eventTypes.ts          # Event, EventWithPopulated, defaultEvent
```

A new `Booking` domain mirrors the structure exactly: `Components/Booking/`, `Helpers/BookingApi.ts`, `Mocks/mockBookings.ts`, `Types/bookingTypes.ts`.

---

## When to skip

- **Single-domain apps.** If everything is one entity, the quartet is theater.
- **Throwaway prototypes.** Speed Run Mode skips it.
- **Pre-domain projects.** If the domain entities aren't known yet, don't pre-allocate folders.
- **Tiny domains.** A "Tag" entity that's a single string field doesn't need its own quartet — it can live as a sub-type of whatever domain owns it.

---

## When to extend

If a domain needs more layers (workers, schemas, state slices, route bundles), add them — but apply the new layer to *all* domains, not just one. Asymmetric expansion erodes the predictability that's the entire point of the pattern.

---

## What this is not

- **Not a framework requirement.** It's a file-organization pattern. Stack-agnostic — works in React, Vue, Svelte, even non-frontend code with the right rename.
- **Not a microservice boundary.** This is in-repo, not deploy/runtime separation.
- **Not "all domains are equal."** Domains can vary in size; the quartet just guarantees a minimum surface area for each.
