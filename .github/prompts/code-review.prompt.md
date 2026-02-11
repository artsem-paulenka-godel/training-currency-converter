---
description: "Review code changes against project conventions, catching common issues"
---

# Code Review

Review the given code changes against this project's conventions and best practices.

**Use `.github/copilot-instructions.md` as the authoritative reference for architecture, conventions, and critical gotchas.**

## Review Dimensions

1. **Architecture & Data Flow** — Does the change respect the established layers and data flow?
2. **Type Safety** — No `any`, strict params/returns, proper null handling.
3. **Project Conventions** — Imports, naming, formatting, component patterns.
4. **Testing** — Co-located test exists, follows `jest-testing.instructions.md`.
5. **Critical Gotchas** — Check every item in the "Critical Gotchas" section of `copilot-instructions.md`.

## Output Format

For each finding:

- **File**: affected file path
- **Severity**: 🔴 blocker | 🟡 warning | 🟢 minor
- **Issue**: what's wrong
- **Fix**: how to resolve it
