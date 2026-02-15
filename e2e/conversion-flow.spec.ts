import { test, expect } from "@playwright/test";
import {
  blockLocalStorageOnInit,
  clearLocalStorageOnInit,
  expectQueryState,
  FAVORITE_LIMIT_MESSAGE,
  FAVORITE_STORAGE_MESSAGE,
  loadConverter,
  mockRatesFailure,
  mockRatesResponse,
  openHistory,
  waitForLocalStorageContains,
  waitForSuccessfulConversion,
} from "./test-helpers";

test.describe("conversion flow", () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorageOnInit(page);
    await mockRatesResponse(page);
  });

  test("converts amount, updates URL, and shows result", async ({ page }) => {
    const amountInput = page.getByPlaceholder("Enter amount");
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page);

    await amountInput.fill("200");
    await fromSelect.selectOption("USD");
    await toSelect.selectOption("GBP");

    await expectQueryState(page, { amount: "200", from: "USD", to: "GBP" });
    await expect(page.getByText("Converted Amount")).toBeVisible();
    await expect(
      page.getByText("Converted Amount").locator(".."),
    ).toContainText("\u00a3146.00");
    await expect(page.getByText("1 USD = 0.7300 GBP")).toBeVisible();
  });

  test("swaps currencies and recalculates rate", async ({ page }) => {
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page);

    await page.getByRole("button", { name: "Swap currencies" }).click();

    await expect(fromSelect).toHaveValue("EUR");
    await expect(toSelect).toHaveValue("USD");
    await expectQueryState(page, { amount: "1", from: "EUR", to: "USD" });
    await expect(page.getByText("1 EUR = 1.1765 USD")).toBeVisible();
  });

  test("shows validation error for invalid amounts", async ({ page }) => {
    const amountInput = page.getByPlaceholder("Enter amount");

    await loadConverter(page);

    await amountInput.fill("0");

    await expect(
      page.getByText("Amount must be greater than zero"),
    ).toBeVisible();
    await expect(page.getByText("Converted Amount")).toHaveCount(0);
  });

  test("refreshes rates on demand", async ({ page }) => {
    await loadConverter(page);

    const refreshRequest = page.waitForRequest((request) =>
      request.url().includes("/api/rates?refresh="),
    );

    await page.getByRole("button", { name: "Refresh rates" }).click();

    const request = await refreshRequest;

    expect(request.url()).toContain("refresh=");
    await waitForSuccessfulConversion(page);
  });
});

test.describe("url state management", () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorageOnInit(page);
    await mockRatesResponse(page);
  });

  test("initializes conversion from URL params", async ({ page }) => {
    const amountInput = page.getByPlaceholder("Enter amount");
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page, "/?amount=200&from=USD&to=GBP");

    await expect(amountInput).toHaveValue("200");
    await expect(fromSelect).toHaveValue("USD");
    await expect(toSelect).toHaveValue("GBP");
    await expect(page.getByText("1 USD = 0.7300 GBP")).toBeVisible();
    await expectQueryState(page, { amount: "200", from: "USD", to: "GBP" });
  });

  test("falls back to defaults for invalid URL currency params", async ({
    page,
  }) => {
    const amountInput = page.getByPlaceholder("Enter amount");
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page, "/?amount=42&from=ZZZ&to=BAD");

    await expect(amountInput).toHaveValue("42");
    await expect(fromSelect).toHaveValue("USD");
    await expect(toSelect).toHaveValue("EUR");
    await expectQueryState(page, { amount: "42", from: "USD", to: "EUR" });
  });

  test("auto-corrects same from and to values from URL", async ({ page }) => {
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page, "/?amount=10&from=USD&to=USD");

    await expect(fromSelect).toHaveValue("USD");
    await expect(toSelect).toHaveValue("EUR");
    await expectQueryState(page, { amount: "10", from: "USD", to: "EUR" });
  });

  test("restores conversion state with browser back and forward", async ({
    page,
  }) => {
    const amountInput = page.getByPlaceholder("Enter amount");
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");

    await loadConverter(page, "/?amount=10&from=USD&to=EUR");

    await amountInput.fill("20");
    await expectQueryState(page, { amount: "20", from: "USD", to: "EUR" });

    await page.getByRole("button", { name: "Swap currencies" }).click();
    await expectQueryState(page, { amount: "20", from: "EUR", to: "USD" });

    await page.goBack();
    await expectQueryState(page, { amount: "20", from: "USD", to: "EUR" });
    await expect(fromSelect).toHaveValue("USD");
    await expect(toSelect).toHaveValue("EUR");

    await page.goForward();
    await expectQueryState(page, { amount: "20", from: "EUR", to: "USD" });
  });
});

