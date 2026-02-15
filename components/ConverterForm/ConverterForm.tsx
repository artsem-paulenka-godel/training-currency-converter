import { AmountInput } from "@/components/AmountInput/AmountInput";
import { CurrencySelect } from "@/components/CurrencySelect/CurrencySelect";
import { SwapButton } from "@/components/SwapButton/SwapButton";
import { RefreshingRatesButton } from "@/components/RefreshingRatesButton/RefreshingRatesButton";
import { ConversionResult } from "@/components/ConversionResult/ConversionResult";
import { ExchangeRates } from "@/types";

interface ConverterFormProps {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  result: number | null;
  validationError: string | null;
  exchangeRates: ExchangeRates | null;
  favorites: string[];
  favoriteLimitMessage: string | null;
  favoriteStorageMessage: string | null;
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (value: string) => void;
  onToCurrencyChange: (value: string) => void;
  onSwap: () => void;
  onToggleFavorite: (code: string) => void;
  onRefreshRates: () => void;
  isRefreshingRates: boolean;
}

export function ConverterForm({
  amount,
  fromCurrency,
  toCurrency,
  result,
  validationError,
  exchangeRates,
  favorites,
  favoriteLimitMessage,
  favoriteStorageMessage,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onSwap,
  onToggleFavorite,
  onRefreshRates,
  isRefreshingRates,
}: ConverterFormProps) {
  const currentRate =
    exchangeRates && fromCurrency && toCurrency
      ? exchangeRates.rates[toCurrency] / exchangeRates.rates[fromCurrency]
      : null;
  const isFromFavorite = favorites.includes(fromCurrency);
  const isToFavorite = favorites.includes(toCurrency);

  return (
    <div className="space-y-4">
      {/* Single Row: Amount and Currency Selectors */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <AmountInput
            value={amount}
            onChange={onAmountChange}
            error={validationError}
          />

          <CurrencySelect
            value={fromCurrency}
            onChange={onFromCurrencyChange}
            ariaLabel="From currency"
            favorites={favorites}
            isFavorite={isFromFavorite}
            onToggleFavorite={onToggleFavorite}
          />

          <SwapButton onClick={onSwap} />

          <CurrencySelect
            value={toCurrency}
            onChange={onToCurrencyChange}
            ariaLabel="To currency"
            favorites={favorites}
            isFavorite={isToFavorite}
            onToggleFavorite={onToggleFavorite}
          />

          <RefreshingRatesButton
            onClick={onRefreshRates}
            isRefreshing={isRefreshingRates}
          />
        </div>

        {/* Error message below the row */}
        {validationError && (
          <p className="text-sm text-red-600 px-1">{validationError}</p>
        )}

        {favoriteLimitMessage && (
          <p
            className="text-sm text-amber-700 px-1"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {favoriteLimitMessage}
          </p>
        )}

        {favoriteStorageMessage && (
          <p
            className="text-sm text-gray-700 px-1"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {favoriteStorageMessage}
          </p>
        )}
      </div>

      {/* Result Display */}
      {!validationError && (
        <ConversionResult
          result={result}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          rate={currentRate}
        />
      )}
    </div>
  );
}
