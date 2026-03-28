import { test, expect } from "@playwright/test";

test.describe("Account page", () => {
  test("should display account heading and user info", async ({ page }) => {
    await page.goto("/account");

    await expect(
      page.getByRole("heading", { name: "Your Account" }),
    ).toBeVisible();
    await expect(page.getByText("Name:")).toBeVisible();
    await expect(page.getByText("Email:")).toBeVisible();
  });

  test("should have a sign out button", async ({ page }) => {
    await page.goto("/account");

    await expect(
      page.getByRole("button", { name: "Sign Out" }),
    ).toBeVisible();
  });

  test("should open delete account confirmation modal", async ({ page }) => {
    await page.goto("/account");

    await page.getByRole("button", { name: "Delete Account" }).click();

    await expect(
      page.getByText("Are you sure you would like to delete your account?"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "No, nevermind" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Yes, delete my account" }),
    ).toBeVisible();
  });

  test("should close delete account modal when dismissed", async ({
    page,
  }) => {
    await page.goto("/account");

    await page.getByRole("button", { name: "Delete Account" }).click();
    await expect(
      page.getByText("Are you sure you would like to delete your account?"),
    ).toBeVisible();

    await page.getByRole("button", { name: "No, nevermind" }).click();
    await expect(
      page.getByText("Are you sure you would like to delete your account?"),
    ).not.toBeVisible();
  });
});