test.describe("favorites and history", () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorageOnInit(page);
    await mockRatesResponse(page);
  });

  test("supports favorite and unfavorite with persistence across reload", async ({
    page,
  }) => {
    await loadConverter(page);

    await page.getByRole("button", { name: "Favorite USD" }).click();
    await expect(
      page.getByRole("button", { name: "Unfavorite USD" }),
    ).toBeVisible();
    await expect(
      page.locator(
        "select[aria-label='From currency'] optgroup[label='Favorites']",
      ),
    ).toHaveCount(1);
    await expect(
      page.locator(
        "select[aria-label='To currency'] optgroup[label='Favorites']",
      ),
    ).toHaveCount(1);

    await page.getByRole("button", { name: "Unfavorite USD" }).click();
    await expect(
      page.getByRole("button", { name: "Favorite USD" }),
    ).toBeVisible();
    await expect(
      page.locator(
        "select[aria-label='From currency'] optgroup[label='Favorites']",
      ),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Favorite USD" }).click();
    await waitForLocalStorageContains(
      page,
      "currency_converter_favorites",
      "USD",
    );
    await page.reload();
    await waitForSuccessfulConversion(page);
    await page.getByLabel("From currency").selectOption("USD");

    await expect(
      page.getByRole("button", { name: "Unfavorite USD" }),
    ).toBeVisible();
    await expect(
      page.locator(
        "select[aria-label='From currency'] optgroup[label='Favorites']",
      ),
    ).toHaveCount(1);
  });

  test("enforces favorite limit and keeps favorites capped at five", async ({
    page,
  }) => {
    const fromSelect = page.getByLabel("From currency");
    const favoriteCodes = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

    await loadConverter(page);

    for (const code of favoriteCodes) {
      await fromSelect.selectOption(code);
      await page.getByRole("button", { name: `Favorite ${code}` }).click();
    }

    await expect(
      page.locator('[role="status"]', { hasText: FAVORITE_LIMIT_MESSAGE }),
    ).toBeVisible();
    await expect(
      page.locator(
        "select[aria-label='From currency'] optgroup[label='Favorites'] option",
      ),
    ).toHaveCount(5);
    await expect(
      page.getByRole("button", { name: "Favorite CAD" }),
    ).toBeVisible();
  });

  test("saves history, reloads conversion, and keeps history after refresh", async ({
    page,
  }) => {
    const amountInput = page.getByPlaceholder("Enter amount");

    await loadConverter(page);

    await amountInput.fill("50");
    await expect(page.getByText(/42\.50/)).toBeVisible();

    await amountInput.fill("10");
    await openHistory(page);
    await page.getByText(/50\.00 USD \u2192 42\.50 EUR/).click();

    await expect(amountInput).toHaveValue("50");
    await expect(page.getByRole("button", { name: /^Show/ })).toBeVisible();
    await waitForLocalStorageContains(
      page,
      "currency_converter_history",
      '"amount":50',
    );

    await page.reload();
    await waitForSuccessfulConversion(page);
    await openHistory(page);

    await expect(page.getByText(/50\.00 USD/).first()).toBeVisible();
  });

  test("trims history to 10 most recent entries", async ({ page }) => {
    const amountInput = page.getByPlaceholder("Enter amount");

    await loadConverter(page);

    for (let amount = 101; amount <= 112; amount += 1) {
      await amountInput.fill(String(amount));
      await expectQueryState(page, {
        amount: String(amount),
        from: "USD",
        to: "EUR",
      });
    }

    await openHistory(page);

    await expect(
      page.getByRole("button", { name: /^Hide \(10\)$/ }),
    ).toBeVisible();
    await expect(page.getByText(/112\.00 USD \u2192 95\.20 EUR/)).toBeVisible();
    await expect(page.getByText(/101\.00 USD \u2192 85\.85 EUR/)).toHaveCount(
      0,
    );
  });

  test("clears history and shows empty state", async ({ page }) => {
    const amountInput = page.getByPlaceholder("Enter amount");

    await loadConverter(page);

    await amountInput.fill("25");
    await openHistory(page);

    await page.getByRole("button", { name: "Clear History" }).click();

    await expect(
      page.getByRole("button", { name: /^Clear History$/ }),
    ).toHaveCount(0);
    await expect(page.getByText("No conversion history yet")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Hide \(0\)$/ }),
    ).toBeVisible();
  });
});

