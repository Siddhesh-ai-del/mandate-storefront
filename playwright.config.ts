import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: [
    {
      command: "npx tsx --env-file-if-exists=.env server/index.ts",
      port: 3001,
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      command: "npx vite",
      port: 5173,
      reuseExistingServer: true,
      timeout: 15000,
    },
  ],
});
