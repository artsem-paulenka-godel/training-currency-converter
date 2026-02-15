import { ConversionHistory, ConversionResult } from "@/types";
import { isSupportedCurrencyCode } from "@/utils/currency/currency";

const STORAGE_KEY = "currency_converter_history";
const MAX_HISTORY_ITEMS = 10;
const FAVORITES_STORAGE_KEY = "currency_converter_favorites";
const MAX_FAVORITES = 5;

export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "currency_converter_storage_test";

    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    return true;
  } catch (error) {
    console.error("LocalStorage unavailable:", error);
    return false;
  }
}

function sanitizeFavoriteCodes(codes: string[]): string[] {
  const uniqueCodes: string[] = [];

  codes.forEach((code) => {
    if (!isSupportedCurrencyCode(code)) {
      return;
    }

    if (!uniqueCodes.includes(code)) {
      uniqueCodes.push(code);
    }
  });

  return uniqueCodes.slice(0, MAX_FAVORITES);
}

/**
 * Get conversion history from localStorage
 */
export function getConversionHistory(): ConversionResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const history: ConversionHistory = JSON.parse(stored);
    return history.conversions || [];
  } catch (error) {
    console.error("Error reading conversion history:", error);
    return [];
  }
}

/**
 * Save conversion to history
 */
export function saveConversion(conversion: ConversionResult): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const history = getConversionHistory();

    // Add new conversion at the beginning
    const updatedHistory = [conversion, ...history];

    // Keep only the last MAX_HISTORY_ITEMS items
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    const historyData: ConversionHistory = {
      conversions: trimmedHistory,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyData));
  } catch (error) {
    console.error("Error saving conversion history:", error);
  }
}

/**
 * Clear all conversion history
 */
export function clearConversionHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing conversion history:", error);
  }
}

/**
 * Get favorite currencies from localStorage
 */
export function getFavoriteCurrencies(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const codes = parsed.filter(
      (code): code is string => typeof code === "string",
    );

    return sanitizeFavoriteCodes(codes);
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

/**
 * Save favorites to localStorage
 */
export function saveFavoriteCurrencies(codes: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const sanitized = sanitizeFavoriteCodes(codes);

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

/**
 * Clear all favorite currencies
 */
export function clearFavoriteCurrencies(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing favorites:", error);
  }
}