test.describe("favorites storage fallback", () => {
  test.beforeEach(async ({ page }) => {
    await blockLocalStorageOnInit(page);
    await mockRatesResponse(page);
  });

  test("shows non-persistent storage message and keeps favorites usable in-session", async ({
    page,
  }) => {
    await loadConverter(page);

    await expect(
      page.locator('[role="status"]', { hasText: FAVORITE_STORAGE_MESSAGE }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Favorite USD" }).click();
    await expect(
      page.getByRole("button", { name: "Unfavorite USD" }),
    ).toBeVisible();
  });
});

test.describe("accessibility and responsive behavior", () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorageOnInit(page);
    await mockRatesResponse(page);
  });

  test("supports keyboard-first flow across core controls", async ({
    page,
  }) => {
    const amountInput = page.getByPlaceholder("Enter amount");
    const fromSelect = page.getByLabel("From currency");
    const toSelect = page.getByLabel("To currency");
    const swapButton = page.getByRole("button", { name: "Swap currencies" });
    const refreshButton = page.getByRole("button", { name: "Refresh rates" });

    await loadConverter(page);

    await amountInput.focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("200");
    await expect(amountInput).toHaveValue("200");

    const beforeSwapFrom = await fromSelect.inputValue();
    const beforeSwapTo = await toSelect.inputValue();

    await toSelect.focus();
    await page.keyboard.press("ArrowDown");
    await expect(toSelect).toBeFocused();

    await page.getByRole("button", { name: "Favorite USD" }).focus();
    await page.keyboard.press(" ");
    await expect(
      page.getByRole("button", { name: "Unfavorite USD" }),
    ).toBeVisible();

    await swapButton.focus();
    await page.keyboard.press("Enter");
    await expect(fromSelect).toHaveValue(beforeSwapTo);
    await expect(toSelect).toHaveValue(beforeSwapFrom);

    const refreshRequest = page.waitForRequest((request) =>
      request.url().includes("/api/rates?refresh="),
    );
    await refreshButton.focus();
    await page.keyboard.press("Enter");
    await refreshRequest;
  });

  test.describe("reflow at 320px", () => {
    test.use({ viewport: { width: 320, height: 900 } });

    test("keeps conversion, favorites, and history usable without horizontal scrolling", async ({
      page,
    }) => {
      const amountInput = page.getByPlaceholder("Enter amount");

      await loadConverter(page);

      await amountInput.fill("25");
      await page.getByRole("button", { name: "Favorite USD" }).click();
      await openHistory(page);

      await expect(
        page.getByText(/25\.00 USD \u2192 21\.25 EUR/),
      ).toBeVisible();

      const horizontalOverflowPx = await page.evaluate(() => {
        const root = document.documentElement;
        return Math.max(0, root.scrollWidth - window.innerWidth);
      });

      expect(horizontalOverflowPx).toBeLessThanOrEqual(24);
      await expect(page.getByLabel("From currency")).toBeVisible();
      await expect(page.getByLabel("To currency")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Swap currencies" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Refresh rates" }),
      ).toBeVisible();
    });
  });
});

test.describe("error handling", () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorageOnInit(page);
    await mockRatesFailure(page, "Rates are temporarily unavailable.");
  });

  test("shows an error message when rates fail to load", async ({ page }) => {
    await loadConverter(page, "/", false);

    await expect(
      page.getByText("Rates are temporarily unavailable."),
    ).toBeVisible();
    await expect(page.getByText("Converted Amount")).toHaveCount(0);
  });
});
