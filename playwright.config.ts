import { defineConfig, devices } from '@playwright/test';

// E2E config for the marketing landing page (CI + local).
//
// Mirrors buy-like-local/frontend/playwright.config.ts: workers=1, CI-aware
// retries/reporter, baseURL overridable via E2E_BASE_URL. The `webServer`
// block makes `npm run test:e2e` self-contained — Playwright boots
// `next dev -p 3001` itself and waits for it, both locally and in CI.
// reuseExistingServer keeps a dev server you already have on :3001 locally.
const PORT = 3001;

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'ui', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
