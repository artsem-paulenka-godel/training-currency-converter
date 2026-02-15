import { useCallback, useEffect, useRef, useState } from "react";
import { isSupportedCurrencyCode } from "@/utils/currency/currency";
import {
  getFavoriteCurrencies,
  isLocalStorageAvailable,
  saveFavoriteCurrencies,
} from "@/utils/storage/storage";

interface UseFavoritesResult {
  favorites: string[];
  isFavorite: (code: string) => boolean;
  toggleFavorite: (code: string) => void;
  limitMessage: string | null;
  storageMessage: string | null;
}

const MAX_FAVORITES = 5;
const LIMIT_MESSAGE = "You can only favorite up to five currencies.";
const STORAGE_MESSAGE = "Favorites will not persist across sessions.";

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [storageMessage, setStorageMessage] = useState<string | null>(null);
  const hasLoaded = useRef(false);
  const [storageAvailable] = useState<boolean>(() => isLocalStorageAvailable());

  useEffect(() => {
    if (!storageAvailable) {
      setStorageMessage(STORAGE_MESSAGE);
      return;
    }

    setFavorites(getFavoriteCurrencies());
    setStorageMessage(null);
    hasLoaded.current = true;
  }, [storageAvailable]);

  useEffect(() => {
    if (!storageAvailable || !hasLoaded.current) {
      return;
    }

    saveFavoriteCurrencies(favorites);
  }, [favorites, storageAvailable]);

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites],
  );

  const toggleFavorite = useCallback((code: string) => {
    if (!isSupportedCurrencyCode(code)) {
      return;
    }

    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(code)) {
        setLimitMessage(null);
        return prevFavorites.filter((favorite) => favorite !== code);
      }

      if (prevFavorites.length >= MAX_FAVORITES) {
        setLimitMessage(LIMIT_MESSAGE);
        return prevFavorites;
      }

      setLimitMessage(null);
      return [code, ...prevFavorites];
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    limitMessage,
    storageMessage,
  };
}
