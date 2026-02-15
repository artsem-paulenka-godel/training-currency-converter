import { expect, type Page } from "@playwright/test";

export const mockRates = {
  base: "USD",
  rates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
    AUD: 1.5,
    CAD: 1.35,
    CHF: 0.91,
    CNY: 7.1,
    INR: 83,
    MXN: 17.2,
  },
  timestamp: 1700000000000,
};

export const FAVORITE_LIMIT_MESSAGE =
  "You can only favorite up to five currencies.";
export const FAVORITE_STORAGE_MESSAGE =
  "Favorites will not persist across sessions.";

export async function clearLocalStorageOnInit(page: Page) {
  await page.addInitScript(() => {
    const storageResetFlag = "__playwright_local_storage_reset_done__";
    if (window.sessionStorage.getItem(storageResetFlag)) {
      return;
    }

    window.localStorage.clear();
    window.sessionStorage.setItem(storageResetFlag, "true");
  });
}

export async function blockLocalStorageOnInit(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("localStorage blocked");
      },
    });
  });
}

export async function mockRatesResponse(page: Page) {
  await page.route("**/api/rates**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: mockRates }),
    });
  });
}

export async function mockRatesFailure(page: Page, message: string) {
  await page.route("**/api/rates**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: message,
      }),
    });
  });
}

export async function waitForFormReady(page: Page) {
  await expect(page.getByPlaceholder("Enter amount")).toBeVisible();
  await expect(page.getByLabel("From currency")).toBeVisible();
  await expect(page.getByLabel("To currency")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Swap currencies" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Refresh rates" }),
  ).toBeVisible();
}

export async function waitForSuccessfulConversion(page: Page) {
  await waitForFormReady(page);
  await expect(page.getByText("Converted Amount")).toBeVisible();
}

export async function loadConverter(
  page: Page,
  path: string = "/",
  requireSuccessfulConversion: boolean = true,
) {
  await page.goto(path);

  if (requireSuccessfulConversion) {
    await waitForSuccessfulConversion(page);
    return;
  }

  await waitForFormReady(page);
}

export async function expectQueryState(
  page: Page,
  state: { amount: string; from: string; to: string },
) {
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return {
        amount: url.searchParams.get("amount"),
        from: url.searchParams.get("from"),
        to: url.searchParams.get("to"),
      };
    })
    .toEqual(state);
}

export async function waitForLocalStorageContains(
  page: Page,
  key: string,
  text: string,
) {
  await expect
    .poll(async () => {
      return page.evaluate((storageKey) => {
        return window.localStorage.getItem(storageKey);
      }, key);
    })
    .toContain(text);
}

export async function openHistory(page: Page) {
  await page.getByRole("button", { name: /^Show/i }).click();
  await expect(page.getByRole("button", { name: /^Hide/i })).toBeVisible();
}
