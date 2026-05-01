---
name: playwright-test
description: >
  Creates Playwright end-to-end tests for React views using @playwright/test
  with accessibility-first locators (getByRole, getByLabel, getByText).
  Use when the user asks to "write Playwright tests", "create e2e tests", "write
  integration tests", "test in the browser", "write E2E tests", or mentions
  end-to-end testing, browser tests, UI tests, or Playwright for React.
  Also trigger when the user references a use case (UC-*) and asks for
  Playwright or E2E tests.
---

# Playwright Tests for React

Create Playwright end-to-end tests for the React view specified in $ARGUMENTS. Tests run in a real browser against the running application using `@playwright/test`.

## Setup

Tests use Playwright's built-in test runner. Install with:

```bash
npm install -D @playwright/test
npx playwright install
```

Minimal `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Devices

Test on mobile and tablet devices using Playwright's built-in device profiles. Add a `projects` array to `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    { name: "Chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "WebKit", use: { ...devices["Desktop Safari"] } },
    { name: "Pixel 7", use: { ...devices["Pixel 7"] } },
    { name: "iPad Gen 11", use: { ...devices["iPad (gen 11)"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

Run a specific device with `npx playwright test --project="Pixel 7"`.

Common device names: `"Desktop Chrome"`, `"Desktop Firefox"`, `"Desktop Safari"`, `"Pixel 7"`, `"Pixel 5"`, `"iPhone 15"`, `"iPad (gen 11)"`, `"Galaxy S9+"`.

## DO NOT

- Use `page.locator()` with CSS/XPath selectors — use accessibility locators (`getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`)
- Use `page.waitForTimeout()` or hardcoded sleeps — Playwright assertions auto-retry
- Use `page.$()` or `page.$$()` — these are legacy Puppeteer-style APIs
- Use `getAttribute()` or `isVisible()` in manual if-checks — use `expect()` matchers that auto-retry
- Import `test` from `@playwright/test` and also from another test framework — use only Playwright's runner
- Mock API responses unless explicitly asked — prefer real backend interactions for E2E tests

## Test Data

Use existing test data from seed scripts or database migrations. If your test creates data, clean it up in `test.afterEach`.

## Template

Use [templates/example-view.spec.ts](templates/example-view.spec.ts) as the starting point for new test files.

## Locating Elements

Playwright uses accessibility roles and names — not CSS selectors. This makes tests resilient to DOM changes and enforces accessibility.

### By Role (buttons, headings, dialogs, tables)

```ts
page.getByRole("button", { name: "Save" });
page.getByRole("heading", { name: "Dashboard" });
page.getByRole("dialog");
page.getByRole("row");
page.getByRole("columnheader");
page.getByRole("cell");
page.getByRole("tab", { name: "Settings" });
page.getByRole("checkbox", { name: "Accept Terms" });
page.getByRole("combobox", { name: "Country" });
```

### By Label (form fields)

```ts
page.getByLabel("Full Name");
page.getByLabel("Email");
page.getByLabel("Birth Date");
```

### By Placeholder

```ts
page.getByPlaceholder("Search...");
```

### By Text (static content, links)

```ts
page.getByText("Welcome back");
page.getByText("No results found");
```

### By Test ID (last resort)

```ts
page.getByTestId("customer-grid");
```

### Scoped Lookups (within containers)

When multiple elements share the same label, scope the lookup:

```ts
const dialog = page.getByRole("dialog");
dialog.getByLabel("Name");
dialog.getByRole("button", { name: "Confirm" });

const sidebar = page.getByRole("navigation");
sidebar.getByRole("link", { name: "Settings" });
```

### ARIA Role Reference

| Role           | Typical Elements                           |
| -------------- | ------------------------------------------ |
| `textbox`      | `<input type="text">`, `<textarea>`        |
| `button`       | `<button>`, `<input type="submit">`        |
| `checkbox`     | `<input type="checkbox">`                  |
| `radio`        | `<input type="radio">`                     |
| `combobox`     | `<select>`, autocomplete inputs            |
| `dialog`       | `<dialog>`, modal components               |
| `heading`      | `<h1>`–`<h6>`                              |
| `link`         | `<a href>`                                 |
| `row`          | `<tr>` in tables                           |
| `columnheader` | `<th>` in tables                           |
| `cell`         | `<td>` in tables                           |
| `tab`          | Tab components                             |
| `tabpanel`     | Tab content panels                         |
| `navigation`   | `<nav>`                                    |
| `alert`        | Alert/toast components with `role="alert"` |
| `spinbutton`   | `<input type="number">`                    |

## Interactions

### Text Input

```ts
const input = page.getByLabel("Username");
await input.fill("john.doe");
await input.clear();
await input.pressSequentially("slow typing", { delay: 100 });
```

### Buttons

```ts
await page.getByRole("button", { name: "Save" }).click();
await page.getByRole("button", { name: "Submit" }).dblclick();
```

### Checkboxes and Radios

```ts
await page.getByRole("checkbox", { name: "Accept Terms" }).check();
await page.getByRole("checkbox", { name: "Accept Terms" }).uncheck();
await page.getByRole("radio", { name: "Option A" }).check();
```

### Select / Combobox

```ts
await page.getByLabel("Country").selectOption("Germany");
await page.getByLabel("Country").selectOption({ label: "Germany" });
```

### Keyboard

```ts
await page.keyboard.press("Enter");
await page.keyboard.press("Escape");
await page.keyboard.press("Tab");
```

### File Upload

```ts
await page.getByLabel("Upload").setInputFiles("test-data/file.pdf");
```

### Drag and Drop

```ts
await page.getByText("Item 1").dragTo(page.getByText("Drop Zone"));
```

## Assertions

All `expect()` assertions auto-retry until the condition is met or timeout (default 5 seconds).

### Visibility

```ts
await expect(page.getByText("Welcome")).toBeVisible();
await expect(page.getByText("Loading")).toBeHidden();
await expect(page.getByRole("dialog")).not.toBeVisible();
```

### Text Content

```ts
await expect(page.getByRole("heading")).toHaveText("Dashboard");
await expect(page.getByRole("heading")).toContainText("Dash");
```

### Input Values

```ts
await expect(page.getByLabel("Name")).toHaveValue("John");
await expect(page.getByLabel("Name")).toBeEmpty();
```

### State

```ts
await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();
await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
await expect(page.getByRole("checkbox")).toBeChecked();
await expect(page.getByRole("checkbox")).not.toBeChecked();
```

### Attributes

```ts
await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
await expect(page.getByLabel("Name")).toHaveAttribute("required", "");
```

### CSS Classes

```ts
await expect(page.getByTestId("card")).toHaveClass(/active/);
```

### Count

```ts
await expect(page.getByRole("row")).toHaveCount(11); // 1 header + 10 data
```

### URL and Title

```ts
await expect(page).toHaveURL(/\/dashboard/);
await expect(page).toHaveTitle("My App");
```

## Assertions Reference

| Category   | Methods                                              |
| ---------- | ---------------------------------------------------- |
| Visibility | `toBeVisible()`, `toBeHidden()`, `not.toBeVisible()` |
| Text       | `toHaveText("...")`, `toContainText("...")`          |
| Value      | `toHaveValue("...")`, `toBeEmpty()`                  |
| State      | `toBeEnabled()`, `toBeDisabled()`, `toBeChecked()`   |
| Attribute  | `toHaveAttribute("name", "value")`                   |
| CSS        | `toHaveClass(/.../)`                                 |
| Count      | `toHaveCount(n)`                                     |
| Page       | `toHaveURL(/.../)` , `toHaveTitle("...")`            |
| Focus      | `toBeFocused()`                                      |

## Workflow

1. Read the use case specification
2. Plan test scenarios (group related tests in `test.describe` blocks)
3. Create test file in `e2e/` directory (e.g., `e2e/example-view.spec.ts`)
4. Add `test.beforeEach` for navigation to the view under test
5. For each test:
   - Use accessibility locators to find elements (`getByRole`, `getByLabel`, `getByText`)
   - Perform interactions (`fill`, `click`, `check`, `selectOption`)
   - Assert outcomes with auto-retry `expect()` matchers
   - Clean up test-created data in `test.afterEach` if needed
6. Run tests with `npx playwright test` to verify
7. On failure: use `npx playwright test --ui` for interactive debugging or `--debug` for step-through

## Troubleshooting

- **Element not found**: Check exact accessible name, ensure element is rendered, try scoped lookup within container
- **Multiple elements matched**: Use `.first()`, `.nth(n)`, or scope to a parent container
- **Flaky tests**: Replace manual waits with auto-retry `expect()` assertions, use `webServer` config to ensure app is ready
- **Visual debugging**: `npx playwright test --ui` or `npx playwright test --debug`
- **Trace on failure**: Add `use: { trace: "on-first-retry" }` to config, then view with `npx playwright show-trace`
