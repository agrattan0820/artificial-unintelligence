import { test, expect } from "@playwright/test";

test.describe("How to Play page", () => {
  test("should display main heading and game phase sections", async ({
    page,
  }) => {
    await page.goto("/how-to-play");

    await expect(page.getByRole("heading", { name: "How to Play" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Generation Phase" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Face-Off Phase" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Scoring and Winning the Game" }),
    ).toBeVisible();
  });

  test("should have a working back to homepage link", async ({ page }) => {
    await page.goto("/how-to-play");

    await page.getByRole("link", { name: "Back to Homepage" }).click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("Privacy Policy page", () => {
  test("should display the privacy policy heading", async ({ page }) => {
    await page.goto("/privacy-policy");

    await expect(
      page.getByRole("heading", { name: "Privacy Policy", exact: true }),
    ).toBeVisible();
  });

  test("should have a contact email link", async ({ page }) => {
    await page.goto("/privacy-policy");

    await expect(page.getByRole("link", { name: "alex@grattan.me" })).toBeVisible();
  });
});

test.describe("Homepage navigation", () => {
  test("should navigate to How to Play from homepage", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "How to Play" }).click();

    await expect(page).toHaveURL("/how-to-play");
    await expect(page.getByRole("heading", { name: "How to Play" })).toBeVisible();
  });

  test("should have a Privacy Policy link in the footer", async ({ page }) => {
    await page.goto("/");

    const privacyLink = page.getByRole("link", { name: "Privacy Policy" });
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();

    await expect(page).toHaveURL("/privacy-policy");
  });
});
