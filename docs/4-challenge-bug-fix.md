# Bug Fixing 🟡 Intermediate

**Objective**: Fix a UX bug using AI-assisted debugging.

---

## 📖 Background

Bug fixing is a discipline that should feel portable between projects: capture the issue, isolate the regression, land a verified patch. When Copilot is part of the workflow, the process becomes even more repeatable—automated summaries surface the root cause faster, generated tests guard against regressions, and prompt templates keep triage consistent.

### Why it matters

- Keeps Copilot grounded with the same context (logs, repro steps, fixtures) engineers rely on, so suggested patches align with real-world constraints
- Turns debugging into an iterative loop: Copilot drafts hypotheses, you validate, then refine prompts with new evidence
- Encourages every fix to ship with executable proof (tests, scripts) that Copilot can reuse on future incidents
- Builds a living knowledge base of edge cases and mitigations that Copilot can cite when similar bugs reappear

### Bug Fixing Best Practices

- **Reproduce early**: capture deterministic steps, input data, and screenshots before touching code
- **Instrument the fix**: lean on unit tests plus lightweight logging to validate both the failure and the patch
- **Guard against regressions**: backfill missing tests, and run the suite (or focused watch targets) locally before shipping
- **Document edge cases**: highlight currency/business rules directly in PR descriptions or inline comments when logic is non-obvious
- **Automate verification**: add npm scripts or prompt templates so any engineer (or copilot) can rerun the scenario quickly

### Problem

Users can select the same currency in both "From" and "To" dropdowns (e.g., USD → USD), making conversion meaningless.

### Expected Behavior

When user selects a currency that matches the opposite dropdown, automatically swap values to keep currencies different.

### Files Overview

| Action | Path                                      |
| ------ | ----------------------------------------- |
| Modify | `hooks/useConverter/useConverter.ts`      |
| Test   | `hooks/useConverter/useConverter.test.ts` |

## 🎯 Your Task

### Step 1: Understand the Bug

1. Open `hooks/useConverter/useConverter.ts`
2. Find the currency change handlers
3. Test the bug manually in the app

### Step 2: Fix with AI Assistance

1. Use the example prompt (or your own)
2. Ask Copilot to fix the bug
3. Review the proposed changes

### Step 3: Add Tests

1. Add unit tests for the new swap behavior
2. Test both `handleFromChange` and `handleToChange`
3. Ensure existing tests still pass

### Step 4: Verify

1. Run full test suite: `npm test`
2. Test manually in the browser
3. Confirm no regressions

### Example Prompt

```
Fix bug in hooks/useConverter/useConverter.ts:

Problem: Users can select same currency in From and To dropdowns.

Expected: When selecting a currency equal to the opposite side,
automatically swap the currencies.

Example:
- From: USD, To: EUR
- User changes To to USD
- Result: From becomes EUR, To becomes USD (swapped)

Add tests for this behavior in useConverter/useConverter.test.ts
```

---

## ✅ Success Criteria

- [ ] Cannot select same currency in both dropdowns
- [ ] Currencies swap when duplicate selected
- [ ] All tests pass: `npm test`
- [ ] No regressions in existing functionality

---

[← Back to Challenges](challenges.md)
