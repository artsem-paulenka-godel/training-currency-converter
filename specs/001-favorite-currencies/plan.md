# Implementation Plan: Favorite Currencies

**Branch**: `001-favorite-currencies` | **Date**: 2025-12-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-favorite-currencies/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a "Favorite Currencies" feature allowing users to mark up to 5 currencies as favorites. Favorites will appear at the top of currency dropdown selects with visual distinction (star icon, highlighted background). Favorites persist in browser localStorage with cross-tab synchronization and graceful degradation when storage is unavailable.

**Technical Approach**: Modify the existing `Favorites` class in `utils/favorites.ts` to enforce the 5-item limit (currently 20), add limit feedback mechanism, and update `CurrencySelect` component to display user feedback when limit is reached.

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 18+  
**Primary Dependencies**: Next.js 14 (App Router), React 18.3, Tailwind CSS 3.4  
**Storage**: Browser localStorage (key: `tcc.favorites`)  
**Testing**: Jest 30+, React Testing Library, jest-axe for accessibility  
**Target Platform**: Web (modern browsers with localStorage support)  
**Project Type**: Web application (Next.js App Router - single project structure)  
**Performance Goals**: Instant UI response (<100ms for add/remove operations)  
**Constraints**: Maximum 5 favorites, localStorage quota limits, SSR hydration compatibility  
**Scale/Scope**: Single-page currency converter, ~10 components, client-side only favorites

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Gate Status: ✅ PASS

| Gate | Requirement | Plan Compliance |
|------|-------------|-----------------|
| **Code Quality** | ESLint zero errors, TSC strict mode | All changes in `.ts`/`.tsx` files, no `any` types, existing lint/type configs apply |
| **Tests** | Unit tests for utils/hooks, integration for components | `utils/favorites.test.ts` (update), `components/CurrencySelect.test.tsx` (update) |
| **Coverage** | 80% overall, 90% critical utilities | Target 90%+ for `utils/favorites.ts`, 80%+ for component tests |
| **Performance** | No blocking UX, instant feedback | localStorage ops are sync <1ms, no network calls |

### Validation Commands

```bash
npm run lint          # Zero errors required
npx tsc --noEmit      # Zero errors required  
npm run test          # All tests pass
npm run test:coverage # 80% overall, 90% utils/
```

## Project Structure

### Documentation (this feature)

```
specs/001-favorite-currencies/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API endpoints)
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
# Next.js App Router Structure (existing)
app/
├── layout.tsx           # Root layout
├── page.tsx             # Main converter page
├── globals.css          # Global styles
└── api/
    └── rates/
        └── route.ts     # Exchange rates API

components/
├── CurrencySelect.tsx   # ⚡ MODIFY: Add limit feedback UI
├── CurrencySelect.test.tsx # ⚡ MODIFY: Add limit tests
├── ConverterForm.tsx    # Currency conversion form
├── AmountInput.tsx      # Amount input field
├── SwapButton.tsx       # Currency swap button
├── ConversionResult.tsx # Result display
└── index.ts             # Component exports

utils/
├── favorites.ts         # ⚡ MODIFY: Change MAX_ITEMS 20→5, add limit feedback
├── favorites.test.ts    # ⚡ MODIFY: Update tests for 5-item limit
├── currency.ts          # Currency utilities
└── storage.ts           # Storage utilities

hooks/
├── useConverter.ts      # Conversion logic hook
└── useExchangeRates.ts  # Rates fetching hook

types/
└── index.ts             # Shared type definitions
```

**Structure Decision**: Using existing Next.js App Router structure. This feature modifies existing files (`utils/favorites.ts`, `components/CurrencySelect.tsx`) rather than creating new architectural elements. Tests are co-located with source files.

## Complexity Tracking

_No constitution violations. Feature follows existing patterns._

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| State Management | Existing `Favorites` class singleton | Maintains simplicity principle, already handles cross-tab sync |
| UI Feedback | Toast/inline message for limit | Lightweight, no external dependencies |
| Storage | localStorage (existing) | Already implemented, meets requirements |
