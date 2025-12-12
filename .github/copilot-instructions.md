# Currency Converter - AI Coding Agent Instructions

## Session Management

- **Always create a to-do list** at the start of each multi-step task or session
- **Maintain a temporary log file** (`copilot_session.log`) for context recovery during long operations
- Track progress and mark completed items to maintain visibility

## Project Overview

This is a Next.js 14 currency converter app with TypeScript, featuring real-time exchange rates, automatic conversions, and URL persistence. Built with App Router architecture and comprehensive Jest testing.

## Core Architecture

### Data Flow Pattern

- **Custom Hooks**: `useExchangeRates` (API integration) + `useConverter` (business logic)
- **Component Composition**: Small, focused components composed in `ConverterForm` and `app/page.tsx`
- **State Management**: URL-first with `useSearchParams` - all conversion state persists in URL parameters
- **API Layer**: Single `/api/rates` endpoint with multiple fallback sources and 1-hour caching

### Key Dependencies

- **Next.js 14** (App Router) - framework
- **TypeScript** - type safety
- **Tailwind CSS** - styling (utility-first approach)
- **Jest + RTL** - testing with MSW for API mocking

## Critical Patterns

### Component Structure

Components are co-located with tests (`.tsx` + `.test.tsx`). Follow this decomposition:

```
ConverterForm (orchestrator)
├── AmountInput (validation + formatting)
├── CurrencySelect (dropdown logic)
├── SwapButton (currency switching)
└── ConversionResult (display formatting)
```

### Custom Hooks Pattern

Use composition of focused hooks:

- `useExchangeRates`: Handles API fetching, caching, error states
- `useConverter`: Manages conversion logic, URL sync, validation, history

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
  [router]
);
```

### API Error Handling

Multi-source API fallback pattern in `/app/api/rates/route.ts`:

- Try primary source with 10s timeout
- Automatic fallback to next source on failure
- Return structured `ApiResponse` type with success/error states

### Type Safety

Central type definitions in `/types/index.ts`. Key interfaces:

- `ExchangeRates`: API response format
- `ConversionResult`: History item structure
- `Currency`: Currency metadata with code/name/symbol

## Testing Conventions

### Test Organization

- Co-located: `Component.tsx` + `Component.test.tsx`
- Test environment specified: `@jest-environment node` for API routes
- Mock setup in `jest.setup.ts` for Next.js router and window APIs

### Testing Philosophy

- **Test behavior, not implementation**: Focus on what the component does, not how it does it
- **Test user interactions**: Simulate real user behavior (clicks, typing, form submissions)
- **Test edge cases**: Empty states, error states, loading states, boundary conditions
- **Use descriptive test names**: Tests should read like specifications

### Testing Patterns

```typescript
// Component testing pattern
const defaultProps = {
  /* full props object */
};
beforeEach(() => jest.clearAllMocks());

// API testing with fetch mocking
global.fetch = jest.fn();
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => mockData,
});

// Hook testing with custom wrapper for providers
const wrapper = ({ children }) => <TestWrapper>{children}</TestWrapper>;
renderHook(() => useConverter(mockRates), { wrapper });

// User interaction testing
await userEvent.type(input, "test value");
await userEvent.click(button);
await waitFor(() => {
  expect(result.current.data).toEqual(expectedData);
});
```

### Mock Strategy

- Global fetch mocking for API routes (not MSW in current setup)
- Jest mocks for Next.js navigation in `jest.setup.ts`
- Component props mocking with complete default objects

### Testing Best Practices

- **Don't test styles**: Avoid asserting specific CSS classes or inline styles. Styles change frequently and are better validated through visual/snapshot testing or manual review.
- **Test behavior, not implementation**: Focus on user interactions, state changes, and outputs rather than component internals.
- **Don't test implementation details**: Avoid testing internal state variable names or private functions
- **Don't use container.querySelector**: Use Testing Library queries instead (`getByRole`, `getByLabelText`, etc.)
- **Do test error boundaries**: Ensure error states render correctly
- **Exception**: Only test classes when they affect functionality (e.g., `disabled` state, visibility toggles, or accessibility attributes like `aria-*`).

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

### Styling Approach

Tailwind utility-first with component-specific patterns:

- Responsive design: `sm:px-6 lg:px-8`
- Gradient backgrounds: `bg-gradient-to-br from-blue-50 to-indigo-100`
- Card layouts: `bg-white rounded-lg shadow-xl p-6`

## Common Gotchas

### Next.js App Router

- Use `'use client'` for interactive components
- API routes in `app/api/` structure
- No `pages/` directory - pure App Router

### Exchange Rate Calculations

Base currency is always USD. Convert via: `amount / fromRate * toRate`

### URL Persistence

Initialize component state from URL params on mount, not in useState defaults.

### Testing API Routes

Use Node.js test environment and mock fetch globally, not browser-based MSW.
