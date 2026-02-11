---
description: "Audit a component for WCAG 2.2 AA accessibility compliance and generate fixes"
---

# Accessibility Audit

Audit the specified component for accessibility issues and generate fixes.

**Follow all rules from `.github/instructions/a11y.instructions.md`** — use its Final verification checklist as the review baseline.

## Workflow

1. **Automated**: Run the component's existing test — verify `jest-axe` `toHaveNoViolations` passes. If no axe test exists, add one following `unit-tests.prompt.md` conventions.
2. **Manual review**: Walk through the a11y instructions checklist (structure & semantics, keyboard & focus, controls & labels, forms, contrast, forced colors, reflow, graphics, tables/grids) against the component's markup.
3. **Project patterns**: Check `SwapButton.tsx` for `aria-label` reference, Tailwind `focus:ring-*` for focus indicators, and `aria-live` / `role="status"` for dynamic announcements.

## Output

For each issue found:

- **Element**: component/element description
- **WCAG**: criterion violated (e.g., 1.1.1, 2.1.1, 1.4.3)
- **Issue**: what's wrong
- **Fix**: code change to resolve it
