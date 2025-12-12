# Bug Fixing 🟡 Intermediate

**Objective**: Fix a UX bug using AI-assisted debugging.

---

## 📖 Background

### Problem

Users can select the same currency in both "From" and "To" dropdowns (e.g., USD → USD), making conversion meaningless.

### Expected Behavior

When user selects a currency that matches the opposite dropdown, automatically swap values to keep currencies different.

### Files Overview

| Action | Path |
|--------|------|
| Modify | `hooks/useConverter.ts` |
| Test | `hooks/useConverter.test.ts` |

## 🎯 Your Task

### Step 1: Understand the Bug

1. Open `hooks/useConverter.ts`
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
Fix bug in hooks/useConverter.ts:

Problem: Users can select same currency in From and To dropdowns.

Expected: When selecting a currency equal to the opposite side,
automatically swap the currencies.

Example:
- From: USD, To: EUR
- User changes To to USD
- Result: From becomes EUR, To becomes USD (swapped)

Add tests for this behavior in useConverter.test.ts
```

---

## ✅ Success Criteria

- [ ] Cannot select same currency in both dropdowns
- [ ] Currencies swap when duplicate selected
- [ ] All tests pass: `npm test`
- [ ] No regressions in existing functionality

---

[← Back to Challenges](challenges.md)
