import { test, expect } from "@playwright/test";
import {
  clearLocalStorageOnInit,
  loadConverter,
  mockRatesResponse,
  openHistory,
} from "./test-helpers";

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
    const beforeKeyboardTo = await toSelect.inputValue();

    await toSelect.focus();
    await page.keyboard.type("g");
    await expect(toSelect).toBeFocused();
    await expect(toSelect).not.toHaveValue(beforeKeyboardTo);

    const beforeSwapTo = await toSelect.inputValue();

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
