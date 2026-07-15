// Screenshot spec for a user guide — one file per use case, one test that
// walks the main success scenario in order. Adapt the marked seams.
//
// Run: npx playwright test --config=scripts/user-guide/playwright.config.ts
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type Locator, type Page } from "@playwright/test";
// ← Reuse the project's E2E fixtures: they already solve login, data sync
//   and seeding. Never reimplement authentication here.
import { test } from "../../e2e/fixtures";

// ← Screenshots live next to the guide document, one folder per use case.
const OUT = join(__dirname, "..", "..", "docs", "user-guides", "uc-xxx");
mkdirSync(OUT, { recursive: true });

// Red frame around the element the current step talks about — purely visual
// for the screenshot, removed right after. Implemented as a fixed-position
// overlay div (NOT a CSS outline on the element itself): outlines get
// clipped by scroll/overflow containers (Ionic menus, virtualized lists) and
// silently disappear from the screenshot.
async function highlight(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("highlight: element has no bounding box");
  await page.evaluate((b) => {
    const d = document.createElement("div");
    d.id = "__guide-highlight";
    d.style.cssText =
      `position:fixed;left:${b.x - 3}px;top:${b.y - 3}px;` +
      `width:${b.width + 6}px;height:${b.height + 6}px;` +
      "border:3px solid #d70021;border-radius:8px;" +
      "z-index:999999;pointer-events:none;box-sizing:border-box;";
    document.body.appendChild(d);
  }, box);
}

async function unhighlight(page: Page) {
  await page.evaluate(() => {
    document.getElementById("__guide-highlight")?.remove();
  });
}

// Viewport screenshot (NOT fullPage — internal scroll containers like
// Ionic's ion-content make fullPage useless). Scroll the element into view
// before calling; the pause lets scroll/overlay animations settle.
async function shot(page: Page, name: string) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, name) });
}

test.describe("UC-XXX: user-guide screenshots", () => {
  test("walk the main success scenario", async ({ page }) => {
    // If a list/tile on the way would be empty, seed deterministic data
    // first (use the project's seeding helpers) — an empty widget teaches
    // the reader nothing.

    await page.goto("/start-route"); // ← entry point of the scenario
    // Wait for real content, not just navigation — e.g. a value that only
    // renders after data is loaded.
    await expect(page.locator(".some-loaded-marker").first()).toBeVisible({
      timeout: 20_000,
    });

    // 01 — overview of the screen the scenario starts on
    await shot(page, "01-overview.png");

    // 02 — highlight the element the step explains. Scroll it into view and
    // let the scroll settle BEFORE highlighting: the overlay is positioned
    // from the element's bounding box at call time.
    const element = page.locator(".step-element");
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await highlight(page, element);
    await shot(page, "02-element.png");
    await unhighlight(page);

    // 03 — interactions: click through, assert the expected result (URL,
    // dialog, list entries) BEFORE the shot — a screenshot of a wrong state
    // is worse than a failing spec.
    await element.click();
    await expect(page).toHaveURL(/\/expected-route/);
    await shot(page, "03-result.png");

    // … one numbered screenshot per scenario step. NN prefix = step order.
  });
});
