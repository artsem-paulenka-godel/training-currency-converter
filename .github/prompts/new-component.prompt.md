---
description: "Scaffold a new presentational component following project conventions"
---

# New Component

Scaffold a new presentational component and its co-located test.

**Follow all component conventions from `.github/copilot-instructions.md` and accessibility rules from `.github/instructions/a11y.instructions.md`.** Generate the test using `.github/prompts/unit-tests.prompt.md` conventions.

## Deliverables

1. `components/{ComponentName}/{ComponentName}.tsx` — the component.
2. `components/{ComponentName}/{ComponentName}.test.tsx` — co-located test with `jest-axe` check.

## Template

```tsx
import { CURRENCIES, formatAmount } from '@/utils/currency/currency';

interface {ComponentName}Props {
  // define props
}

export function {ComponentName}({ ... }: {ComponentName}Props) {
  return (
    <div className="...">
      {/* component content */}
    </div>
  );
}
```

## Reference Components

- Simple interactive: `components/SwapButton/SwapButton.tsx`
- Data display: `components/ConversionResult/ConversionResult.tsx`
- Form input: `components/AmountInput/AmountInput.tsx`
