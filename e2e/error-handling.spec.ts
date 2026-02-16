import { test, expect } from "@playwright/test";
import {
  clearLocalStorageOnInit,
  loadConverter,
  mockRatesFailure,
} from "./test-helpers";

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
