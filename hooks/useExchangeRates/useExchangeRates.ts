import { useState, useEffect, useCallback, useRef } from "react";
import { ApiResponse, ExchangeRates } from "@/types";

const DEFAULT_ERROR_MESSAGE =
  "Failed to fetch exchange rates. Please try again later.";

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const fetchRates = useCallback(
    async ({
      forceFresh,
      isInitialLoad,
    }: {
      forceFresh: boolean;
      isInitialLoad: boolean;
    }) => {
      setError(null);

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshingRates(true);
      }

      try {
        const url = forceFresh
          ? `/api/rates?refresh=${Date.now()}`
          : "/api/rates";

        const response = forceFresh
          ? await fetch(url, { cache: "no-store" })
          : await fetch(url);

        const data: ApiResponse = await response.json();

        if (!isMountedRef.current) return;

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to fetch exchange rates");
        }

        setExchangeRates(data.data);
        setError(null);
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        const nextError =
          err instanceof Error && err.message
            ? err.message
            : DEFAULT_ERROR_MESSAGE;

        setError(nextError);
        console.error("Error fetching rates:", err);
      } finally {
        if (!isMountedRef.current) return;

        if (isInitialLoad) {
          setLoading(false);
        } else {
          setIsRefreshingRates(false);
        }
      }
    },
    [],
  );

  const refreshRates = useCallback(async () => {
    await fetchRates({ forceFresh: true, isInitialLoad: false });
  }, [fetchRates]);

  useEffect(() => {
    isMountedRef.current = true;

    void fetchRates({ forceFresh: false, isInitialLoad: true });

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchRates]);

  return { exchangeRates, loading, error, refreshRates, isRefreshingRates };
}
