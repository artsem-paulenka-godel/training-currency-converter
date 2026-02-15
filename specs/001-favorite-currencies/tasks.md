---
description: "Task list for Favorite Currencies"
---

# Tasks: Favorite Currencies

**Input**: Design documents from `/specs/001-favorite-currencies/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for every feature and bug fix unless explicitly exempted with rationale.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure test and tooling baselines are ready for favorites work

- [x] T001 Review localStorage test utilities and update mocks if needed in jest.setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and types required by all user stories

- [x] T002 Add favorites storage helpers (get/save/clear + validation) in utils/storage/storage.ts
- [x] T003 [P] Add FavoriteList/FavoriteEntry types in types/index.ts
- [x] T004 [P] Add/reuse currency validation helper (supported code check) in utils/currency/currency.ts
- [x] T005 [P] Add unit tests for favorites storage helpers in utils/storage/storage.test.ts

**Checkpoint**: Favorites storage and validation utilities are available for UI integration.

---

## Phase 3: User Story 1 - Mark and view favorites (Priority: P1) 🎯 MVP

**Goal**: Let users mark/unmark favorites and see them at the top of both selectors.

**Independent Test**: Mark a currency as favorite and verify it appears in the Favorites group in both selectors.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST and ensure they fail before implementation**

- [x] T006 [P] [US1] Update components/CurrencySelect/CurrencySelect.test.tsx to verify Favorites optgroup ordering, accessible labeling, and `jest-axe` no-violations checks
- [x] T007 [P] [US1] Add component tests for favorite toggle keyboard behavior and `jest-axe` checks in components/FavoriteToggle/FavoriteToggle.test.tsx
- [x] T022 [P] [US1] Add initial mark/unmark/order behavior tests in hooks/useFavorites/useFavorites.test.ts

### Implementation for User Story 1

- [x] T008 [P] [US1] Create FavoriteToggle component in components/FavoriteToggle/FavoriteToggle.tsx
- [x] T009 [US1] Extend components/CurrencySelect/CurrencySelect.tsx to accept favorites and render a Favorites optgroup
- [x] T010 [US1] Create favorites state hook in hooks/useFavorites/useFavorites.ts and wire it to app/page.tsx
- [x] T011 [US1] Update components/ConverterForm/ConverterForm.tsx to render FavoriteToggle and pass favorites to CurrencySelect

**Checkpoint**: Favorites can be added/removed and appear at the top of both selectors.

---

## Phase 4: User Story 2 - Enforce favorite limit (Priority: P2)

**Goal**: Prevent more than five favorites and show accessible feedback.

**Independent Test**: Add five favorites and attempt a sixth; the sixth is rejected and a limit message appears.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T012 [P] [US2] Add limit enforcement tests to hooks/useFavorites/useFavorites.test.ts
- [x] T013 [P] [US2] Add aria-live limit message test in components/ConverterForm/ConverterForm.test.tsx

### Implementation for User Story 2

- [x] T014 [US2] Implement limit enforcement and error state in hooks/useFavorites/useFavorites.ts
- [x] T015 [US2] Render limit message with aria-live in components/ConverterForm/ConverterForm.tsx

**Checkpoint**: Favoriting beyond five is blocked with clear accessible feedback.

---

## Phase 5: User Story 3 - Persist favorites across sessions (Priority: P3)

**Goal**: Restore favorites from localStorage and handle storage-unavailable cases.

**Independent Test**: Add favorites, reload the page, and confirm favorites persist; verify in-session behavior when storage is unavailable.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T016 [P] [US3] Add persistence and malformed-data tests in utils/storage/storage.test.ts
- [x] T017 [P] [US3] Add persistence, malformed-storage, and storage-unavailable tests in hooks/useFavorites/useFavorites.test.ts

### Implementation for User Story 3

- [x] T018 [US3] Load/persist favorites in hooks/useFavorites/useFavorites.ts using storage helpers
- [x] T019 [US3] Add non-persistent-state message when storage is unavailable in components/ConverterForm/ConverterForm.tsx
- [x] T023 [US3] Add non-persistent-state message test in components/ConverterForm/ConverterForm.test.tsx

**Checkpoint**: Favorites persist across reloads and degrade gracefully when storage is blocked.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and documentation updates

- [x] T020 [P] Update README.md with Favorite Currencies feature description
- [x] T021 Run quickstart validation steps in specs/001-favorite-currencies/quickstart.md
- [x] T024 Run `npm run test:ci` and confirm coverage gate remains >= 80%
- [x] T025 Run `npm run build` and `npm run lint` before merge
- [x] T026 [US1] Move favorite toggles into CurrencySelect trailing star icon and simplify ConverterForm layout
- [x] T027 [US1] Refactor CurrencySelect to use FavoriteToggle SVG-only icon and adjust selector padding in components/CurrencySelect/CurrencySelect.tsx and components/FavoriteToggle/FavoriteToggle.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 for favorites UI/state
- **User Story 3 (P3)**: Depends on Foundational and User Story 1 for favorites state persistence

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Storage and validation helpers before UI integration
- Hook logic before UI wiring
- Story complete before moving to next priority

### Parallel Opportunities

- T003, T004, T005 can run in parallel after T002 begins
- T006, T007, and T022 can run in parallel
- T012 and T013 can run in parallel
- T016, T017, and T023 can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Update components/CurrencySelect/CurrencySelect.test.tsx to verify Favorites optgroup ordering and accessible labeling"
Task: "Add component test for favorite toggle in components/FavoriteToggle/FavoriteToggle.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Foundation ready (Setup + Foundational)
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish Polish & cross-cutting tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Avoid vague tasks or cross-story dependencies that break independence
