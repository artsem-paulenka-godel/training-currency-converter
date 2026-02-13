import {
  getConversionHistory,
  saveConversion,
  clearConversionHistory,
} from "@/utils/storage/storage";
import { ConversionResult } from "@/types";

describe("storage utils", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getConversionHistory", () => {
    it("should return empty array when no history exists", () => {
      const history = getConversionHistory();
      expect(history).toEqual([]);
    });

    it("should return stored conversion history", () => {
      const mockConversion: ConversionResult = {
        from: "USD",
        to: "EUR",
        amount: 100,
        result: 85,
        rate: 0.85,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        "currency_converter_history",
        JSON.stringify({ conversions: [mockConversion] }),
      );

      const history = getConversionHistory();
      expect(history).toEqual([mockConversion]);
    });

    it("should handle corrupted data gracefully", () => {
      localStorage.setItem("currency_converter_history", "invalid json");

      const history = getConversionHistory();
      expect(history).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it("should return empty array when conversions property is missing", () => {
      localStorage.setItem("currency_converter_history", "{}");

      const history = getConversionHistory();
      expect(history).toEqual([]);
    });
  });

  describe("saveConversion", () => {
    it("should save conversion to localStorage", () => {
      const conversion: ConversionResult = {
        from: "USD",
        to: "EUR",
        amount: 100,
        result: 85,
        rate: 0.85,
        timestamp: Date.now(),
      };

      saveConversion(conversion);

      const stored = localStorage.getItem("currency_converter_history");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.conversions).toHaveLength(1);
      expect(parsed.conversions[0]).toEqual(conversion);
    });

    it("should add new conversions at the beginning", () => {
      const conversion1: ConversionResult = {
        from: "USD",
        to: "EUR",
        amount: 100,
        result: 85,
        rate: 0.85,
        timestamp: 1000,
      };

      const conversion2: ConversionResult = {
        from: "GBP",
        to: "USD",
        amount: 50,
        result: 65,
        rate: 1.3,
        timestamp: 2000,
      };

      saveConversion(conversion1);
      saveConversion(conversion2);

      const history = getConversionHistory();
      expect(history[0]).toEqual(conversion2);
      expect(history[1]).toEqual(conversion1);
    });

    it("should limit history to MAX_HISTORY_ITEMS (10)", () => {
      // Add 15 conversions
      for (let i = 0; i < 15; i++) {
        const conversion: ConversionResult = {
          from: "USD",
          to: "EUR",
          amount: i,
          result: i * 0.85,
          rate: 0.85,
          timestamp: i,
        };
        saveConversion(conversion);
      }

      const history = getConversionHistory();
      expect(history).toHaveLength(10);

      // Should keep the most recent 10
      expect(history[0].timestamp).toBe(14);
      expect(history[9].timestamp).toBe(5);
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage.setItem to throw an error
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      setItemSpy.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const conversion: ConversionResult = {
        from: "USD",
        to: "EUR",
        amount: 100,
        result: 85,
        rate: 0.85,
        timestamp: Date.now(),
      };

      // Should not throw - the function catches the error internally
      expect(() => saveConversion(conversion)).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe("clearConversionHistory", () => {
    it("should clear all conversion history", () => {
      const conversion: ConversionResult = {
        from: "USD",
        to: "EUR",
        amount: 100,
        result: 85,
        rate: 0.85,
        timestamp: Date.now(),
      };

      saveConversion(conversion);
      expect(getConversionHistory()).toHaveLength(1);

      clearConversionHistory();
      expect(getConversionHistory()).toHaveLength(0);
    });

    it("should handle errors gracefully", () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
      removeItemSpy.mockImplementation(() => {
        throw new Error("Failed to remove item");
      });

      // Should not throw - the function catches the error internally
      expect(() => clearConversionHistory()).not.toThrow();

      removeItemSpy.mockRestore();
    });

    it("should work even when no history exists", () => {
      expect(() => clearConversionHistory()).not.toThrow();
      expect(getConversionHistory()).toHaveLength(0);
    });
  });
});
