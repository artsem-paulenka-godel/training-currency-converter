# Research: Favorite Currencies

**Feature**: 001-favorite-currencies  
**Date**: 2025-12-12  
**Status**: Complete

## Overview

This document resolves all technical unknowns identified during the planning phase for the Favorite Currencies feature.

---

## Research Topics

### 1. Maximum Favorites Limit Implementation

**Context**: The spec requires maximum 5 favorites, but existing code has `MAX_ITEMS = 20`.

**Decision**: Update `MAX_ITEMS` constant from 20 to 5 in `utils/favorites.ts`

**Rationale**: 
- 5 favorites is sufficient for quick access without overwhelming the dropdown
- Smaller limit reduces localStorage usage
- Aligns with user's explicit requirement

**Alternatives Considered**:
- Configurable limit via environment variable: Rejected (over-engineering for training project)
- Unlimited favorites with pagination: Rejected (adds complexity, not requested)

---

### 2. Limit Exceeded Feedback Mechanism

**Context**: FR-004 requires visual feedback when user attempts to exceed the 5-favorite limit.

**Decision**: 
1. Add `add()` method return value indicating success/failure
2. Add `isFull()` method to check if limit reached
3. Display inline warning message in `CurrencySelect` component when limit reached

**Rationale**:
- Return value allows caller to react to failure
- Inline feedback is immediate and contextual
- No external toast library needed (simplicity principle)

**Implementation Pattern**:
```typescript
// In favorites.ts
add(code: string): boolean {
  if (this.inMemory.length >= MAX_ITEMS) {
    return false; // Limit reached
  }
  // ... existing add logic
  return true;
}

isFull(): boolean {
  return this.inMemory.length >= MAX_ITEMS;
}
```

**Alternatives Considered**:
- Toast notifications: Rejected (requires external library or custom implementation)
- Browser alert: Rejected (poor UX, blocks interaction)
- Disable star button when full: Could supplement but doesn't explain why disabled

---

### 3. SSR Hydration Compatibility

**Context**: Next.js App Router uses server-side rendering; localStorage is only available client-side.

**Decision**: Use existing pattern - initialize empty array on server, hydrate in `useEffect`

**Rationale**:
- Pattern already implemented in `CurrencySelect.tsx`
- Prevents hydration mismatch errors
- Follows React best practices for browser-only APIs

**Existing Code Pattern** (already in place):
```typescript
const [favList, setFavList] = useState<string[]>([]); // Empty on SSR
useEffect(() => {
  const unsubscribe = favorites.subscribe((list) => setFavList(list));
  return unsubscribe;
}, []);
```

---

### 4. Cross-Tab Synchronization

**Context**: FR-010 requires favorites to sync across browser tabs.

**Decision**: Use existing `storage` event listener pattern in `Favorites` class

**Rationale**:
- Already implemented in constructor: `window.addEventListener('storage', this.handleStorageEvent.bind(this))`
- Browser native, no additional code needed
- Works automatically when localStorage changes in another tab

**Verification**: Existing implementation handles this correctly. No changes needed.

---

### 5. Error Handling Strategy

**Context**: FR-009 requires graceful degradation when localStorage unavailable.

**Decision**: Use existing error handling pattern with `useLocalStorage` flag

**Rationale**:
- Already implemented: on error, sets `useLocalStorage = false` and continues with in-memory
- Falls back gracefully without crashing
- User can still use favorites for current session

**Existing Pattern** (no changes needed):
```typescript
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemory));
} catch (e) {
  this.useLocalStorage = false; // Graceful degradation
}
```

---

## Summary of Decisions

| Topic | Decision | Changes Required |
|-------|----------|------------------|
| Max Favorites Limit | Update constant to 5 | `utils/favorites.ts`: `MAX_ITEMS = 5` |
| Limit Feedback | Return boolean from `add()`, add `isFull()` method | `utils/favorites.ts`: Modify `add()`, add `isFull()` |
| UI Feedback | Inline warning when limit reached | `components/CurrencySelect.tsx`: Add warning UI |
| SSR Hydration | Use existing pattern | No changes needed |
| Cross-Tab Sync | Use existing storage event | No changes needed |
| Error Handling | Use existing graceful degradation | No changes needed |

---

## Unknowns Resolved

All NEEDS CLARIFICATION items have been resolved. No outstanding technical questions remain.
