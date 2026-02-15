# Data Model: Favorite Currencies

## FavoriteList

- Fields:
  - codes: string[] (currency codes, most-recently-favorited first)
- Validation:
  - codes length <= 5
  - codes values must exist in CURRENCIES
  - codes are unique
- Notes:
  - Stored in localStorage as JSON array

## FavoriteEntry

- Fields:
  - code: string (supported currency code)
- Validation:
  - code must exist in CURRENCIES

## Relationships

- FavoriteList contains 0..5 FavoriteEntry values.

## State Transitions

- Add favorite: prepend code, remove duplicates, trim to 5.
- Remove favorite: remove code if present.
- Load favorites: validate against CURRENCIES; ignore invalid codes.
