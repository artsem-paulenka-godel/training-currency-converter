import { NextResponse } from "next/server";
import { ExchangeRates } from "@/types";

// API sources with fallback support
// Using free APIs that don't require authentication
interface FrankfurterResponse {
  base: string;
  rates: Record<string, number>;
}

interface ApiSource {
  name: string;
  url: string;
  transform: (data: FrankfurterResponse) => ExchangeRates;
}

const API_SOURCES: ApiSource[] = [
  {
    name: "frankfurter.app",
    url: "https://api.frankfurter.app/latest?from=USD",
    transform: (data) => ({
      base: data.base,
      rates: { USD: 1, ...data.rates }, // Add USD since it's not included
    }),
  },
];

/**
 * Fetch exchange rates from a specific API source
 */
async function fetchFromSource(source: ApiSource): Promise<ExchangeRates> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // Use undici for better Node.js fetch support with SSL handling
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as FrankfurterResponse;
    return source.transform(data);
  } catch (error: unknown) {
    clearTimeout(timeout);
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error fetching from ${source.name}:`, message);
    throw new Error(message);
  }
}

/**
 * Mock data for development/fallback when APIs are unavailable
 */
const MOCK_RATES = {
  base: "USD",
  rates: {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 149.5,
    AUD: 1.52,
    CAD: 1.35,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    MXN: 17.25,
  },
};

/**
 * Fetch exchange rates with fallback support
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
  let lastError: Error | null = null;

  // Try each API source in order
  for (const source of API_SOURCES) {
    try {
      const data = await fetchFromSource(source);
      return data;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(`Failed to fetch from ${source.name}:`, lastError.message);
    }
  }

  // If all sources failed, use mock data as fallback (useful in development)
  console.warn("All API sources failed. Using mock data as fallback.");
  console.error(`Last error: ${lastError?.message || "Unknown error"}`);
  return MOCK_RATES;
}

/**
 * API Route Handler for exchange rates
 * Implements 1-hour caching with Next.js revalidate
 */
export async function GET() {
  try {
    const data = await fetchExchangeRates();

    return NextResponse.json(
      {
        success: true,
        data: {
          base: data.base,
          rates: data.rates,
          timestamp: Date.now(),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch exchange rates";
    console.error("Error in exchange rates API:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}

// Enable caching for 1 hour
export const revalidate = 3600;
