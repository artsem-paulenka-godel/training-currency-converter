# Implementation Plan: Favorite Currencies

**Branch**: `001-favorite-currencies` | **Date**: 2026-02-15 | **Spec**: [specs/001-favorite-currencies/spec.md](specs/001-favorite-currencies/spec.md)
**Input**: Feature specification from `/specs/001-favorite-currencies/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a Favorite Currencies feature that lets users mark currencies as favorites, shows favorites at the top of both selectors, enforces a maximum of five favorites, and persists the list in localStorage. Implementation will use SSR-safe storage helpers, reuse the CURRENCIES source of truth, and add a simple favorite toggle UI per selector with accessible feedback.

## Technical Context

**Language/Version**: TypeScript (strict) on Next.js 14 App Router  
**Primary Dependencies**: React 18, Next.js 14, Tailwind CSS 3, Jest + Testing Library + jest-axe  
**Storage**: localStorage (SSR-guarded), in-memory fallback when unavailable  
**Testing**: Jest 30, Testing Library, jest-axe  
**Target Platform**: Web (modern browsers, responsive down to 320px)
**Project Type**: Single Next.js web app  
**Performance Goals**: Favorites should render without additional network requests; interactions should feel instantaneous for typical list sizes.  
**Constraints**: Max 5 favorites; must remain accessible, keyboard operable, and SSR-safe.  
**Scale/Scope**: Single-page feature change touching selectors, storage utilities, and tests.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Code Quality: named exports, @/ imports, strict typing, explicit error handling.
- Testing Discipline: behavior-first tests, `userEvent`, tests for each feature/bug fix, coverage >= 80% (excluding layout and type-only files), `jest-axe` in component tests.
- Accessibility by Default: WCAG 2.1 AA or higher, semantic HTML, keyboard support, visible focus, accessible names.
- Reliability & Safety: SSR-safe APIs, timeouts, fallbacks, no silent failures.
- Definition of Done: build/lint/tests green, docs updated, no failing checks.

## Project Structure

### Documentation (this feature)

```text
specs/001-favorite-currencies/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── api/
│   └── rates/
├── globals.css
├── layout.tsx
└── page.tsx
components/
├── CurrencySelect/
├── ConverterForm/
├── SwapButton/
└── ...
hooks/
├── useConverter/
└── useExchangeRates/
types/
utils/
├── currency/
└── storage/
specs/
└── 001-favorite-currencies/
```

**Structure Decision**: Single Next.js app repository. Feature changes live in components, hooks, and utils with co-located tests.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |

## Phase 0 Research

- Research output: [specs/001-favorite-currencies/research.md](specs/001-favorite-currencies/research.md)
- Focus: storage schema, UI toggles compatible with native select, favorites grouping, limit feedback messaging, and storage-unavailable fallback behavior.

## Phase 1 Design

- Data model: [specs/001-favorite-currencies/data-model.md](specs/001-favorite-currencies/data-model.md)
- Contracts: [specs/001-favorite-currencies/contracts/README.md](specs/001-favorite-currencies/contracts/README.md)
- Quickstart: [specs/001-favorite-currencies/quickstart.md](specs/001-favorite-currencies/quickstart.md)

## Post-Design Constitution Check

- Code Quality: PASS (named exports, @/ imports, strict typing planned)
- Testing Discipline: PASS (tests required for feature and a11y checks)
- Accessibility by Default: PASS (native select + labeled toggles + aria-live messaging)
- Reliability & Safety: PASS (SSR-safe storage, malformed-storage handling, explicit error handling)
- Definition of Done: PASS (tests, docs updates required)
