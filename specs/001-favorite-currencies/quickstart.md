# Quickstart: Favorite Currencies

**Feature**: 001-favorite-currencies  
**Date**: 2025-12-12

## Overview

This guide helps developers quickly understand and work with the Favorite Currencies feature.

---

## Quick Reference

### Files to Modify

| File | Purpose | Changes |
|------|---------|---------|
| `utils/favorites.ts` | Favorites logic | Change MAX_ITEMS to 5, add `isFull()` method, update `add()` return type |
| `utils/favorites.test.ts` | Unit tests | Update tests for 5-item limit, add limit feedback tests |
| `components/CurrencySelect.tsx` | UI component | Add limit warning message |
| `components/CurrencySelect.test.tsx` | Component tests | Add tests for limit warning UI |

---

## Development Setup

```bash
# 1. Ensure you're on the feature branch
git checkout 001-favorite-currencies

# 2. Install dependencies (if needed)
npm install

# 3. Run development server
npm run dev

# 4. Run tests in watch mode
npm run test:watch
```

---

## Key APIs

### Favorites Class (`utils/favorites.ts`)

```typescript
import favorites from '@/utils/favorites';

// Check if limit reached
if (favorites.isFull()) {
  console.log('Maximum 5 favorites reached');
}

// Add a favorite (returns success/failure)
const added = favorites.add('USD');
if (!added) {
  // Handle: duplicate or limit reached
}

// Remove a favorite
favorites.remove('USD');

// Get current favorites list
const list = favorites.list(); // ['EUR', 'GBP', ...]

// Subscribe to changes
const unsubscribe = favorites.subscribe((newList) => {
  console.log('Favorites updated:', newList);
});
```

---

## Testing Commands

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- favorites.test.ts

# Run with coverage
npm run test:coverage

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

---

## Validation Checklist

Before submitting:

- [ ] `npm run lint` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run test` all tests pass
- [ ] `npm run test:coverage` shows 90%+ for `utils/favorites.ts`
- [ ] Manual testing: can add up to 5 favorites
- [ ] Manual testing: warning appears when trying to add 6th
- [ ] Manual testing: favorites persist after page refresh

---

## Common Patterns

### Subscribe to Favorites in React Component

```tsx
import { useEffect, useState } from 'react';
import favorites from '@/utils/favorites';

function MyComponent() {
  const [favList, setFavList] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe and get initial list
    const unsubscribe = favorites.subscribe(setFavList);
    return unsubscribe;
  }, []);

  return <div>Favorites: {favList.join(', ')}</div>;
}
```

### Check Before Adding

```tsx
function handleToggleFavorite(code: string) {
  if (favorites.list().includes(code)) {
    favorites.remove(code);
  } else {
    if (!favorites.add(code)) {
      // Show warning: "Maximum 5 favorites reached"
    }
  }
}
```

---

## Troubleshooting

### "localStorage is not defined"

This error occurs during SSR. Ensure you only access localStorage in:
- `useEffect` hooks
- Event handlers
- The `Favorites` class (which handles this internally)

### Favorites not persisting

1. Check browser's localStorage quota
2. Check if localStorage is disabled (private browsing)
3. Look for errors in browser console

### Hydration mismatch

Ensure initial state is empty array, not loaded from localStorage:
```tsx
const [favList, setFavList] = useState<string[]>([]); // Empty, not favorites.list()
```

---

## Related Documentation

- [Feature Specification](spec.md)
- [Implementation Plan](plan.md)
- [Research Notes](research.md)
- [Data Model](data-model.md)
