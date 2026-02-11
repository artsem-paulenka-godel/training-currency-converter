---
description: "Project onboarding — get up to speed on the currency converter codebase"
---

# Currency Converter App - Introduction

## Project Overview

This repository contains a Next.js 14 currency converter application built with TypeScript. The app allows users to convert between different currencies using real-time exchange rates, with a focus on reliability, user experience, and robust error handling.

## Technical Stack

- **Framework**: Next.js 14 with App Router architecture
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (utility-first approach)
- **Testing**: Jest + React Testing Library + jest-axe
- **State Management**: URL-based with useSearchParams

## Core Features

- Real-time currency conversion with multiple API fallback sources
- Automatic conversion on input change (no manual refresh needed)
- URL persistence for all conversion parameters
- Responsive design for mobile and desktop
- Conversion history (last 10 conversions)

### Architecture Layers

Read `.github/copilot-instructions.md` for the full architecture, conventions, and data flow. Then summarize the following for the reader:

1. **Stack** and entry point
2. **Architecture layers** (API, Hooks, Utils, Types, Components)
3. **Data flow** end-to-end
4. **Key patterns** (URL state sync, localStorage SSR guards, testing conventions)
5. **Commands**: `npm run dev`, `npm test`, `npm run test:coverage`, `npm run build`

## Getting Started Steps

1. `npm install`
2. `npm run dev` — opens at http://localhost:3000
3. `npm test` — runs all tests
4. Read `app/page.tsx` to see how everything connects
5. Read `.github` for AI conventions

## Key Commands

```bash
npm run dev           # Development server
npm run test:watch    # Test development
npm run test:coverage # Coverage reports
npm run build         # Production build
```
