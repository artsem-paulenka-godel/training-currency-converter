# Tasks: Favorite Currencies

**Input**: Design documents from `/specs/001-favorite-currencies/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Tests are MANDATORY per constitution (90% coverage for critical utilities, 80% overall).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in all descriptions

## Path Conventions

- **Project type**: Next.js App Router (single project)
- **Components**: `components/`
- **Utilities**: `utils/`
- **Hooks**: `hooks/`
- **Types**: `types/`
- **Tests**: Co-located with source files (`*.test.ts`, `*.test.tsx`)

---

## Phase 1: Setup

**Purpose**: Verify existing infrastructure and prepare for implementation

- [x] T001 Verify branch is `001-favorite-currencies` and dependencies are installed
- [x] T002 [P] Run `npm run lint` to confirm zero errors baseline
- [x] T003 [P] Run `npx tsc --noEmit` to confirm zero type errors baseline
- [x] T004 [P] Run `npm run test` to confirm all existing tests pass

**Checkpoint**: Development environment ready, all gates passing

---

## Phase 2: Foundational (Core Favorites Logic)

**Purpose**: Update `Favorites` class with 5-item limit and feedback mechanisms - BLOCKS all user stories

**⚠️ CRITICAL**: UI changes cannot begin until this phase is complete

### Tests for Foundational (MANDATORY)

- [x] T005 [P] Update test for MAX_ITEMS limit (5 items) in `utils/favorites.test.ts`
- [x] T006 [P] Add test for `add()` returning `false` when limit reached in `utils/favorites.test.ts`
- [x] T007 [P] Add test for `add()` returning `false` for duplicate currency in `utils/favorites.test.ts`
- [x] T008 [P] Add test for `isFull()` method returning correct boolean in `utils/favorites.test.ts`

### Implementation for Foundational

- [x] T009 Update `MAX_ITEMS` constant from 20 to 5 in `utils/favorites.ts`
- [x] T010 Modify `add()` method to return `boolean` (true=success, false=limit/duplicate) in `utils/favorites.ts`
- [x] T011 Add `isFull()` method to check if favorites count equals MAX_ITEMS in `utils/favorites.ts`
- [x] T012 Run `npm run test` to verify all foundational tests pass

**Checkpoint**: Favorites class updated with 5-item limit, all tests green

---

## Phase 3: User Story 1 - Mark Currency as Favorite (Priority: P1) 🎯 MVP

**Goal**: Users can click star icon to add/remove currency from favorites with limit enforcement

**Independent Test**: Click star on currency, verify icon changes and currency added to favorites. Try adding 6th favorite, verify warning appears.

### Tests for User Story 1 (MANDATORY)

- [x] T013 [P] [US1] Add test for star icon toggle (filled/outline) based on favorite status in `components/CurrencySelect.test.tsx`
- [x] T014 [P] [US1] Add test for limit warning message appearing when 5 favorites exist and user clicks star in `components/CurrencySelect.test.tsx`
- [x] T015 [P] [US1] Add test for warning message disappearing after timeout or when slot available in `components/CurrencySelect.test.tsx`

### Implementation for User Story 1

- [x] T016 [US1] Add `showLimitWarning` state to track when to display limit feedback in `components/CurrencySelect.tsx`
- [x] T017 [US1] Update `toggleFavorite` handler to check `add()` return value and set warning state in `components/CurrencySelect.tsx`
- [x] T018 [US1] Add inline warning message UI (e.g., "Maximum 5 favorites reached") below star button in `components/CurrencySelect.tsx`
- [x] T019 [US1] Add auto-dismiss timeout (3 seconds) for warning message in `components/CurrencySelect.tsx`
- [x] T020 [US1] Style warning message with Tailwind (text-amber-600, text-sm) in `components/CurrencySelect.tsx`
- [x] T021 [US1] Run `npm run test` to verify User Story 1 tests pass

**Checkpoint**: User Story 1 complete - users can add/remove favorites with limit feedback

---

## Phase 4: User Story 2 - View Favorites at Top of List (Priority: P1)

**Goal**: Favorite currencies appear at top of dropdown with visual distinction

**Independent Test**: Add currencies to favorites, open dropdown, verify favorites appear first with star prefix and highlighted background.

### Tests for User Story 2 (MANDATORY)

- [x] T022 [P] [US2] Add test verifying favorites render before non-favorites in dropdown in `components/CurrencySelect.test.tsx`
- [x] T023 [P] [US2] Add test for star emoji prefix (⭐) on favorite options in `components/CurrencySelect.test.tsx`
- [x] T024 [P] [US2] Add test for highlighted background style on favorite options in `components/CurrencySelect.test.tsx`

### Implementation for User Story 2

- [x] T025 [US2] Verify favorites are rendered first in dropdown (already implemented, confirm behavior) in `components/CurrencySelect.tsx`
- [x] T026 [US2] Verify star emoji prefix on favorite options (already implemented, confirm behavior) in `components/CurrencySelect.tsx`
- [x] T027 [US2] Verify highlighted background styling (already implemented, confirm yellow-50 background) in `components/CurrencySelect.tsx`
- [x] T028 [US2] Run `npm run test` to verify User Story 2 tests pass

**Checkpoint**: User Story 2 complete - favorites display prominently at top with visual distinction

---

## Phase 5: User Story 3 - Persist Favorites Across Sessions (Priority: P2)

**Goal**: Favorites persist in localStorage and restore on page load

**Independent Test**: Add favorites, refresh page, verify favorites are restored. Disable localStorage, verify graceful degradation.

### Tests for User Story 3 (MANDATORY)

- [x] T029 [P] [US3] Add test for favorites persisting after simulated page refresh in `utils/favorites.test.ts`
- [x] T030 [P] [US3] Add test for graceful degradation when localStorage throws error in `utils/favorites.test.ts`
- [x] T031 [P] [US3] Add test for cross-tab synchronization via storage event in `utils/favorites.test.ts`
- [x] T032 [P] [US3] Add test for invalid/corrupted localStorage data handling in `utils/favorites.test.ts`

### Implementation for User Story 3

- [x] T033 [US3] Verify localStorage persistence on add/remove (already implemented) in `utils/favorites.ts`
- [x] T034 [US3] Verify graceful degradation with `useLocalStorage` flag (already implemented) in `utils/favorites.ts`
- [x] T035 [US3] Verify storage event listener for cross-tab sync (already implemented) in `utils/favorites.ts`
- [x] T036 [US3] Verify SSR hydration pattern in component (already implemented) in `components/CurrencySelect.tsx`
- [x] T037 [US3] Run `npm run test` to verify User Story 3 tests pass

**Checkpoint**: User Story 3 complete - favorites persist across sessions with graceful degradation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [x] T038 [P] Run `npm run lint` to verify zero linting errors
- [x] T039 [P] Run `npx tsc --noEmit` to verify zero type errors
- [ ] T040 Run `npm run test:coverage` to verify 90%+ coverage for `utils/favorites.ts`
- [ ] T041 Run `npm run test:coverage` to verify 80%+ overall coverage
- [ ] T042 [P] Manual test: add 5 favorites, try adding 6th, verify warning appears
- [ ] T043 [P] Manual test: refresh page, verify favorites persist
- [ ] T044 [P] Manual test: open two tabs, add favorite in one, verify it appears in other
- [ ] T045 Update README.md with Favorite Currencies feature description
- [ ] T046 Run quickstart.md validation checklist

**Checkpoint**: All gates passing, feature complete and documented

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
┌───────────────────────────────────────┐
│  User Stories can run in parallel:    │
│  Phase 3 (US1) ─┐                     │
│  Phase 4 (US2) ─┼─→ All depend on     │
│  Phase 5 (US3) ─┘   Phase 2 only      │
└───────────────────────────────────────┘
    ↓
Phase 6 (Polish) ← Depends on all stories complete
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Mark Favorite) | Phase 2 (Foundational) | US2, US3 |
| US2 (View at Top) | Phase 2 (Foundational) | US1, US3 |
| US3 (Persistence) | Phase 2 (Foundational) | US1, US2 |

### Within Each Phase

1. Tests marked [P] can run in parallel
2. Implementation tasks follow test completion
3. Verification task runs last

---

## Parallel Execution Examples

### Phase 2 (Foundational Tests)

```bash
# All foundational tests can run in parallel:
T005: Update test for MAX_ITEMS limit
T006: Add test for add() returning false when limit reached
T007: Add test for add() returning false for duplicate
T008: Add test for isFull() method
```

### User Stories (After Phase 2)

```bash
# With multiple developers, all stories can start simultaneously:
Developer A: Phase 3 (US1 - Mark as Favorite)
Developer B: Phase 4 (US2 - View at Top) 
Developer C: Phase 5 (US3 - Persistence)
```

### Phase 6 (Polish)

```bash
# All verification tasks can run in parallel:
T038: npm run lint
T039: npx tsc --noEmit
T042: Manual test - limit warning
T043: Manual test - persistence
T044: Manual test - cross-tab sync
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational (5-item limit, `add()` return, `isFull()`)
3. ✅ Complete Phase 3: User Story 1 (limit warning UI)
4. **STOP and VALIDATE**: Test add/remove with limit enforcement
5. Deploy/demo MVP

### Incremental Delivery

| Increment | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Users can mark favorites with limit |
| +1 | US1 + US2 | Favorites prominently displayed |
| Complete | US1 + US2 + US3 | Full persistence and sync |

### Single Developer Path

```
T001→T004 → T005→T012 → T013→T021 → T022→T028 → T029→T037 → T038→T046
  Setup   → Foundational →   US1    →    US2    →    US3    →  Polish
```

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 46 |
| **Phase 1 (Setup)** | 4 |
| **Phase 2 (Foundational)** | 8 |
| **Phase 3 (US1)** | 9 |
| **Phase 4 (US2)** | 7 |
| **Phase 5 (US3)** | 9 |
| **Phase 6 (Polish)** | 9 |
| **Parallelizable Tasks** | 24 |
| **MVP Scope** | Phases 1-3 (21 tasks) |

---

## Notes

- Most US2/US3 implementation tasks are verification of existing code
- Primary new code: `MAX_ITEMS=5`, `add()` return type, `isFull()`, limit warning UI
- Tests must fail before implementation (TDD)
- Commit after each task or logical group
- Run lint/type/test gates after each phase
