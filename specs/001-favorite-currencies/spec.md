# Feature Specification: Favorite Currencies

**Feature Branch**: `001-favorite-currencies`  
**Created**: 2026-02-15  
**Status**: Draft  
**Input**: User description: "Add Favorite Currencies feature: Users can mark currencies as favorites; Favorites appear at top of selectors; Maximum 5 favorites; Persist in localStorage."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mark and view favorites (Priority: P1)

As a user, I can mark currencies as favorites so I can find them quickly in the currency selectors.

**Why this priority**: This delivers the primary value of faster selection without any other dependencies.

**Independent Test**: Can be tested by marking a currency as a favorite and verifying it appears at the top of both selectors.

**Acceptance Scenarios**:

1. **Given** the currency selectors are visible, **When** I mark USD as a favorite, **Then** USD appears in the favorites section at the top of both selectors.
2. **Given** a currency is already a favorite, **When** I unmark it, **Then** it is removed from the favorites section and remains in the main list.
3. **Given** the favorite control is focused, **When** I toggle it using the keyboard, **Then** the favorite state changes and focus remains visible.

---

### User Story 2 - Enforce favorite limit (Priority: P2)

As a user, I can manage up to five favorites and receive clear feedback if I try to exceed the limit.

**Why this priority**: The limit prevents the list from losing focus and ensures a predictable experience.

**Independent Test**: Can be tested by favoriting five currencies and attempting to add a sixth, verifying the sixth is not added and feedback is shown.

**Acceptance Scenarios**:

1. **Given** I already have five favorites, **When** I try to add another, **Then** the system does not add it and shows a limit message that is readable by assistive technology.

---

### User Story 3 - Persist favorites across sessions (Priority: P3)

As a user, I can return later and see my favorites without re-selecting them.

**Why this priority**: Persistence makes the feature useful over time.

**Independent Test**: Can be tested by adding favorites, refreshing the page, and confirming the same favorites appear.

**Acceptance Scenarios**:

1. **Given** I have favorited currencies, **When** I reload the page, **Then** the same favorites appear at the top of both selectors.
2. **Given** `localStorage` is unavailable or blocked, **When** I use favorites, **Then** the feature still works for the current session and a non-persistent-state message is shown.

---

### Edge Cases

- Adding a sixth favorite does not change existing favorites and communicates the limit.
- Duplicate favorites are ignored (a currency can only be favorited once).
- If saved favorites include a currency that is no longer supported, it is skipped without breaking the selectors.
- If persisted favorites data is malformed, the system falls back safely without breaking the selectors.
- If `localStorage` is unavailable or blocked, the feature still works for the session and informs the user that favorites will not persist.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users MUST be able to mark and unmark any supported currency as a favorite.
- **FR-002**: Favorites MUST appear at the top of both currency selectors, visually separated from the full list, and use the same deterministic order in both selectors.
- **FR-003**: The system MUST enforce a maximum of five favorites.
- **FR-004**: When the favorite limit is reached, the system MUST prevent adding more and present a clear, accessible message.
- **FR-005**: Favorite selections MUST persist in `localStorage` after each change and restore on next visit when storage is available.
- **FR-006**: If stored favorites are malformed, invalid, or unsupported, the system MUST ignore them and continue normally.
- **FR-007**: All favorite controls MUST be keyboard operable with visible focus and accessible names.

### Assumptions and Dependencies

- Favorites are stored per browser/device and do not sync across devices.
- If `localStorage` is unavailable, favorites remain for the current session only and the user is informed.
- Only supported currency codes can be favorited; unsupported codes are ignored.

### Key Entities _(include if feature involves data)_

- **FavoriteList**: Collection of favorited currency codes with a saved display order.
- **FavoriteEntry**: Single supported currency code in the favorites collection.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In usability validation, at least 95% of users can mark or unmark a favorite within 10 seconds without assistance.
- **SC-002**: Favorites appear at the top of both selectors in 100% of sessions where favorites exist.
- **SC-003**: The system never stores more than five favorites, verified across manual and automated tests.
- **SC-004**: Favorites persist across a page reload in 100% of sessions where storage is available.
- **SC-005**: When `localStorage` is unavailable, the feature remains usable in-session with no uncaught runtime errors.
