import {
  CURRENCIES,
  getCurrencyByCode,
  isSupportedCurrencyCode,
  formatAmount,
  convertCurrency,
  formatCurrencyDisplay,
  validateAmount,
} from "@/utils/currency/currency";

describe("currency utils", () => {
  describe("CURRENCIES", () => {
    it("should have at least 10 currencies", () => {
      expect(CURRENCIES.length).toBeGreaterThanOrEqual(10);
    });

    it("should have currencies with required properties", () => {
      CURRENCIES.forEach((currency) => {
        expect(currency).toHaveProperty("code");
        expect(currency).toHaveProperty("name");
        expect(currency).toHaveProperty("symbol");
        expect(typeof currency.code).toBe("string");
        expect(typeof currency.name).toBe("string");
        expect(typeof currency.symbol).toBe("string");
      });
    });

    it("should include major currencies", () => {
      const codes = CURRENCIES.map((c) => c.code);
      expect(codes).toContain("USD");
      expect(codes).toContain("EUR");
      expect(codes).toContain("GBP");
      expect(codes).toContain("JPY");
    });
  });

  describe("getCurrencyByCode", () => {
    it("should return currency object for valid code", () => {
      const usd = getCurrencyByCode("USD");
      expect(usd).toEqual({
        code: "USD",
        name: "US Dollar",
        symbol: "$",
      });
    });

    it("should return undefined for invalid code", () => {
      const invalid = getCurrencyByCode("INVALID");
      expect(invalid).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      const lowercase = getCurrencyByCode("usd");
      expect(lowercase).toBeUndefined();
    });
  });

  describe("isSupportedCurrencyCode", () => {
    it("should return true for supported codes", () => {
      expect(isSupportedCurrencyCode("USD")).toBe(true);
      expect(isSupportedCurrencyCode("EUR")).toBe(true);
    });

    it("should return false for unsupported codes", () => {
      expect(isSupportedCurrencyCode("INVALID")).toBe(false);
      expect(isSupportedCurrencyCode("usd")).toBe(false);
    });
  });

  describe("formatAmount", () => {
    it("should format number with 2 decimal places by default", () => {
      expect(formatAmount(100)).toBe("100.00");
      expect(formatAmount(100.5)).toBe("100.50");
      expect(formatAmount(100.567)).toBe("100.57");
    });
  });

  describe("convertCurrency", () => {
    it("should convert currency correctly", () => {
      // USD to EUR: 100 USD with rates USD=1, EUR=0.85
      const result = convertCurrency(100, 1, 0.85);
      expect(result).toBe(85);
    });

    it("should handle same currency conversion", () => {
      const result = convertCurrency(100, 1, 1);
      expect(result).toBe(100);
    });

    it("should handle reverse conversion", () => {
      // EUR to USD: 85 EUR with rates USD=1, EUR=0.85
      const result = convertCurrency(85, 0.85, 1);
      expect(result).toBe(100);
    });

    it("should handle decimal amounts", () => {
      const result = convertCurrency(50.5, 1, 0.85);
      expect(result).toBeCloseTo(42.925, 3);
    });

    it("should handle cross-currency conversion", () => {
      // GBP to JPY: 100 GBP with rates GBP=0.73, JPY=110
      const result = convertCurrency(100, 0.73, 110);
      expect(result).toBeCloseTo(15068.49, 2);
    });
  });

  describe("formatCurrencyDisplay", () => {
    it("should format amount with currency symbol", () => {
      expect(formatCurrencyDisplay(100, "USD")).toBe("$100.00");
      expect(formatCurrencyDisplay(100, "EUR")).toBe("€100.00");
      expect(formatCurrencyDisplay(100, "GBP")).toBe("£100.00");
    });

    it("should handle decimal amounts", () => {
      expect(formatCurrencyDisplay(100.567, "USD")).toBe("$100.57");
    });

    it("should handle unknown currency codes", () => {
      expect(formatCurrencyDisplay(100, "XXX")).toBe("XXX 100.00");
    });

    it("should handle zero amount", () => {
      expect(formatCurrencyDisplay(0, "USD")).toBe("$0.00");
    });
  });

  describe("validateAmount", () => {
    it("should validate correct amounts", () => {
      expect(validateAmount("100")).toEqual({ isValid: true });
      expect(validateAmount("0.01")).toEqual({ isValid: true });
      expect(validateAmount("999999")).toEqual({ isValid: true });
    });

    it("should reject zero and negative amounts", () => {
      expect(validateAmount("0")).toEqual({
        isValid: false,
        error: "Amount must be greater than zero",
      });
      expect(validateAmount("-10")).toEqual({
        isValid: false,
        error: "Amount must be greater than zero",
      });
    });

    it("should reject amounts that are too large", () => {
      expect(validateAmount("1000000001")).toEqual({
        isValid: false,
        error: "Amount is too large",
      });
    });
  });
});
