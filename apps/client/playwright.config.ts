import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "src/e2e",
  use: {
    baseURL: process.env.CI
      ? "https://artificial-unintelligence-git-dev-agrattan.vercel.app"
      : "http://localhost:3000",
  },
  webServer: !process.env.CI
    ? [
        {
          command: "pnpm run dev",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
        },
        {
          command: "cd .. && cd server && pnpm run dev",
          url: "http://localhost:8080",
          reuseExistingServer: !process.env.CI,
        },
      ]
    : undefined,
});
