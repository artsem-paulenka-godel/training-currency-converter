---
description: "Generate a co-located unit test for a component, hook, or utility in this project"
---

# Unit Test Generator

Write a comprehensive Jest + Testing Library test file for the specified source file.

**Follow all conventions from `.github/instructions/jest-testing.instructions.md`.**

## What to Generate

1. A co-located test file (`Foo.tsx` → `Foo.test.tsx`, `useFoo.ts` → `useFoo.test.ts`).
2. Cover the happy path, edge cases, and error states.
3. For **components**: include at least one `jest-axe` accessibility check.
4. For **hooks**: test mount behavior, state transitions, and cleanup.
5. For **utilities**: test return values, boundary inputs, and thrown errors.

## Example Pattern (component)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  const defaultProps = {
    value: "100",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without accessibility violations", async () => {
    const { container } = render(<MyComponent {...defaultProps} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should call onChange when user types", async () => {
    const user = userEvent.setup();

    render(<MyComponent {...defaultProps} />);

    await user.type(screen.getByRole("textbox"), "200");

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
```

## Reference Files

- Component tests: `components/AmountInput.test.tsx`, `components/ConverterForm.test.tsx`
- Hook tests: `hooks/useConverter.test.ts`, `hooks/useExchangeRates.test.ts`
- Utility tests: `utils/currency.test.ts`, `utils/storage.test.ts`
- Test setup: `jest.setup.ts`
