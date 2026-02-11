---
applyTo: "**/*.ts"
---

# TypeScript Instructions

## Core Principles

- Strict mode enabled — respect all strict checks
- Prefer readable, explicit solutions over clever shortcuts
- Extend existing abstractions before creating new ones
- Target TypeScript 5.x / ES2022 features

## Type System

- Avoid `any` (implicit or explicit) — use `unknown` plus narrowing
- Centralize shared types in `@/types/index.ts` — don't duplicate shapes
- Use discriminated unions for state machines and variant types
- Express intent with utility types: `Readonly`, `Partial`, `Record`, `Pick`, `Omit`
- Use interfaces for object shapes; type aliases for unions and computed types

## Naming & Style

- PascalCase for interfaces, types, enums, and classes
- camelCase for variables, functions, and parameters
- Descriptive names reflecting domain meaning — no `I` prefix on interfaces
- Use `@/` path alias for all imports

## Functions & Modules

- Named exports only — default exports are **deprecated**
- Keep functions focused and short; extract helpers when logic branches
- Use `async/await` with proper try/catch error handling
- Guard edge cases early to avoid deep nesting (early returns)

## Error Handling

- Wrap async operations in try/catch with structured error responses
- Return typed error objects (e.g., `ApiResponse` with `success`, `error` fields)
- Log errors before re-throwing or returning
- Use `AbortController` for fetch timeouts

## SSR Safety

- Always check `typeof window !== 'undefined'` before accessing browser APIs
- Guard `localStorage`, `sessionStorage`, `document`, `navigator` access
- Preserve existing SSR guard patterns in utility functions

## Immutability

- Favor immutable data and pure functions where practical
- Use spread operators for state updates — never mutate directly
- Use `Readonly<T>` for data that should not be modified
