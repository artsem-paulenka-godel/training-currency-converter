# Copilot Instructions

## Session Management

- **Always create a to-do list** at the start of each multi-step task or session.
- **Maintain a temporary log file** (`copilot_session.log`) for context recovery during long operations.
- Track progress and mark completed items to maintain visibility.
- Before complex work, read relevant source files to build context.
- Update documentation when you make changes that affect documentation.

## Project Overview

Next.js 14 App Router + TypeScript (strict) + Tailwind CSS 3 currency converter.
Entry point `app/page.tsx` is a `'use client'` component composing presentational components and two hooks. Path alias `@/*` maps to the project root.

## Architecture

| Layer | Key files                   | Notes                                                                                                                                                                                           |
| ----- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API   | `app/api/rates/route.ts`    | Fetches `frankfurter.app`, falls back to `MOCK_RATES`. 1-hour cache (`revalidate=3600`, `s-maxage=3600`). 10s `AbortController` timeout. Response: `{ success, data?: ExchangeRates, error? }`. |
| Hooks | `hooks/useExchangeRates.ts` | Fetch + loading/error state; `isMounted` guard.                                                                                                                                                 |
| Hooks | `hooks/useConverter.ts`     | Validates, converts, syncs URL (`?amount=&from=&to=`) via `router.push({ scroll: false })`, writes history to `localStorage`.                                                                   |
| Utils | `utils/currency.ts`         | **`CURRENCIES` is the single source of truth** for supported codes. Also: `convertCurrency`, `validateAmount`, `formatAmount`, `getCurrencyByCode`.                                             |
| Utils | `utils/storage.ts`          | `localStorage` helpers; max 10 items, newest-first. All check `typeof window !== 'undefined'` for SSR safety.                                                                                   |
| Types | `types/index.ts`            | `Currency`, `ExchangeRates`, `ConversionResult`, `ConversionHistory`, `ApiResponse`.                                                                                                            |
| UI    | `components/`               | Presentational only — props in, JSX out. Folder-per-component with co-located tests (flat files are deprecated).                                                                                |

## Data Flow

1. `useExchangeRates` fetches `/api/rates` once on mount.
2. `useConverter(exchangeRates)` auto-converts on any input change.
3. Math: `convertCurrency(amount, fromRate, toRate)` — divide by `fromRate`, multiply by `toRate`. Base currency is always USD.
4. On success → `saveConversion()` writes to `localStorage`, then `getConversionHistory()` refreshes state, then `updateURL()` syncs query params.

### URL State Management

All conversion parameters sync to URL using `useSearchParams`:

```typescript
// Pattern for URL sync in custom hooks
const updateURL = useCallback(
  (amt: string, from: string, to: string) => {
    const params = new URLSearchParams();
    params.set("amount", amt);
    params.set("from", from);
    params.set("to", to);
    router.push(`?${params.toString()}`, { scroll: false });
  },
  [router],
);
```

## Conventions

- **Components**:
  - **New approach**: folder-per-component in `components/` (e.g., `components/SwapButton/SwapButton.tsx`). Co-located tests alongside (`SwapButton.test.tsx` in the same folder). Flat files in `components/` are **deprecated** — do not create new components as flat files.
  - **Named exports only** (e.g., `export function SwapButton(...)`) — default exports are **deprecated**.
  - Single props interface per component named `{ComponentName}Props`.
  - **Presentational only** — props in, JSX out. No `useEffect`, no data fetching, no direct `localStorage` access, only do it if necessary and you think it's better.
  - Tailwind utility-first, no CSS modules. Mobile-first responsive (`sm:`, `lg:`).
  - Interactive elements need `aria-label` (see `SwapButton.tsx`).
  - Import components directly (e.g., `import { SwapButton } from '@/components/SwapButton'`) — do not import via barrel `index.ts` (it's deprecated).
- **Hooks/utils**: Named exports only — default exports are **deprecated**.
- **Imports**: Always use `@/` alias (e.g., `import { CURRENCIES } from '@/utils/currency'`).
- **Types**: Strict mode; avoid `any` — use interfaces from `types/index.ts`.
- **Numbers**: Use `formatAmount(value, decimals?)` — never raw `.toFixed()` in components.
- **State**: URL is the source of truth for conversion params. `useState` only for UI concerns (e.g., `showHistory`). No global state library. Suggest utilizing proper state manager only if we need to share complex state across many components.

## Testing

Jest 30 + Testing Library + `jest-axe`. Config: `jest.config.js` (via `next/jest`), env `jsdom`.

- Tests co-located: `Component.tsx` + `Component.test.tsx`, `hook.ts` + `hook.test.ts`.
- Pattern: `describe('Name')` → `it('should …')`. Define `defaultProps` with `jest.fn()` at top; `jest.clearAllMocks()` in `beforeEach`.
- **Always** `userEvent.setup()` — never `fireEvent`.
- `jest-axe` already imported in `jest.setup.ts`; use `toHaveNoViolations` for component tests.
- Coverage: `components/`, `hooks/`, `utils/`, `app/` (excluding `layout.tsx` and type files).
- Commands: `npm test`, `npm run test:watch`, `npm run test:coverage`, `npm run test:ci`.

### Testing Philosophy

- **Test behavior, not implementation**: Focus on what the component does, not how it does it.
- **Test user interactions**: Simulate real user behavior (clicks, typing, form submissions).
- **Test edge cases**: Empty states, error states, loading states, boundary conditions.
- **Use descriptive test names**: Tests should read like specifications.

### Testing Best Practices

- **Don't test styles**: Avoid asserting specific CSS classes or inline styles. Styles change frequently and are better validated visually.
  - **Exception**: Only test classes when they affect functionality (e.g., `disabled` state, visibility toggles, or accessibility attributes like `aria-*`).
- **Don't use `container.querySelector`**: Use Testing Library queries instead (`getByRole`, `getByLabelText`, etc.) if possible.
- **Don't test implementation details**: Avoid testing internal state variable names or private functions.
- **Do test error boundaries**: Ensure error states render correctly.

### Mock Strategy

- Global fetch mocking for API routes (not MSW in current setup).
- Jest mocks for Next.js navigation in `jest.setup.ts`.
- Component props mocking with complete default objects.

## Critical Gotchas

- **Never hard-code currency lists** — always import `CURRENCIES` from `utils/currency/currency`.
- **Keep URL params in sync** — if you change conversion inputs, update `updateURL` in `useConverter`.
- **`reactStrictMode: false`** in `next.config.js` — effects fire once in dev.
- **`jest.setup.ts` mocks**: `console.error`/`console.warn` suppressed globally (restore in test if asserting). `useSearchParams().get` returns `null` by default (override per-test). `localStorage` is an in-memory mock.
- **Do not weaken caching headers** in the API route — they are critical for production.
- **`localStorage` SSR guards** — all storage helpers already check `typeof window !== 'undefined'`. Preserve this pattern.

## Development Workflows

### Key Commands

```bash
npm run dev          # Development server
npm run test:watch   # Test development
npm run test:coverage # Coverage reports
npm run build        # Production build
```

### Currency Data

Supported currencies defined in `utils/currency.ts` as `CURRENCIES` array. To add currencies:

1. Add to `CURRENCIES` array with code/name/symbol
2. Ensure API supports the currency code
3. Update tests with new currency in mock data

### Storage Pattern

LocalStorage utilities in `utils/storage.ts`:

- History limited to 10 items (FIFO)
- Timestamps for chronological ordering
- Error handling for storage quota/privacy mode
