// Type definitions for the currency converter application

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRates {
  base: string;
  rates: {
    [key: string]: number;
  };
  timestamp?: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface ConversionHistory {
  conversions: ConversionResult[];
}

export interface ApiResponse {
  success: boolean;
  data?: ExchangeRates;
  error?: string;
}
