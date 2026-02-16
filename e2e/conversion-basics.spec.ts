import { test, expect } from "@playwright/test";
import {
  clearLocalStorageOnInit,
  expectQueryState,
  loadConverter,
  mockRatesResponse,
  waitForSuccessfulConversion,
} from "./test-helpers";

test.describe("conversion basics", () => {
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
