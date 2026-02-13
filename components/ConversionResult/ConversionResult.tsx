import { CURRENCIES, formatAmount } from "@/utils/currency/currency";

interface ConversionResultProps {
  result: number | null;
  fromCurrency: string;
  toCurrency: string;
  rate: number | null;
}

export function ConversionResult({
  result,
  fromCurrency,
  toCurrency,
  rate,
}: ConversionResultProps) {
  if (result === null) return null;

  const toCurrencyData = CURRENCIES.find((c) => c.code === toCurrency);

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">Converted Amount</div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {toCurrencyData?.symbol}
          {formatAmount(result)}
        </div>
        {rate && (
          <div className="text-sm text-gray-600">
            1 {fromCurrency} = {formatAmount(rate, 4)} {toCurrency}
          </div>
        )}
      </div>
    </div>
  );
}
