import { test, expect } from "@playwright/test";

test("should have the nickname input", async ({ page }) => {
  // navigate to the homepage
  await page.goto("/");
  // check to see if the nickname text input is visible
  await expect(page.locator("#nickname")).toBeVisible();
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

test("multiple users should be able to join a room", async ({ browser }) => {
  // Create three isolated users
  const bigAlContext = await browser.newContext();
  const bobContext = await browser.newContext();
  const billContext = await browser.newContext();

  // Create pages and interact with contexts independently
  const bigAlPage = await bigAlContext.newPage();
  const bobPage = await bobContext.newPage();
  const billPage = await billContext.newPage();

  // Big Al will be the host and goes to the homepage
  await bigAlPage.goto("/");

  // Enters nickname into input
  const bigAlNicknameInput = bigAlPage.locator("#nickname");
  await bigAlNicknameInput.fill("Big Al");
  await expect(bigAlNicknameInput).toHaveValue("Big Al");

  // Submits nickname
  const bigAlSubmitButton = bigAlPage.getByRole("button", {
    name: "Host Game",
  });
  await expect(bigAlSubmitButton).toBeVisible();
  await bigAlSubmitButton.click();

  // Should be navigated to the room lobby page
  await expect(bigAlPage).toHaveURL(/room/);

  // Grab invite link for room
  await expect(bigAlPage.locator("#inviteLink")).toHaveText(/invite/);
  const inviteURL = await bigAlPage.locator("#inviteLink").textContent();
  expect(inviteURL).toBeTruthy();

  if (inviteURL) {
    // Invite Bob
    await bobPage.goto(inviteURL);
    const bobNicknameInput = bobPage.locator("#nickname");
    await bobNicknameInput.fill("Bob");
    await expect(bobNicknameInput).toHaveValue("Bob");
    const bobSubmitButton = bobPage.getByRole("button", {
      name: "Join Game",
    });
    await expect(bobSubmitButton).toBeVisible();
    await bobSubmitButton.click();
    await expect(bobPage).toHaveURL(/room/);

    // Invite Bill
    await billPage.goto(inviteURL);
    const billNicknameInput = billPage.locator("#nickname");
    await billNicknameInput.fill("Bill");
    await expect(billNicknameInput).toHaveValue("Bill");
    const billSubmitButton = billPage.getByRole("button", {
      name: "Join Game",
    });
    await expect(billSubmitButton).toBeVisible();
    await billSubmitButton.click();
    await expect(billPage).toHaveURL(/room/);
  }
});
