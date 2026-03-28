import type { Browser } from "@playwright/test";

/**
 * Creates an authenticated browser context for a test user.
 * Calls the test-login endpoint to create a session and set the cookie.
 */
export async function createAuthenticatedContext(
  browser: Browser,
  nickname: string,
  baseURL: string,
) {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto(`/api/auth/test-login?nickname=${nickname}`);
  // Navigate away from the JSON response page
  await page.goto("/");
  return { context, page };
}
