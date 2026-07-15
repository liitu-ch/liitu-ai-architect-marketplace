// Playwright config for user-guide screenshots — SEPARATE from the test
// suite on purpose: guide generation must never run in CI or `npm test`.
// Adapt the marked seams to the project, then run with:
//   npx playwright test --config=scripts/user-guide/playwright.config.ts
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: __dirname,
  timeout: 180_000, // login + full data sync can be slow on first run
  workers: 1, // sequential — screenshots must be deterministic
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3030', // ← the project's dev/mock server URL
  },
  projects: [
    // ← the device end users actually work with; tablet landscape is the
    //   default for field/sales apps. Match a project from the main config.
    { name: 'iPad (gen 11) landscape', use: { ...devices['iPad (gen 11) landscape'] } },
  ],
  webServer: {
    command: 'npm run mock:dev', // ← the project's deterministic dev server
    url: 'http://localhost:3030',
    reuseExistingServer: true,
    cwd: join(__dirname, '..', '..'), // repo root
    timeout: 120_000,
  },
});
