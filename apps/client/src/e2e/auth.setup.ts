import { test as setup } from "@playwright/test";

const authFile = "src/e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/api/auth/test-login?nickname=TestPlayer");
  await page.context().storageState({ path: authFile });
});
