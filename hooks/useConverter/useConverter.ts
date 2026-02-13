import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CURRENCIES,
  validateAmount,
  convertCurrency,
} from "@/utils/currency/currency";
import {
  saveConversion,
  getConversionHistory,
  clearConversionHistory as clearStorage,
} from "@/utils/storage/storage";
import { ConversionResult, ExchangeRates } from "@/types";

export function useConverter(exchangeRates: ExchangeRates | null) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrencyState] = useState<string>("USD");
  const [toCurrency, setToCurrencyState] = useState<string>("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversionResult[]>([]);

  const urlAmount = searchParams.get("amount");
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const getAlternateCurrency = (currencyCode: string) => {
    const fallback = CURRENCIES.find(
      (currency) => currency.code !== currencyCode,
    );
    return fallback ? fallback.code : currencyCode;
  };

  // Initialize from URL parameters
  useEffect(() => {
    if (urlAmount) {
      setAmount(urlAmount);
    }

    let nextFrom = "USD";
    let nextTo = "EUR";

    if (urlFrom && CURRENCIES.find((currency) => currency.code === urlFrom)) {
      nextFrom = urlFrom;
    }

    if (urlTo && CURRENCIES.find((currency) => currency.code === urlTo)) {
      nextTo = urlTo;
    }

    if (nextFrom === nextTo) {
      nextTo = getAlternateCurrency(nextFrom);
    }

    setFromCurrencyState(nextFrom);
    setToCurrencyState(nextTo);

    setHistory(getConversionHistory());
  }, [urlAmount, urlFrom, urlTo]);

  // Update URL parameters
  const updateURL = useCallback(
    (amt: string, from: string, to: string) => {
      const params = new URLSearchParams();
      params.set("amount", amt);
      params.set("from", from);
      params.set("to", to);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  // Perform conversion
  const performConversion = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setResult(null);
      return;
    }

    // Only clear error if we actually have rates to convert with
    if (!exchangeRates) {
      return;
    }

    setValidationError(null);

    try {
      const amountNum = parseFloat(amount);
      const fromRate = exchangeRates.rates[fromCurrency];
      const toRate = exchangeRates.rates[toCurrency];

      if (!fromRate || !toRate) {
        return;
      }

      const convertedAmount = convertCurrency(amountNum, fromRate, toRate);
      setResult(convertedAmount);

      const conversion: ConversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: amountNum,
        result: convertedAmount,
        rate: toRate / fromRate,
        timestamp: Date.now(),
      };

      saveConversion(conversion);
      setHistory(getConversionHistory());

      updateURL(amount, fromCurrency, toCurrency);
    } catch (err: unknown) {
      const errorToLog = err instanceof Error ? err : String(err);
      console.error("Conversion error:", errorToLog);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates, updateURL]);

  // Auto-convert on input change
  useEffect(() => {
    // Always validate the amount, even if rates aren't loaded yet
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setResult(null);
      return;
    }

    // Only perform conversion if we have all required data
    if (fromCurrency && toCurrency && exchangeRates) {
      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates, performConversion]);

  const handleSwap = useCallback(() => {
    setFromCurrencyState(toCurrency);
    setToCurrencyState(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const loadFromHistory = useCallback((conversion: ConversionResult) => {
    setAmount(conversion.amount.toString());
    setFromCurrencyState(conversion.from);
    setToCurrencyState(conversion.to);
  }, []);

  const setFromCurrency = useCallback(
    (currency: string) => {
      setFromCurrencyState((previousFrom) => {
        if (currency === toCurrency) {
          setToCurrencyState(previousFrom);
          return currency;
        }

        return currency;
      });
    },
    [toCurrency],
  );

  const setToCurrency = useCallback(
    (currency: string) => {
      setToCurrencyState((previousTo) => {
        if (currency === fromCurrency) {
          setFromCurrencyState(previousTo);
          return currency;
        }

        return currency;
      });
    },
    [fromCurrency],
  );

  const clearConversionHistory = useCallback(() => {
    clearStorage();
    setHistory([]);
  }, []);

  return {
    amount,
    fromCurrency,
    toCurrency,
    result,
    validationError,
    history,
    setAmount,
    setFromCurrency,
    setToCurrency,
    handleSwap,
    loadFromHistory,
    clearConversionHistory,
  };
}
