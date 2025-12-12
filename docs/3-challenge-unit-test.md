# Unit Testing 🟢 Beginner

**Objective**: Write unit tests for `ConversionHistory` component using AI assistance.

---

## 📖 Background

Unit tests ensure components behave correctly in isolation. This project uses:

- **Jest** as the test runner
- **@testing-library/react** for component testing
- **Co-located tests** (`.tsx` + `.test.tsx` in same folder)

### Files Overview

| Action | Path |
|--------|------|
| Test | `components/ConversionHistory.tsx` |
| Create | `components/ConversionHistory.test.tsx` |
| Reference | `components/AmountInput.test.tsx` |

### Test Categories to Cover

1. **Rendering** — Empty state, history list, clear button visibility
2. **Interactions** — Toggle, clear, load conversion callbacks
3. **Content** — Amount, currencies, rate, timestamp display
4. **Edge cases** — Empty array, multiple items

## 🎯 Your Task

### Step 1: Review the Component

1. Open `components/ConversionHistory.tsx`
2. Understand the props and behavior
3. Check the reference test file `components/AmountInput.test.tsx`

### Step 2: Write Tests with AI

1. Use the example prompt above (or create your own)
2. Ask Copilot to generate tests for the component
3. Review the generated tests for completeness

### Step 3: Run and Verify

1. Run tests: `npm test -- ConversionHistory`
2. Check coverage: `npm test -- --coverage ConversionHistory`
3. Ensure all edge cases are covered

### Example Prompt

```
**Objective**: Create comprehensive unit tests for the `ConversionHistory` component with 100% coverage.

## Files

- **Component to Test**: `components/ConversionHistory.tsx`
- **Test File to Create**: `components/ConversionHistory.test.tsx`

## Testing Stack

- Library: @testing-library/react
- Assertion: @testing-library/jest-dom
- Runner: Jest (already configured)

## What to Test

### 1. Conditional Rendering

- Clear button visibility
- Empty state display
- History list visibility

### 2. Button Interactions & Callbacks

- `onToggle` callback
- `onClear` callback
- `onLoadConversion` callback

### 3. Dynamic Content

- Toggle button text based on `showHistory` prop
- History count display

### 4. Conversion Data Rendering

- Amount display
- Currency codes
- Exchange rate
- Timestamp formatting

### 5. Edge Cases

- Empty history array
- Multiple conversion items
- Different timestamp formats

## Success Criteria

1. All tests pass: `npm test -- ConversionHistory`
2. Coverage shows 100%: `npm test -- --coverage ConversionHistory`
3. Follow same code style as existing test files

## Reference Files

Use these as examples:

- `components/AmountInput.test.tsx` - Test structure
- `components/ConverterForm.test.tsx` - Complex interactions
```

---

## ✅ Success Criteria

- [ ] Tests pass: `npm test -- ConversionHistory`
- [ ] 100% coverage: `npm test -- --coverage ConversionHistory`
- [ ] Follows project test patterns

---

[← Back to Challenges](challenges.md)
