import { act, renderHook, waitFor } from "@testing-library/react";
import { useFavorites } from "@/hooks/useFavorites/useFavorites";
import { CURRENCIES } from "@/utils/currency/currency";
import * as storage from "@/utils/storage/storage";

jest.mock("@/utils/storage/storage");

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.isLocalStorageAvailable as jest.Mock).mockReturnValue(true);
    (storage.getFavoriteCurrencies as jest.Mock).mockReturnValue([]);
  });

  it("should initialize with empty favorites", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it("should load favorites from storage", async () => {
    (storage.getFavoriteCurrencies as jest.Mock).mockReturnValue(["USD"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites).toEqual(["USD"]);
    });
  });

  it("should add and remove favorites", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("USD");
    });

    expect(result.current.favorites).toEqual(["USD"]);
    expect(result.current.isFavorite("USD")).toBe(true);

    act(() => {
      result.current.toggleFavorite("USD");
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite("USD")).toBe(false);
  });

  it("should keep most recent favorites first", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("USD");
      result.current.toggleFavorite("EUR");
    });

    expect(result.current.favorites).toEqual(["EUR", "USD"]);
  });

  it("should ignore unsupported currency codes", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("INVALID");
    });

    expect(result.current.favorites).toEqual([]);
  });

  it("should block adding more than five favorites", () => {
    const { result } = renderHook(() => useFavorites());
    const codes = CURRENCIES.slice(0, 6).map((currency) => currency.code);

    act(() => {
      codes.forEach((code) => result.current.toggleFavorite(code));
    });

    expect(result.current.favorites).toHaveLength(5);
    expect(result.current.limitMessage).toMatch(/five currencies/i);
    expect(result.current.favorites).not.toContain(codes[5]);
  });

  it("should persist favorites when storage is available", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(storage.getFavoriteCurrencies).toHaveBeenCalled();
    });

    act(() => {
      result.current.toggleFavorite("USD");
    });

    await waitFor(() => {
      expect(storage.saveFavoriteCurrencies).toHaveBeenCalledWith(["USD"]);
    });
  });

  it("should show a non-persistent message when storage is unavailable", async () => {
    (storage.isLocalStorageAvailable as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.storageMessage).toMatch(/not persist/i);
    });
  });
});
