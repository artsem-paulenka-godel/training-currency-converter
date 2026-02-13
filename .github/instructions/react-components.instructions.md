---
applyTo: "**/*.tsx"
---

# React Component Instructions

## Component Design

- Functional components with hooks — no class components
- Single responsibility: each component does one thing well
- Use composition over inheritance; prefer children and render props
- Keep components small and focused — extract sub-components when complexity grows

## TypeScript Integration

- Define a props interface for every component (e.g., `CurrencySelectProps`)
- Use strict TypeScript — never use `any`, prefer `unknown` with type narrowing
- Import shared types from `@/types/index.ts`
- Use `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`, etc. for event handlers

## Props & State

- Destructure props in function signature
- Use `jest.fn()` for callback props in tests
- Provide sensible defaults where appropriate
- All currency data must come from `CURRENCIES` in `@/utils/currency/currency`

## Accessibility

- Every interactive element needs an accessible name (`aria-label`, `aria-labelledby`, or visible label)
- Use semantic HTML: `<button>`, `<select>`, `<input>`, `<label>`, `<main>`, `<header>`, `<footer>`
- Ensure keyboard navigation works for all interactive elements
- Validate with `jest-axe` — use `expect(await axe(container)).toHaveNoViolations()` in tests

## Styling with Tailwind

- Apply utility classes directly in JSX
- Mobile-first: start with base styles, add responsive prefixes (`sm:`, `lg:`)
- Use `className` prop — never inline `style` attributes unless dynamic values require it
- Consistent spacing: follow the project's spacing scale

## Error Handling

- Display user-friendly error messages via `ErrorMessage` component
- Handle loading states with `LoadingSpinner` component
- Never let errors crash the UI silently

## Numbers & Formatting

- Always use `formatAmount(value, decimals?)` from `@/utils/currency/currency` — never raw `.toFixed()`
- Currency codes come from `CURRENCIES` constant — never hard-code lists
