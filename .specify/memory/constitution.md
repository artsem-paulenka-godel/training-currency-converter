<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: template placeholders -> I. Code Quality, II. Testing Discipline, III. Accessibility by Default, IV. Reliability & Safety, V. Definition of Done
- Added sections: Project Standards, Workflow & Quality Gates
- Removed sections: None
- Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
- Deferred TODOs: None
-->

# training-currency-converter Constitution

## Core Principles

### I. Code Quality (Non-Negotiable)

- Modules MUST be small, focused, and single-purpose; prefer composition over large files.
- Exports MUST be named; default exports are not allowed.
- Imports MUST use the @/ alias for app code; no deep relative imports outside a component folder.
- TypeScript MUST remain strict; avoid `any` and prefer explicit, narrow types.
- Errors MUST be handled explicitly with clear user-facing or logged messages; no silent failures.
  Rationale: Consistent structure and explicit contracts keep the codebase maintainable and safe.
  Enforcement: PR review checks module size, exports, import paths, and type safety for every change.

### II. Testing Discipline (Non-Negotiable)

- Tests MUST be behavior-first and reflect user outcomes, not implementation details.
- `userEvent` MUST be used for interactions; `fireEvent` is disallowed.
- Every feature and bug fix MUST include tests covering the change.
- Minimum 80% line coverage is required; exclude layout files and type-only files from coverage.
- Component tests MUST include `jest-axe` checks and pass `toHaveNoViolations`.
  Rationale: Reliable behavior is proven through tests, not assumed from implementation.
  Enforcement: CI fails on coverage or test violations; PRs without tests are blocked.

### III. Accessibility by Default (Non-Negotiable)

- UI changes MUST meet WCAG 2.1 AA (or higher) requirements.
- Use semantic HTML first; ARIA only when native semantics are insufficient.
- All interactive elements MUST be keyboard operable with visible focus.
- Visible labels and accessible names MUST match; no unlabeled controls.
- Component tests MUST include `jest-axe` checks for accessibility regressions.
  Rationale: Accessibility is a baseline quality requirement, not an optional enhancement.
  Enforcement: PR reviews verify semantics, focus behavior, labels, and a11y tests where applicable.

### IV. Reliability & Safety (Non-Negotiable)

- Browser APIs MUST be SSR-safe with explicit `window`/`document` guards.
- Network flows MUST have timeouts and defined fallbacks; never hang silently.
- Errors MUST be surfaced to users or logged with actionable context.
- Data transformations MUST be deterministic and validated (e.g., currency codes, amounts).
  Rationale: Users rely on predictable behavior under real-world failures.
  Enforcement: Review and tests verify SSR safety, timeouts, and fallback behavior.

### V. Definition of Done (Non-Negotiable)

- Build, lint, and tests MUST pass before merge.
- Documentation MUST be updated when behavior, APIs, or workflows change.
- No merge is allowed with failing checks or unresolved review comments.
- Performance and accessibility regressions MUST be addressed before release.
  Rationale: Shipping quality requires explicit, repeatable completion criteria.
  Enforcement: Merge protection rules and reviewer sign-off enforce completion gates.

## Project Standards

- Stack is fixed: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Jest.
- New dependencies require justification and must not weaken performance, accessibility, or testing.
- Currency support MUST be driven by the shared utilities and source-of-truth data.

## Workflow & Quality Gates

- Each plan MUST include a Constitution Check aligned with these principles.
- Each feature MUST include test tasks and a verification checklist.
- Accessibility checks MUST be part of UI change reviews.
- Releases MUST document user-visible changes and known limitations.

## Governance

- This constitution supersedes local conventions and informal practices.
- Amendments require a documented proposal, rationale, and version bump by semver rules.
- Versioning policy: MAJOR for breaking governance changes, MINOR for new principles,
  PATCH for clarifications and non-semantic edits.
- Compliance is reviewed in PRs; deviations require explicit, documented approval.

**Version**: 1.0.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15
