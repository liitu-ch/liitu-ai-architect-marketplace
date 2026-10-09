// Store screenshot spec — one test per screen (or per screen group that shares
// a navigation), walking the product's story in the order the store will show
// the images. Adapt the marked seams.
//
// Run one slot at a time:
//   npx playwright test --config=scripts/store/playwright.config.ts --project=iphone-69
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page } from "@playwright/test";
import sharp from "sharp";
// ← Reuse the project's E2E fixtures: login, data load, language switch and
//   seeding helpers are solved there. Never reimplement authentication here.
import { test } from "../../e2e/fixtures";

// ← Showcase records: real-looking seed records with every field filled (no
//   placeholder notes, matching names/e-mails, a customer class, an address).
//   Name them here with the reason so a re-seed can be checked against them.
const SHOWCASE_CUSTOMER = "100536"; // class A, protection date set, full address
const SHOWCASE_MATERIALS = ["2000100", "2000205", "2000246"]; // one with a discount

// ← Development-only UI that must never appear in a store image.
const HIDE_IN_STORE = [".tabbar-system-badge", ".auto-sync-next-check-note"];

const LANGUAGE = "de"; // ← one run per language; folder below follows it

function outDir(): string {
  const dir = join(
    import.meta.dirname, // use __dirname in CommonJS projects
    "..",
    "..",
    "resources",
    "store",
    LANGUAGE,
    test.info().project.name,
  );
  mkdirSync(dir, { recursive: true });
  return dir;
}

// Viewport screenshot in device pixels. JPEG, because both stores reject
// images with an alpha channel and Playwright PNGs always carry one. When the
// project defines `metadata.storeSize` the image is brought to that exact
// size with sharp — cover-fit, never stretched.
async function shot(page: Page, name: string): Promise<void> {
  await page.addStyleTag({
    content: `${HIDE_IN_STORE.join(",")}{display:none !important}`,
  });
  await page.waitForTimeout(600); // let scroll/transition animations settle
  const target = join(outDir(), name);
  const storeSize = test.info().project.metadata?.storeSize as
    { width: number; height: number } | undefined;
  if (!storeSize) {
    await page.screenshot({ path: target, scale: "device", quality: 95 });
    return;
  }
  const raw = await page.screenshot({ scale: "device", type: "png" });
  await sharp(raw)
    .resize(storeSize.width, storeSize.height, { fit: "cover" })
    .removeAlpha()
    .jpeg({ quality: 95 })
    .toFile(target);
}

// Side menu (overlay below the split-pane breakpoint): close and wait until it
// is really gone. A single close() can be swallowed by a running page
// transition — then the menu stays over the content and eats every click.
async function closeMenu(page: Page): Promise<void> {
  const isOpen = () =>
    page.evaluate(
      () =>
        document.querySelector("ion-menu")?.classList.contains("show-menu") ===
        true,
    );
  await expect(async () => {
    if (!(await isOpen())) return;
    await page.evaluate(async () => {
      const menu = document.querySelector("ion-menu") as
        (HTMLElement & { close?: () => Promise<boolean> }) | null;
      if (menu?.close) await menu.close();
    });
    expect(await isOpen()).toBe(false);
  }).toPass({ timeout: 15_000 });
  await page.waitForTimeout(800); // closing animation outlives the class change
}

test.describe("Store screenshots", () => {
  test.use({ language: LANGUAGE }); // ← the fixture's language option

  test("01 overview", async ({ page }) => {
    // ← Tiles that show only today's records need seeded "today" data with
    //   realistic customers and amounts — use the project's seeding helper.
    await page.goto("/dashboard");
    await expect(page.locator(".dashboard-card ion-badge").first()).toBeVisible(
      {
        timeout: 20_000,
      },
    );
    await shot(page, "01-dashboard.jpg");
  });

  test("02 list and detail", async ({ page }) => {
    await page.goto("/customers");
    await expect(page.locator(".customer-list-item").first()).toBeVisible({
      timeout: 20_000,
    });
    await shot(page, "02-customers.jpg");

    // Detail of the showcase record — never the first random row.
    await page.locator("ion-searchbar input").first().fill(SHOWCASE_CUSTOMER);
    await page
      .locator(".customer-list-item")
      .filter({ hasText: SHOWCASE_CUSTOMER })
      .first()
      .click();
    await expect(page.locator("ion-modal ion-title").first()).toBeVisible({
      timeout: 10_000,
    });
    await shot(page, "03-customer-detail.jpg");
  });

  test("03 core flow with totals", async ({ page }) => {
    test.slow(); // navigation + price calculation
    await page.goto("/orders/new");
    await closeMenu(page);
    for (const materialId of SHOWCASE_MATERIALS) {
      // ← the project's "add article" helper from the E2E suite
      await page.locator(".direct-entry-input input").fill(materialId);
      await page.getByRole("button", { name: /add to order/i }).click();
    }
    // Wait for the asynchronous calculation, not just for the rows.
    await expect(page.locator(".order-total-value").last()).not.toHaveText(
      "CHF 0.00",
      {
        timeout: 20_000,
      },
    );
    await shot(page, "04-order.jpg");
  });

  test("04 map", async ({ page }) => {
    // Maps: open via the focus path on the showcase record (zoomed, sheet open)
    // instead of the whole country with one cluster; wait for tiles.
    await page.goto(`/customers/map?customer=${SHOWCASE_CUSTOMER}`);
    await expect(page.locator(".maplibregl-canvas")).toBeVisible({
      timeout: 30_000,
    });
    await page
      .waitForLoadState("networkidle", { timeout: 30_000 })
      .catch(() => {});
    await page.waitForTimeout(2_000);
    await shot(page, "05-map.jpg");
  });

  // … one test per remaining screen from the agreed list, NN prefix = story order.
});
