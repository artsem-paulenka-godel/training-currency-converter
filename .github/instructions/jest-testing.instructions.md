---
applyTo: "**/*.test.ts,**/*.test.tsx"
---

# Jest + Testing Library Instructions

## Test Setup

- Jest 30 + React Testing Library + `jest-axe`
- Config: `jest.config.js` (via `next/jest`), environment: `jsdom`
- Tests are co-located: `Component.tsx` + `Component.test.tsx`, `hook.ts` + `hook.test.ts`

## Test Structure

- Use `describe('ComponentName')` → `it('should …')` pattern
- Nest `describe` blocks for grouping: `describe('ComponentName')` → `describe('when error')` → `it(...)`
- Use descriptive test names: `it('should calculate conversion when both rates exist')`
- Define `defaultProps` with `jest.fn()` callbacks at the top of each describe block
- Call `jest.clearAllMocks()` in `beforeEach` (not `resetAllMocks` — preserves setup mocks)
- One assertion concept per test — keep tests focused and readable

## Imports & Types

- **Always** use `@/` path alias for imports (e.g., `import { CURRENCIES } from '@/utils/currency'`)
- Never hard-code currency lists — import `CURRENCIES` from `@/utils/currency`
- Use interfaces from `@/types` (e.g., `ExchangeRates`, `ConversionResult`)

## User Interactions

- **Always** use `userEvent.setup()` — never use `fireEvent`
- Create a fresh user event instance inside each test: `const user = userEvent.setup()`
- Await all user interactions: `await user.click(...)`, `await user.type(...)`

## Querying Elements

- Prefer accessible queries: `getByRole`, `getByLabelText`, `getByText`
- Use `getByTestId` only as a last resort
- Use `screen` from Testing Library for all queries
- Test behavior and output, not implementation details

## Accessibility Testing

- `jest-axe` is imported globally in `jest.setup.ts`
- Include `toHaveNoViolations` check in every component test:

  ```typescript
  const { container } = render(<Component {...defaultProps} />);

  expect(await axe(container)).toHaveNoViolations();
  ```

## Mocking

- `jest.setup.ts` already mocks: `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`), `window.matchMedia`, `localStorage`, `console.error`, `console.warn`
- `console.error` / `console.warn` are suppressed globally — restore in test if you need to assert on console output
- `useSearchParams().get` returns `null` by default — override per test
- `localStorage` uses an in-memory mock — already set up
- Mock external modules with `jest.mock()` at module scope
- Use `jest.spyOn()` for partial mocks
- Use `mockImplementation()`, `mockReturnValue()`, `mockResolvedValue()`, `mockRejectedValue()` to define mock behavior

## Hook Testing

- Use `renderHook` from `@testing-library/react` for testing custom hooks
- Wrap with necessary providers if the hook depends on context
- Test both success and error states
- Test cleanup behavior for hooks with effects
- The `useExchangeRates` hook fetches on mount — mock `fetch` when testing it

## Async Testing

- Use `waitFor` for assertions that depend on async state updates
- Use `findBy*` queries for elements that appear asynchronously
- Always `await` async operations before making assertions
- Use `resolves`/`rejects` matchers for promise assertions

## Common Jest Matchers

- Basic: `toBe()`, `toEqual()`, `toStrictEqual()`
- Truthiness: `toBeTruthy()`, `toBeFalsy()`, `toBeNull()`, `toBeDefined()`
- Numbers: `toBeGreaterThan()`, `toBeLessThanOrEqual()`, `toBeCloseTo()`
- Strings: `toMatch(/pattern/)`, `toContain('substring')`
- Arrays: `toContain(item)`, `toHaveLength(3)`, `toEqual(expect.arrayContaining([...]))`
- Objects: `toHaveProperty('key', value)`, `toMatchObject({ partial })`
- Exceptions: `expect(fn).toThrow()`, `expect(fn).toThrow(Error)`
- Mocks: `toHaveBeenCalled()`, `toHaveBeenCalledWith(arg1, arg2)`, `toHaveBeenCalledTimes(n)`

## Coverage

- Target directories: `components/`, `hooks/`, `utils/`, `app/` (excluding `layout.tsx` and type files)
- Run coverage: `npm run test:coverage`
- Run CI mode: `npm run test:ci`
