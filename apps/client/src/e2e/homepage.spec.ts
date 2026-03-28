import { test, expect } from "@playwright/test";
import { createAuthenticatedContext } from "./helpers/create-authenticated-context";

test("should have the nickname input", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#nickname")).toBeVisible();
});

test("should enforce nickname max length of 15 characters", async ({
  page,
}) => {
  await page.goto("/");

  const nicknameInput = page.locator("#nickname");
  await expect(nicknameInput).toHaveAttribute("maxlength", "15");

  await nicknameInput.fill("ThisIsAVeryLongNickname");
  await expect(nicknameInput).toHaveValue("ThisIsAVeryLong");
});

test("should require nickname before hosting", async ({ page }) => {
  await page.goto("/");

  const nicknameInput = page.locator("#nickname");
  await expect(nicknameInput).toHaveAttribute("required", "");
});

test("should be able to host a room", async ({ page }) => {
  await page.goto("/");

  const nicknameInput = page.locator("#nickname");
  await nicknameInput.fill("Big Al");
  await expect(nicknameInput).toHaveValue("Big Al");

  const submitButton = page.getByRole("button", {
    name: "Host Game",
  });
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(page).toHaveURL(/room/);
});

test("multiple users should be able to join a room", async ({
  browser,
  baseURL,
}) => {
  const baseUrl = baseURL ?? "http://localhost:3000";

  // Create three authenticated users
  const { context: bigAlContext, page: bigAlPage } =
    await createAuthenticatedContext(browser, "Big Al", baseUrl);
  const { context: bobContext, page: bobPage } =
    await createAuthenticatedContext(browser, "Bob", baseUrl);
  const { context: billContext, page: billPage } =
    await createAuthenticatedContext(browser, "Bill", baseUrl);

  // Big Al hosts a game
  const bigAlNicknameInput = bigAlPage.locator("#nickname");
  await bigAlNicknameInput.fill("Big Al");
  await expect(bigAlNicknameInput).toHaveValue("Big Al");

  const bigAlSubmitButton = bigAlPage.getByRole("button", {
    name: "Host Game",
  });
  await expect(bigAlSubmitButton).toBeVisible();
  await bigAlSubmitButton.click();

  await expect(bigAlPage).toHaveURL(/room/, { timeout: 15000 });

  // Grab invite link for room
  await expect(bigAlPage.locator("#inviteLink")).toHaveText(/invite/);
  const inviteURL = await bigAlPage.locator("#inviteLink").textContent();
  expect(inviteURL).toBeTruthy();

  if (inviteURL) {
    // The invite link text is displayed without the protocol prefix,
    // so we need to add it back
    const fullInviteURL = `http://${inviteURL}`;

    // Bob joins
    await bobPage.goto(fullInviteURL);
    const bobNicknameInput = bobPage.locator("#nickname");
    await bobNicknameInput.fill("Bob");
    await expect(bobNicknameInput).toHaveValue("Bob");
    const bobSubmitButton = bobPage.getByRole("button", {
      name: "Join Game",
    });
    await expect(bobSubmitButton).toBeVisible();
    await bobSubmitButton.click();
    await expect(bobPage).toHaveURL(/room/, { timeout: 15000 });

    // Bill joins
    await billPage.goto(fullInviteURL);
    const billNicknameInput = billPage.locator("#nickname");
    await billNicknameInput.fill("Bill");
    await expect(billNicknameInput).toHaveValue("Bill");
    const billSubmitButton = billPage.getByRole("button", {
      name: "Join Game",
    });
    await expect(billSubmitButton).toBeVisible();
    await billSubmitButton.click();
    await expect(billPage).toHaveURL(/room/, { timeout: 15000 });
  }

  await bigAlContext.close();
  await bobContext.close();
  await billContext.close();
});
