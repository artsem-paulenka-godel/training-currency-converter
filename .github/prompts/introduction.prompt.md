---
agent: agent
---

# Currency Converter App - Introduction

## Project Overview

This repository contains a Next.js 14 currency converter application built with TypeScript. The app allows users to convert between different currencies using real-time exchange rates, with a focus on reliability, user experience, and robust error handling.

## Technical Stack

- **Framework**: Next.js 14 with App Router architecture
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS (utility-first approach)
- **Testing**: Jest and React Testing Library
- **State Management**: URL-based with useSearchParams

## Core Features

- Real-time currency conversion with multiple API fallback sources
- Automatic conversion on input change (no manual refresh needed)
- URL persistence for all conversion parameters
- Responsive design for mobile and desktop
- Conversion history (last 10 conversions)

## Architecture

### Component Structure

```
ConverterForm (orchestrator)
├── AmountInput (validation + formatting)
├── CurrencySelect (dropdown logic)
├── SwapButton (currency switching)
└── ConversionResult (display formatting)
```

### Data Flow

- **Custom Hooks**: `useExchangeRates` (API integration) + `useConverter` (business logic)
- **API Layer**: `/api/rates` endpoint with multiple fallback sources and 1-hour caching
- **State Management**: URL parameters for conversion state persistence
- **Storage**: LocalStorage for conversion history

## Key Development Patterns

1. **URL-first state management**: All conversion parameters sync to URL
2. **API fallback strategy**: Multiple sources with graceful degradation
3. **Component composition**: Small, focused components with clear responsibilities
4. **Co-located testing**: Component files paired with their test files
5. **Type safety**: Comprehensive TypeScript interfaces and types

## Testing Strategy

- Component tests with React Testing Library
- API tests with mocked fetch responses
- Hook tests with custom wrappers for context providers
- Co-located test files (component.tsx + component.test.tsx)

## Project Structure

- app - Next.js App Router pages and API routes
- components - Reusable UI components
- hooks - Custom React hooks
- utils - Helper functions
- types - TypeScript type definitions
- `/tests` - Test utilities and mocks

This currency converter implements a modern, resilient web application pattern with an emphasis on user experience, reliability through multiple fallbacks, and comprehensive testing.
