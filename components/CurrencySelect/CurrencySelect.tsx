import { FavoriteToggle } from "@/components/FavoriteToggle/FavoriteToggle";
import { CURRENCIES, getCurrencyByCode } from "@/utils/currency/currency";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
  favorites?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
}

export function CurrencySelect({
  value,
  onChange,
  label,
  ariaLabel,
  favorites = [],
  isFavorite = false,
  onToggleFavorite,
}: CurrencySelectProps) {
  const favoriteCurrencies = favorites
    .map(getCurrencyByCode)
    .filter((currency): currency is NonNullable<typeof currency> =>
      Boolean(currency),
    );
  const favoriteCodes = new Set(
    favoriteCurrencies.map((currency) => currency.code),
  );
  const remainingCurrencies = CURRENCIES.filter(
    (currency) => !favoriteCodes.has(currency.code),
  );

  const selectPaddingClass = onToggleFavorite ? "pr-24" : "pr-12";

  return (
    <div className="flex-1 w-full sm:w-auto relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel || label || "Currency"}
        className={`w-full pl-4 ${selectPaddingClass} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-lg bg-white cursor-pointer hover:border-gray-400 transition-colors appearance-none truncate`}
      >
        {favoriteCurrencies.length > 0 ? (
          <>
            <optgroup label="Favorites">
              {favoriteCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All currencies">
              {remainingCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </optgroup>
          </>
        ) : (
          CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))
        )}
      </select>
      {onToggleFavorite && (
        <FavoriteToggle
          isFavorite={isFavorite}
          currencyCode={value}
          onToggle={() => onToggleFavorite(value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 bg-white text-lg"
        />
      )}
      <div className="absolute inset-y-0 right-14 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
