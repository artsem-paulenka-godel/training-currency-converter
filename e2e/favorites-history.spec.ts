import { test, expect } from "@playwright/test";
import {
  clearLocalStorageOnInit,
  expectQueryState,
  FAVORITE_LIMIT_MESSAGE,
  loadConverter,
  mockRatesResponse,
  openHistory,
  waitForLocalStorageContains,
  waitForSuccessfulConversion,
} from "./test-helpers";

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
