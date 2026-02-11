---
applyTo: "**/*.tsx,**/*.ts,**/*.css"
---

# Next.js 14 + Tailwind CSS Instructions

## App Router Patterns

- Use React Server Components by default; add `'use client'` only when hooks, event handlers, or browser APIs are needed
- Group routes by feature/domain inside `app/`
- API routes live in `app/api/` and return `NextResponse.json()`
- Use `revalidate` and `Cache-Control` headers for caching — do not weaken existing cache headers
- Implement proper error boundaries and loading states

## Server vs Client Components

- **Server Components**: data fetching, static content, layouts
- **Client Components**: interactivity, hooks (`useState`, `useEffect`, `useSearchParams`), browser APIs
- Never import server-only code into client components
- Pass serializable props from server to client components

## Tailwind CSS

- Use utility-first classes directly in JSX — no CSS modules
- Follow mobile-first responsive design: base → `sm:` → `md:` → `lg:` → `xl:`
- Use consistent spacing scale and color palette from `tailwind.config.ts`
- Keep semantic HTML structure; use Tailwind for styling only
- Group related utilities logically: layout → spacing → typography → colors → effects

## Component Architecture

See `.github/copilot-instructions.md` → **Conventions → Components** for the full component conventions (folder structure, export style, import patterns).

Additional Next.js–specific notes:

- Components are presentational: props in, JSX out, no data fetching
- Interactive elements must have `aria-label` for accessibility
- Use `@/` path alias for all imports

## State Management

See `.github/copilot-instructions.md` → **Conventions → State** for state management rules.

## Performance

- Use `next/image` for image optimization
- Use `next/font` for font optimization
- Leverage route prefetching and code splitting
- Avoid unnecessary re-renders — memoize with `useMemo`/`useCallback` only when measured

## Data Fetching

See `.github/copilot-instructions.md` → **Architecture** and **Data Flow** for the full data fetching patterns.

Additional notes:

- External API: use `AbortController` for timeouts
- Always provide fallback data for API failures
- Implement `isMounted` guards to prevent state updates on unmounted components
