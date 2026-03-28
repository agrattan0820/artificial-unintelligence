import { test, expect } from "@playwright/test";
import { createAuthenticatedContext } from "./helpers/create-authenticated-context";

test("should display join game form on invite page", async ({
  browser,
  baseURL,
}) => {
  const baseUrl = baseURL ?? "http://localhost:3000";

  // Host a room to get an invite link
  const { context: hostContext, page: hostPage } =
    await createAuthenticatedContext(browser, "Host", baseUrl);

  const hostNicknameInput = hostPage.locator("#nickname");
  await hostNicknameInput.fill("Host");
  await hostPage.getByRole("button", { name: "Host Game" }).click();
  await expect(hostPage).toHaveURL(/room/, { timeout: 15000 });

  // Get the invite link
  await expect(hostPage.locator("#inviteLink")).toHaveText(/invite/);
  const inviteURL = await hostPage.locator("#inviteLink").textContent();
  expect(inviteURL).toBeTruthy();

  if (inviteURL) {
    // Visit invite page as a new user
    const { context: guestContext, page: guestPage } =
      await createAuthenticatedContext(browser, "Guest", baseUrl);

    await guestPage.goto(`http://${inviteURL}`);

    // Verify invite page has the join form
    await expect(guestPage.locator("#nickname")).toBeVisible();
    await expect(
      guestPage.getByRole("button", { name: "Join Game" }),
    ).toBeVisible();
    await expect(
      guestPage.getByRole("link", { name: "How to Play" }),
    ).toBeVisible();

    await guestContext.close();
  }

  await hostContext.close();
});
