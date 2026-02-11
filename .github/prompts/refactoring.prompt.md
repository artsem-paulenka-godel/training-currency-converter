---
description: "Systematic refactoring workflow for improving code quality without changing behavior"
---

# Refactoring Workflow

Refactor code in the currency converter app safely and incrementally.

**Follow all conventions from `.github/copilot-instructions.md`.**

## Before You Start

1. Run `npm test` — all tests must be green before any refactoring.
2. Read the target file and its co-located tests.

## Refactoring Targets

- Extract reusable logic into `utils/` functions.
- Split large components into smaller presentational components.
- Move business logic out of components into hooks.
- Remove duplication across files.
- Use intention-revealing names; keep functions small (single responsibility).
- Add JSDoc comments only for non-obvious logic.

## Validation

3. Run `npm test` after each change — tests must stay green.
4. Run `npm run test:coverage` at the end to confirm coverage is maintained.
5. If behavior changes were needed, update or add tests first (use `unit-tests.prompt.md`).
6. Update documentation if it is affected by the changes.
