const { test, expect } = require("@playwright/test");

/**
 * Eenvoudige end-to-end rooktest.
 *
 * Doel:
 * - controleren of de homepage opent
 * - controleren of navigatie naar gallery werkt
 */
test("homepage loads and gallery page is reachable", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("text=Nevil's Gallery")).toBeVisible();

  await page.click("text=Explore Gallery");

  await expect(page).toHaveURL(/gallery/);
});