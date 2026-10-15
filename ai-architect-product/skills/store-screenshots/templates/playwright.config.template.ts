// Playwright config for store screenshots — SEPARATE from the test suite on
// purpose: store assets are generated on demand, never in CI or `npm test`.
// Adapt the marked seams, then run one slot at a time:
//   npx playwright test --config=scripts/store/playwright.config.ts --project=iphone-69
//
// Sizes per slot: see the store-listing REFERENCE.md of the ai-architect-product
// plugin, and verify against the store's upload dialog before uploading.
//
// Two ways to hit a store size:
//   a) viewport × deviceScaleFactor equals the store size (iPhone, iPad 13");
//   b) a different layout device is captured and the spec resizes the image to
//      `metadata.storeSize` with sharp (fit: cover, never stretched) — used when
//      the product's real device (e.g. iPad 11") differs from the store slot.
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: import.meta.dirname, // use __dirname in CommonJS projects
  timeout: 180_000, // login + full data load per test
  workers: 1, // sequential — deterministic data and screenshots
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3030", // ← the project's deterministic dev/mock server
  },
  projects: [
    // ── Apple ───────────────────────────────────────────────────────────────
    {
      // iPhone 6.9" slot: 440×956 pt @3× = 1320×2868 px (portrait).
      name: "iphone-69",
      use: {
        ...devices["iPhone 15 Pro Max"],
        viewport: { width: 440, height: 956 }, // full screen, not Safari's viewport
        deviceScaleFactor: 3,
      },
    },
    {
      // iPhone 6.3" slot: 402×874 pt @3× = 1206×2622 px (portrait).
      name: "iphone-63",
      use: {
        ...devices["iPhone 15 Pro"],
        viewport: { width: 402, height: 874 },
        deviceScaleFactor: 3,
      },
    },
    {
      // iPad 13" slot captured on an 11" layout: 1194 pt wide (iPad Pro 11"),
      // height stretched to 4:3 (896 instead of 834 pt) because the store only
      // accepts 13" ratios; rendered slightly above target and resized by sharp.
      name: "ipad-13",
      use: {
        ...devices["iPad Pro 11 landscape"],
        viewport: { width: 1194, height: 896 },
        deviceScaleFactor: 2.3,
      },
      metadata: { storeSize: { width: 2732, height: 2048 } },
    },
    // ── Google Play ─────────────────────────────────────────────────────────
    {
      // Phone slot: 9:16, recommended 1080×1920. Pixel 7 is 412×915 pt @2.625×;
      // resized to exactly 1080×1920.
      name: "android-phone",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 412, height: 915 },
      },
      metadata: { storeSize: { width: 1080, height: 1920 } },
    },
    {
      // 10" tablet slot: 16:9 landscape, ≥1080 px per side. 1280×720 pt @2× =
      // 2560×1440 px (16:9) — no resize needed; Chromium with touch.
      name: "android-10",
      use: {
        ...devices["Galaxy Tab S4 landscape"],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: {
    command: "npm run mock:dev", // ← the project's deterministic dev server
    url: "http://localhost:3030",
    reuseExistingServer: true,
    cwd: join(import.meta.dirname, "..", ".."), // repo root
    timeout: 120_000,
  },
});
