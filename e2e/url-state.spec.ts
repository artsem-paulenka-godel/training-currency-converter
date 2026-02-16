import { test, expect } from "@playwright/test";
import {
  clearLocalStorageOnInit,
  expectQueryState,
  loadConverter,
  mockRatesResponse,
} from "./test-helpers";

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
