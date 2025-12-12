# Feature Specification: Favorite Currencies

**Feature Branch**: `001-favorite-currencies`  
**Created**: 2025-12-12  
**Status**: Draft  
**Input**: User description: "Add a Favorite Currencies feature: Users can mark currencies as favorites, Favorites appear at the top of currency selects, Maximum 5 favorites, Favorites persist in localStorage"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mark Currency as Favorite (Priority: P1)

As a user, I want to mark a currency as a favorite so that I can quickly access it in future conversions without scrolling through the full currency list.

**Why this priority**: This is the core functionality that enables the entire favorites feature. Without the ability to add favorites, no other features can work.

**Independent Test**: Can be fully tested by selecting a currency and clicking the favorite icon, then verifying the currency is added to the favorites list and the icon changes to indicate favorited status.

**Acceptance Scenarios**:

1. **Given** a currency is selected in the dropdown, **When** the user clicks the star/favorite icon, **Then** the currency is added to favorites and the star icon becomes filled/highlighted
2. **Given** a currency is already favorited, **When** the user clicks the star/favorite icon, **Then** the currency is removed from favorites and the star icon becomes unfilled/outline
3. **Given** a user has 5 favorites already, **When** the user tries to add a 6th favorite, **Then** the system prevents the addition and displays feedback that the maximum limit is reached

---

### User Story 2 - View Favorites at Top of List (Priority: P1)

As a user, I want my favorite currencies to appear at the top of the currency dropdown so that I can quickly select them without searching.

**Why this priority**: This is the primary value proposition of favorites - quick access. Users expect favorites to be prominently displayed.

**Independent Test**: Can be tested by adding currencies to favorites and opening the dropdown to verify favorites appear at the top with visual distinction.

**Acceptance Scenarios**:

1. **Given** the user has marked currencies as favorites, **When** the user opens the currency dropdown, **Then** favorite currencies appear at the top of the list before non-favorite currencies
2. **Given** the user has favorites, **When** viewing the dropdown, **Then** favorite currencies are visually distinguished from regular currencies (star icon prefix and/or highlighted background)
3. **Given** the user has no favorites, **When** opening the dropdown, **Then** all currencies appear in their default order

---

### User Story 3 - Persist Favorites Across Sessions (Priority: P2)

As a user, I want my favorite currencies to be saved so that they are still available when I return to the application.

**Why this priority**: Persistence enhances user experience by maintaining preferences, but the core marking and display features are more critical for initial functionality.

**Independent Test**: Can be tested by adding favorites, closing the browser/tab, reopening the application, and verifying favorites are restored.

**Acceptance Scenarios**:

1. **Given** the user has added currencies to favorites, **When** the user refreshes the page or returns later, **Then** the favorites are still present
2. **Given** localStorage is unavailable or disabled, **When** the user adds favorites, **Then** the favorites work for the current session without errors (graceful degradation)
3. **Given** the user removes a favorite, **When** the user refreshes the page, **Then** the removed favorite is no longer present

---

### Edge Cases

- What happens when localStorage storage quota is exceeded? The system should gracefully handle the error and continue to work with in-memory favorites for the current session.
- What happens when localStorage contains invalid or corrupted data? The system should reset to an empty favorites list and not crash.
- What happens when the user's favorite currency is removed from the supported currencies list? The system should gracefully exclude it from the displayed favorites.
- How does the system handle cross-tab synchronization? Changes to favorites in one tab should reflect in other open tabs of the same application.

## Requirements _(mandatory)_

## Constitution Check (required)

Before finalizing this spec, declare how the change maps to the project constitution (`.specify/memory/constitution.md`):

- **Code Quality**: ESLint and TypeScript strict mode will run. All code must pass `npm run lint` and `npx tsc --noEmit`. Rules defined in existing ESLint config and `tsconfig.json`.
- **Tests**: 
  - Unit tests: `utils/favorites.test.ts` (favorites logic), `components/CurrencySelect.test.tsx` (component behavior)
  - Integration tests: Test favorites persistence and cross-component state synchronization
- **Coverage**: Target 90% coverage for `utils/favorites.ts` (critical utility), 80% for component tests. This is a new feature with comprehensive test scenarios.
- **Performance**: No specific benchmarks required. Feature involves only localStorage operations which are synchronous and fast for small data sets (5 items max).

### Functional Requirements

- **FR-001**: System MUST allow users to mark any supported currency as a favorite by clicking a star/favorite icon
- **FR-002**: System MUST allow users to remove a currency from favorites by clicking the star icon when already favorited
- **FR-003**: System MUST limit the maximum number of favorites to 5 currencies
- **FR-004**: System MUST display a visual indicator (feedback message or UI change) when the user attempts to exceed the 5-favorite limit
- **FR-005**: System MUST display favorite currencies at the top of the currency dropdown list, before non-favorite currencies
- **FR-006**: System MUST visually distinguish favorite currencies in the dropdown (star icon prefix and/or highlighted background)
- **FR-007**: System MUST persist favorites to localStorage using a consistent storage key
- **FR-008**: System MUST load favorites from localStorage on application startup (client-side hydration)
- **FR-009**: System MUST gracefully handle localStorage unavailability or errors without crashing
- **FR-010**: System MUST synchronize favorites across browser tabs using storage events
- **FR-011**: System MUST validate currency codes (3 uppercase letters) before adding to favorites

### Key Entities

- **Favorite**: A user-selected currency code (3-letter uppercase string) stored in a list. Maximum 5 entries. Persisted in localStorage under the key `tcc.favorites`.
- **Currency**: Represents a supported currency with a code (e.g., "USD") and name (e.g., "US Dollar"). Source of valid currency codes for favorites.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can add or remove a currency from favorites within 1 second (single click interaction)
- **SC-002**: Favorite currencies appear at the top of the dropdown immediately upon opening (no delay)
- **SC-003**: 100% of favorites persist correctly across page refreshes and browser restarts
- **SC-004**: System prevents adding more than 5 favorites with clear user feedback
- **SC-005**: Application continues to function normally when localStorage is unavailable (graceful degradation)
- **SC-006**: Test coverage for favorites utility functions reaches 90% or higher
- **SC-007**: All acceptance scenarios pass automated testing

## Assumptions

- Users interact with the application using modern browsers that support localStorage
- The existing currency list (`CURRENCIES` array) contains all valid currency codes
- The storage key `tcc.favorites` is unique to this application and will not conflict with other data
- The star icon is a universally understood symbol for "favorite" functionality
- Users understand that favorites are stored locally in their browser and are not synced across devices
