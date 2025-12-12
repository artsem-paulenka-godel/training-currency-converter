import { CURRENCIES } from '@/utils/currency';
import { useEffect, useState } from 'react';
import favorites from '@/utils/favorites';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  const [isFav, setIsFav] = useState(false);
  // Initialize to empty array to match SSR; load from localStorage in useEffect
  const [favList, setFavList] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    // subscribe to favorites updates
    const unsubscribe = favorites.subscribe((list) => {
      setFavList(list);
      setIsFav(list.includes(value));
    });
    // also check initial (will trigger on mount, client-side only)
    const initial = favorites.list();
    setFavList(initial);
    setIsFav(initial.includes(value));
    return unsubscribe;
  }, [value]);

  // Auto-dismiss limit warning after 3 seconds
  useEffect(() => {
    if (showLimitWarning) {
      const timer = setTimeout(() => {
        setShowLimitWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLimitWarning]);

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    if (isFav) {
      favorites.remove(value);
      setShowLimitWarning(false);
    } else {
      const added = favorites.add(value);
      if (!added) {
        // Limit reached, show warning
        setShowLimitWarning(true);
      }
    }
  }

  return (
    <div className="flex-1 w-full sm:w-auto relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {/* unified container so the star is visually inside the same rounded border */}
        <div className={`flex items-center border rounded-lg hover:border-gray-400 transition-all focus-within:ring-2 focus-within:ring-blue-500 ${
          isFav 
            ? 'bg-yellow-50 border-yellow-300' 
            : 'bg-white border-gray-300'
        }`}>
          <button
            aria-pressed={isFav}
            aria-label={isFav ? 'Unfavorite currency' : 'Favorite currency'}
            onClick={toggleFavorite}
            className={`ml-2 mr-3 p-2 rounded-full focus:outline-none transition-colors ${
              isFav 
                ? 'text-yellow-600 hover:bg-yellow-100' 
                : 'text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'
            }`}
          >
            {isFav ? (
              <svg data-testid="star-filled" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.853 2.708c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.146 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
            ) : (
              <svg data-testid="star-outline" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L12 17.347l-3.853 2.708c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L3.146 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
            )}
          </button>

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 appearance-none bg-transparent border-none px-3 py-3 text-lg cursor-pointer focus:outline-none"
          >
          {/* Render favorites first */}
          {favList.map((code) => {
            const currency = CURRENCIES.find((c) => c.code === code);
            if (!currency) return null;
            return (
              <option
                key={`fav-${currency.code}`}
                value={currency.code}
                style={{ backgroundColor: '#fef3c7', fontWeight: '600' }}
              >
                ⭐ {currency.code} - {currency.name}
              </option>
            );
          })}

          {/* Then render the rest (exclude favorites) */}
          {CURRENCIES.filter((c) => !favList.includes(c.code)).map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
    </select>

          <div className="pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {showLimitWarning && (
          <p className="text-amber-600 text-sm mt-1">
            Maximum 5 favorites reached
          </p>
        )}
      </div>
    </div>
  );
}
