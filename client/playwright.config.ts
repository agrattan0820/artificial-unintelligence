import { defineConfig } from '@playwright/test';

export default defineConfig({
 testDir: "src/e2e",
   use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
   webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})