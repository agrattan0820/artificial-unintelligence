import { test, expect } from "@playwright/test";
import { createAuthenticatedContext } from "./helpers/create-authenticated-context";

test("should display invite link and invite players button in room", async ({
  browser,
  baseURL,
}) => {
  const baseUrl = baseURL ?? "http://localhost:3000";

  const { context, page } = await createAuthenticatedContext(
    browser,
    "Host",
    baseUrl,
  );

  const nicknameInput = page.locator("#nickname");
  await nicknameInput.fill("Host");
  await page.getByRole("button", { name: "Host Game" }).click();

  await expect(page).toHaveURL(/room/, { timeout: 15000 });
  await expect(page.locator("#inviteLink")).toHaveText(/invite/);
  await expect(
    page.getByRole("button", { name: "Invite Players" }),
  ).toBeVisible();

  await context.close();
});

test("should show waiting message for non-host player", async ({
  browser,
  baseURL,
}) => {
  const baseUrl = baseURL ?? "http://localhost:3000";

  // Host creates a room
  const { context: hostContext, page: hostPage } =
    await createAuthenticatedContext(browser, "RoomHost", baseUrl);

  await hostPage.locator("#nickname").fill("RoomHost");
  await hostPage.getByRole("button", { name: "Host Game" }).click();
  await expect(hostPage).toHaveURL(/room/, { timeout: 15000 });

  // Get invite link
  await expect(hostPage.locator("#inviteLink")).toHaveText(/invite/);
  const inviteURL = await hostPage.locator("#inviteLink").textContent();
  expect(inviteURL).toBeTruthy();

  if (inviteURL) {
    // Player 2 joins
    const { context: p2Context, page: p2Page } =
      await createAuthenticatedContext(browser, "Player2", baseUrl);

    await p2Page.goto(`http://${inviteURL}`);
    await p2Page.locator("#nickname").fill("Player2");
    await p2Page.getByRole("button", { name: "Join Game" }).click();
    await expect(p2Page).toHaveURL(/room/, { timeout: 15000 });

    // Non-host should see waiting message (only 2 players, need 3)
    await expect(
      p2Page.getByText("Need 1 more player to start a game"),
    ).toBeVisible();

    // Player 3 joins
    const { context: p3Context, page: p3Page } =
      await createAuthenticatedContext(browser, "Player3", baseUrl);

    await p3Page.goto(`http://${inviteURL}`);
    await p3Page.locator("#nickname").fill("Player3");
    await p3Page.getByRole("button", { name: "Join Game" }).click();
    await expect(p3Page).toHaveURL(/room/, { timeout: 15000 });

    // Non-host with enough players should see waiting on host message
    await expect(
      p3Page.getByText("Waiting on host to start game..."),
    ).toBeVisible();

    // Host should see Start Game button
    await expect(
      hostPage.getByRole("button", { name: "Start Game" }),
    ).toBeVisible();

    await p2Context.close();
    await p3Context.close();
  }

  await hostContext.close();
});
