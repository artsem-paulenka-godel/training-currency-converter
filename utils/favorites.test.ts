/* eslint-env jest */

let favorites: any;

beforeEach(() => {
  // Start fresh for each test: clear storage and reload module
  localStorage.clear();
  jest.resetModules();
  favorites = require('./favorites').default;
});

test('add and persist a favorite', () => {
  favorites.add('EUR');
  expect(favorites.list()).toContain('EUR');
  const raw = localStorage.getItem('tcc.favorites');
  expect(raw).not.toBeNull();
  expect(JSON.parse(raw!)).toEqual(['EUR']);
});

test('duplicates are not added', () => {
  favorites.add('USD');
  favorites.add('USD');
  expect(favorites.list()).toEqual(['USD']);
});

test('add() returns false for duplicate currency', () => {
  const firstAdd = favorites.add('USD');
  expect(firstAdd).toBe(true);
  const secondAdd = favorites.add('USD');
  expect(secondAdd).toBe(false);
  expect(favorites.list()).toEqual(['USD']);
});

test('remove a favorite', () => {
  favorites.add('JPY');
  expect(favorites.list()).toContain('JPY');
  favorites.remove('JPY');
  expect(favorites.list()).not.toContain('JPY');
  expect(JSON.parse(localStorage.getItem('tcc.favorites')!)).toEqual([]);
});

test('invalid codes are ignored', () => {
  favorites.add('EURO');
  favorites.add('12');
  favorites.add('us');
  expect(favorites.list()).toEqual([]);
});

test('enforces max 5 items limit', () => {
  // Add exactly 5 items
  favorites.add('USD');
  favorites.add('EUR');
  favorites.add('GBP');
  favorites.add('JPY');
  favorites.add('CHF');
  expect(favorites.list().length).toBe(5);
  
  // Try to add 6th item - should be rejected
  const result = favorites.add('CAD');
  expect(result).toBe(false);
  expect(favorites.list().length).toBe(5);
  expect(favorites.list()).not.toContain('CAD');
});

test('add() returns false when limit reached', () => {
  // Fill up to limit
  favorites.add('USD');
  favorites.add('EUR');
  favorites.add('GBP');
  favorites.add('JPY');
  favorites.add('CHF');
  
  // Attempt to add beyond limit
  const result = favorites.add('CAD');
  expect(result).toBe(false);
  expect(favorites.list()).toEqual(['USD', 'EUR', 'GBP', 'JPY', 'CHF']);
});

test('isFull() returns correct boolean', () => {
  expect(favorites.isFull()).toBe(false);
  
  favorites.add('USD');
  expect(favorites.isFull()).toBe(false);
  
  favorites.add('EUR');
  favorites.add('GBP');
  favorites.add('JPY');
  expect(favorites.isFull()).toBe(false);
  
  favorites.add('CHF');
  expect(favorites.isFull()).toBe(true);
  
  // After removing one, should no longer be full
  favorites.remove('CHF');
  expect(favorites.isFull()).toBe(false);
});

test('subscribe receives updates and can unsubscribe', () => {
  const cb = jest.fn();
  const unsubscribe = favorites.subscribe(cb);
  // initial call with current list
  expect(cb).toHaveBeenCalledTimes(1);
  favorites.add('CHF');
  expect(cb).toHaveBeenCalledTimes(2);
  unsubscribe();
  favorites.add('SEK');
  expect(cb).toHaveBeenCalledTimes(2); // no more calls after unsubscribe
});

test('favorites persist after simulated page refresh', () => {
  favorites.add('USD');
  favorites.add('EUR');
  
  // Simulate page refresh by reloading module
  jest.resetModules();
  const freshFavorites = require('./favorites').default;
  
  expect(freshFavorites.list()).toEqual(['USD', 'EUR']);
});

test('graceful degradation when localStorage throws error', () => {
  // Mock localStorage to throw on setItem
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = jest.fn(() => {
    throw new Error('QuotaExceededError');
  });
  
  // Should not throw, should work in memory
  expect(() => favorites.add('USD')).not.toThrow();
  expect(favorites.list()).toContain('USD');
  
  // Restore
  localStorage.setItem = originalSetItem;
});

test('cross-tab synchronization via storage event', () => {
  const cb = jest.fn();
  favorites.subscribe(cb);
  cb.mockClear();
  
  // Simulate storage event from another tab
  localStorage.setItem('tcc.favorites', JSON.stringify(['GBP', 'AUD']));
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'tcc.favorites',
    newValue: JSON.stringify(['GBP', 'AUD']),
  }));
  
  expect(favorites.list()).toEqual(['GBP', 'AUD']);
  expect(cb).toHaveBeenCalled();
});

test('invalid/corrupted localStorage data handling', () => {
  // Set corrupted data
  localStorage.setItem('tcc.favorites', 'not-valid-json{{{');
  
  // Reload module to trigger load
  jest.resetModules();
  const freshFavorites = require('./favorites').default;
  
  // Should reset to empty list, not crash
  expect(freshFavorites.list()).toEqual([]);
});

test('handles non-array data in localStorage', () => {
  localStorage.setItem('tcc.favorites', JSON.stringify({ invalid: 'object' }));
  
  jest.resetModules();
  const freshFavorites = require('./favorites').default;
  
  expect(freshFavorites.list()).toEqual([]);
});

test('filters invalid currency codes from localStorage', () => {
  localStorage.setItem('tcc.favorites', JSON.stringify(['USD', 'invalid', 'TOOLONG', 'EUR']));
  
  jest.resetModules();
  const freshFavorites = require('./favorites').default;
  
  expect(freshFavorites.list()).toEqual(['USD', 'EUR']);
});
