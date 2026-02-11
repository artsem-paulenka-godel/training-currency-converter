---
description: "Systematic bug diagnosis and fix workflow for this project"
---

# Bug Fixing Workflow

Diagnose and fix a bug in the currency converter app using this structured approach.

**Use `.github/copilot-instructions.md` for architecture, data flow, and conventions.**

## Phase 1: Reproduce & Understand

1. Read the bug description and identify the affected area (component, hook, utility, API route).
2. Run `npm test` to see if any existing tests already capture the failure.
3. Trace the data flow path through the relevant layers (see Architecture table in `copilot-instructions.md`).

## Phase 2: Isolate Root Cause

4. Read the source files in the affected area.
5. Check URL param sync if conversion inputs are involved.
6. Check SSR guards if storage is involved.

## Phase 3: Fix & Verify

7. Make the minimal targeted change. Follow existing patterns and project instructions.
8. Write or update a co-located test that covers the bug (use `unit-tests.prompt.md`).
9. Run `npm test` for the affected files to confirm fix and no regressions.
