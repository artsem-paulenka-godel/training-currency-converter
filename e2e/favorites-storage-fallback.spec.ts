import { test, expect } from "@playwright/test";
import {
  blockLocalStorageOnInit,
  FAVORITE_STORAGE_MESSAGE,
  loadConverter,
  mockRatesResponse,
} from "./test-helpers";

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
