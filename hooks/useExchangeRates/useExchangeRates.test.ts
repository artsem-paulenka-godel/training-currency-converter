import { act, renderHook, waitFor } from "@testing-library/react";
import { useExchangeRates } from "@/hooks/useExchangeRates/useExchangeRates";

// Mock fetch globally
global.fetch = jest.fn();

describe("useExchangeRates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("should fetch exchange rates on mount", async () => {
    const mockRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.85, GBP: 0.73 },
      timestamp: Date.now(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockRates }),
    });

    const { result } = renderHook(() => useExchangeRates());

    expect(result.current.loading).toBe(true);
    expect(result.current.exchangeRates).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.exchangeRates).toEqual(mockRates);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith("/api/rates");
  });

  it("should handle fetch errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, error: "API Error" }),
    });

    const { result } = renderHook(() => useExchangeRates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.exchangeRates).toBe(null);
    expect(result.current.error).toBe("API Error");
  });

  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useExchangeRates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.exchangeRates).toBe(null);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle fetch failure with default error message", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error());

    const { result } = renderHook(() => useExchangeRates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      "Failed to fetch exchange rates. Please try again later.",
    );
  });

  it("should not update state if component unmounts before fetch completes", async () => {
    const mockRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.85 },
    };

    let resolvePromise: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

    const { result, unmount } = renderHook(() => useExchangeRates());

    expect(result.current.loading).toBe(true);

    // Unmount before fetch completes
    unmount();

    // Resolve the fetch after unmount
    resolvePromise!({
      json: async () => ({ success: true, data: mockRates }),
    });

    // Wait a bit to ensure no updates occur
    await new Promise((resolve) => setTimeout(resolve, 100));

    // State should remain as it was before unmount
    expect(result.current.loading).toBe(true);
  });

  it("should fetch from correct API endpoint", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: {} }),
    });

    renderHook(() => useExchangeRates());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/rates");
    });
  });

  it("should refresh rates with forced fresh request", async () => {
    const initialRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.85 },
      timestamp: Date.now(),
    };
    const refreshedRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.88 },
      timestamp: Date.now() + 1000,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: initialRates }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: refreshedRates }),
      });

    const { result } = renderHook(useExchangeRates);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshRates();
    });

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/^\/api\/rates\?refresh=\d+$/),
      { cache: "no-store" },
    );
    expect(result.current.exchangeRates).toEqual(refreshedRates);
    expect(result.current.error).toBe(null);
  });

  it("should keep previous rates on refresh failure", async () => {
    const initialRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.85 },
      timestamp: Date.now(),
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: initialRates }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: "Refresh failed" }),
      });

    const { result } = renderHook(useExchangeRates);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshRates();
    });

    expect(result.current.exchangeRates).toEqual(initialRates);
    expect(result.current.error).toBe("Refresh failed");
  });

  it("should set refresh loading state during manual refresh", async () => {
    const initialRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.85 },
      timestamp: Date.now(),
    };
    const refreshedRates = {
      base: "USD",
      rates: { USD: 1, EUR: 0.9 },
      timestamp: Date.now() + 1000,
    };

    let resolveRefresh: ((value: unknown) => void) | null = null;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: initialRates }),
    });

    const { result } = renderHook(useExchangeRates);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    act(() => {
      void result.current.refreshRates();
    });

    await waitFor(() => {
      expect(result.current.isRefreshingRates).toBe(true);
    });

    await act(async () => {
      resolveRefresh?.({
        json: async () => ({ success: true, data: refreshedRates }),
      });
    });

    await waitFor(() => {
      expect(result.current.isRefreshingRates).toBe(false);
    });
  });

  it("should clear stale error when refresh starts", async () => {
    let resolveRefresh: ((value: unknown) => void) | null = null;

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: "Initial error" }),
      })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveRefresh = resolve;
        }),
      );

    const { result } = renderHook(useExchangeRates);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Initial error");

    act(() => {
      void result.current.refreshRates();
    });

    await waitFor(() => {
      expect(result.current.isRefreshingRates).toBe(true);
    });

    expect(result.current.error).toBe(null);

    await act(async () => {
      resolveRefresh?.({
        json: async () => ({ success: false, error: "Refresh failed" }),
      });
    });

    await waitFor(() => {
      expect(result.current.isRefreshingRates).toBe(false);
    });

    expect(result.current.error).toBe("Refresh failed");
  });
});
