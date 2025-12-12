# Data Model: Favorite Currencies

**Feature**: 001-favorite-currencies  
**Date**: 2025-12-12  
**Status**: Complete

## Overview

This document defines the data entities, validation rules, and state transitions for the Favorite Currencies feature.

---

## Entities

### 1. Favorite

A user-selected currency code stored in a prioritized list.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| code | string | 3 uppercase letters (A-Z) | ISO 4217 currency code (e.g., "USD", "EUR") |

**Collection Constraints**:
- Maximum 5 items in the favorites list
- No duplicates allowed
- Order preserved (most recently added last)

**Validation Rules**:
- Currency code must match pattern: `/^[A-Z]{3}$/`
- Currency code should exist in supported currencies list (soft validation)

---

### 2. FavoritesState

The runtime state of the favorites system.

| Attribute | Type | Description |
|-----------|------|-------------|
| items | string[] | Array of favorite currency codes |
| useLocalStorage | boolean | Whether localStorage is available and working |

---

## Storage Schema

### localStorage Key

```
Key: "tcc.favorites"
Value: JSON array of currency codes
```

**Example**:
```json
["USD", "EUR", "GBP", "JPY", "CHF"]
```

### Validation on Load

When loading from localStorage:
1. Parse JSON (handle malformed data gracefully)
2. Validate array structure
3. Filter to valid 3-letter uppercase codes
4. Remove duplicates
5. Truncate to MAX_ITEMS (5)

---

## State Transitions

### Add Favorite

```
Current State: [A, B, C] (count < 5)
Action: add("D")
Result: [A, B, C, D]
Side Effects: 
  - Save to localStorage
  - Notify subscribers
  - Return: true
```

### Add Favorite (Limit Reached)

```
Current State: [A, B, C, D, E] (count = 5)
Action: add("F")
Result: [A, B, C, D, E] (unchanged)
Side Effects:
  - No localStorage update
  - No subscriber notification
  - Return: false
```

### Add Duplicate

```
Current State: [A, B, C]
Action: add("B")
Result: [A, B, C] (unchanged)
Side Effects: 
  - No localStorage update
  - No subscriber notification
  - Return: false (already exists)
```

### Remove Favorite

```
Current State: [A, B, C]
Action: remove("B")
Result: [A, C]
Side Effects:
  - Save to localStorage
  - Notify subscribers
```

### Cross-Tab Sync

```
Current State (Tab 1): [A, B]
Event: storage event from Tab 2 with [A, B, C]
Result (Tab 1): [A, B, C]
Side Effects:
  - Update in-memory state
  - Notify subscribers
```

---

## Interface Definitions

```typescript
// Already defined in utils/favorites.ts
interface FavoritesAPI {
  list(): string[];
  add(code: string): boolean;  // Returns false if limit reached or duplicate
  remove(code: string): void;
  isFull(): boolean;           // New method
  subscribe(callback: (list: string[]) => void): () => void;
}
```

---

## Relationship to UI

| UI Component | Data Interaction |
|--------------|------------------|
| CurrencySelect | Reads `list()`, calls `add()`/`remove()`, subscribes for updates |
| Star Icon | Reflects if current currency is in favorites list |
| Dropdown Options | Sorts favorites to top, applies visual styling |
| Limit Warning | Shows when `isFull()` returns true and add attempted |

---

## Data Flow Diagram

```
┌─────────────────┐     subscribe()     ┌──────────────────┐
│  CurrencySelect │◄────────────────────│  Favorites Class │
│    Component    │                     │    (Singleton)   │
└────────┬────────┘                     └────────┬─────────┘
         │                                       │
         │ add()/remove()                        │ save/load
         ▼                                       ▼
┌─────────────────┐                     ┌──────────────────┐
│   User Action   │                     │   localStorage   │
│  (click star)   │                     │  "tcc.favorites" │
└─────────────────┘                     └──────────────────┘
```
