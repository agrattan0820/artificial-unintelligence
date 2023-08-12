import { test, expect } from "@playwright/test";

test("homepage should have the nickname input", async ({ page }) => {
  // navigate to the homepage
  await page.goto("http://localhost:3000/");
  // check to see if the nickname text input is visible
  await expect(page.locator("#nickname")).toBeVisible();
});
