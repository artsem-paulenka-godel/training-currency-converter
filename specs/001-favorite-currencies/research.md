# Research: Favorite Currencies

## Decision 1: Favorites storage schema

- Decision: Store favorites in localStorage under a dedicated key as a JSON array of currency codes ordered by most-recently-favorited first.
- Rationale: Simple, deterministic ordering; easy to validate against CURRENCIES; minimal storage footprint.
- Alternatives considered: Object map with timestamps (more metadata but higher complexity); store in URL params (pollutes share URLs).

## Decision 2: UI pattern for toggling favorites

- Decision: Add a favorite toggle button next to each currency selector that toggles the currently selected currency.
- Rationale: Works with native select elements, avoids custom listbox complexity, and keeps the feature accessible.
- Alternatives considered: Custom dropdown with per-option toggles (increases complexity and accessibility risk); dedicated management panel (extra UI surface).

## Decision 3: Favorites display in selectors

- Decision: Render a Favorites optgroup at the top of the native select, followed by the full list.
- Rationale: Uses built-in select semantics, keeps keyboard behavior native, and provides clear visual separation.
- Alternatives considered: Duplicate items without grouping (harder to scan); separate list outside the select (less discoverable).

## Decision 4: Limit feedback

- Decision: When at the limit, prevent adding a new favorite and show an inline message announced via `aria-live`.
- Rationale: Clear, accessible feedback without blocking interactions.
- Alternatives considered: Modal dialog (too heavy), silent failure (violates Reliability & Safety).

## Decision 5: Storage-unavailable behavior

- Decision: If `localStorage` is unavailable (SSR, private mode restrictions, or blocked storage), keep favorites in in-memory state for the active session and show a non-persistent-state message.
- Rationale: Preserves core feature usability while communicating persistence limitations.
- Alternatives considered: Disable favorites entirely (poor UX); fail silently (violates Reliability & Safety).
