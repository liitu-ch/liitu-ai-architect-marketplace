---
name: vitest
description: >
  Creates Vitest unit tests for React components, domain logic, and data mappers
  using @testing-library/react with accessibility-first queries.
  Use when the user asks to "write unit tests", "create Vitest tests", "test a
  function", "test a component", "write tests for this module", or mentions
  unit testing, Vitest, testing-library, component tests, or snapshot tests.
  Also trigger when the user references a use case (UC-*) and asks for unit
  tests or logic tests.
---

# Unit Tests with Vitest

Create Vitest unit tests for the code specified in $ARGUMENTS. Tests run fast in Node without a browser and cover domain logic, data mappers, and React components in isolation.

## Setup

Tests use Vitest as the test runner with `@testing-library/react` for component tests.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Minimal `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

Setup file `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

## DO NOT

- Use `render()` without `@testing-library/react` — never use `ReactDOM.render` directly
- Use `container.querySelector()` — use accessibility queries (`getByRole`, `getByLabelText`, `getByText`)
- Use `act()` directly — `userEvent` and `waitFor` handle this automatically
- Use `jest.fn()` — use `vi.fn()` (Vitest equivalent)
- Use `enzyme` or `shallow()` — use `@testing-library/react` with full rendering
- Mock everything — only mock external boundaries (API calls, timers), not internal modules
- Write snapshot tests as the primary assertion — prefer explicit assertions on behavior and output
- Test mappers with a single happy-path example — cover the format edge cases (leading zeros, prefixes, empty fields, special characters); naive mappings against external systems are a recurring source of production bugs

## Templates

Use these as starting points depending on what you're testing:

- [templates/example.test.ts](templates/example.test.ts) — domain logic / pure functions
- [templates/example-component.test.tsx](templates/example-component.test.tsx) — React components
- [templates/example-mapper.test.ts](templates/example-mapper.test.ts) — data mappers / adapters

## Test Categories

### Domain Logic

Test pure functions and business rules. No mocks needed.

```ts
import { describe, it, expect } from "vitest";
import { calculateDiscount } from "./pricing";

describe("calculateDiscount", () => {
  it("applies 10% for orders over 1000", () => {
    expect(calculateDiscount(1500)).toBe(150);
  });

  it("returns 0 for small orders", () => {
    expect(calculateDiscount(500)).toBe(0);
  });
});
```

### Data Mappers

Test transformations between external formats (SAP, API responses) and internal models. **Mapper tests are mandatory for every mapper** — naive mappings (e.g., an `endsWith` shortcut instead of the real number-derivation rule) repeatedly reach production.

```ts
import { describe, it, expect } from "vitest";
import { mapApiResponse } from "./customer-mapper";

describe("mapApiResponse", () => {
  it("maps API fields to domain model", () => {
    const response = { KUNNR: "42", NAME1: "Acme" };
    expect(mapApiResponse(response)).toEqual({
      id: "42",
      name: "Acme",
    });
  });
});
```

Every mapper test suite must cover:

- The documented mapping rule itself — assert the full rule (padding, prefixes, derivations), not a lookalike shortcut
- Format edge cases: leading zeros, prefixes, empty and missing fields
- Unicode/special characters wherever text is compared or searched — normalize (`String.prototype.normalize`) and test accented input (é, ö, ç)
- One regression test per fixed mapping bug, named after the business rule it pins (e.g., `BR-078`)

### React Components

Test rendering, user interactions, and state changes.

```ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("calls onSearch when user types and submits", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchField onSearch={onSearch} />);

    await user.type(screen.getByRole("searchbox"), "test query");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("test query");
  });
});
```

### Architecture

Test that module imports don't cross layer boundaries (e.g. Domain, Application, Infrastructure, Presentation). These are plain import checks — no framework needed.

```ts
import { describe, it, expect } from "vitest";

describe("layer boundaries", () => {
  it("domain does not import from infrastructure", async () => {
    const src = await import("../domain/pricing?raw");
    expect(src.default).not.toMatch(/from ['"].*infrastructure/);
  });
});
```

## Locating Elements (Testing Library)

Use accessibility queries — same philosophy as Playwright, but for unit tests.

### Priority Order (prefer top to bottom)

1. **`getByRole`** — buttons, headings, checkboxes, textboxes, etc.
2. **`getByLabelText`** — form fields with associated labels
3. **`getByPlaceholderText`** — inputs with placeholder
4. **`getByText`** — non-interactive content, links
5. **`getByDisplayValue`** — inputs showing a specific value
6. **`getByAltText`** — images
7. **`getByTestId`** — last resort

### Examples

```ts
screen.getByRole("button", { name: "Save" });
screen.getByRole("heading", { level: 2 });
screen.getByRole("checkbox", { name: "Accept Terms" });
screen.getByRole("combobox", { name: "Country" });
screen.getByLabelText("Email");
screen.getByText("No results found");
screen.getByPlaceholderText("Search...");
```

### Within (scoped queries)

```ts
import { within } from "@testing-library/react";

const dialog = screen.getByRole("dialog");
within(dialog).getByRole("button", { name: "Confirm" });
```

## Interactions (userEvent)

Always use `userEvent` over `fireEvent` — it simulates real user behavior (focus, keyboard, pointer).

```ts
const user = userEvent.setup();

// Text input
await user.type(screen.getByRole("textbox"), "hello");
await user.clear(screen.getByRole("textbox"));

// Click
await user.click(screen.getByRole("button", { name: "Save" }));
await user.dblClick(screen.getByText("Edit"));

// Keyboard
await user.keyboard("{Enter}");
await user.tab();

// Select
await user.selectOptions(screen.getByRole("combobox"), "Germany");

// Checkbox
await user.click(screen.getByRole("checkbox", { name: "Active" }));

// File upload
const file = new File(["content"], "test.pdf", { type: "application/pdf" });
await user.upload(screen.getByLabelText("Upload"), file);
```

## Assertions

### DOM State

```ts
expect(screen.getByRole("button")).toBeEnabled();
expect(screen.getByRole("button")).toBeDisabled();
expect(screen.getByRole("textbox")).toHaveValue("hello");
expect(screen.getByRole("textbox")).toBeRequired();
expect(screen.getByRole("checkbox")).toBeChecked();
expect(screen.getByRole("heading")).toHaveTextContent("Dashboard");
```

### Visibility

```ts
expect(screen.getByText("Welcome")).toBeVisible();
expect(screen.queryByText("Error")).not.toBeInTheDocument();
```

### Async (waiting for state changes)

```ts
import { waitFor } from "@testing-library/react";

await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeVisible();
});

// Or use findBy (combines getBy + waitFor)
const message = await screen.findByText("Success");
expect(message).toBeVisible();
```

### CSS / Attributes

```ts
expect(screen.getByTestId("card")).toHaveClass("active");
expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
```

## Mocking

### Functions

```ts
const handler = vi.fn();
render(<Button onClick={handler} />);
await user.click(screen.getByRole("button"));
expect(handler).toHaveBeenCalledOnce();
```

### API Calls

```ts
import { vi } from "vitest";
import * as api from "./api";

vi.spyOn(api, "fetchCustomers").mockResolvedValue([{ id: "1", name: "Acme" }]);
```

### Timers

```ts
vi.useFakeTimers();
// ... trigger timer-dependent code
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

## Assertions Reference

| Category   | Methods                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| Presence   | `toBeInTheDocument()`, `not.toBeInTheDocument()`                            |
| Visibility | `toBeVisible()`, `not.toBeVisible()`                                        |
| Text       | `toHaveTextContent("...")`, `toHaveDisplayValue("...")`                     |
| Value      | `toHaveValue("...")`, `toBeRequired()`, `toBeEmpty()`                       |
| State      | `toBeEnabled()`, `toBeDisabled()`, `toBeChecked()`                          |
| Attribute  | `toHaveAttribute("name", "value")`, `toHaveClass("...")`                    |
| Mock calls | `toHaveBeenCalled()`, `toHaveBeenCalledWith(...)`, `toHaveBeenCalledOnce()` |
| Async      | `waitFor(() => expect(...))`, `findByText(...)`, `findByRole(...)`          |

## Workflow

1. Read the code to be tested — understand inputs, outputs, and side effects
2. Plan test cases (group by behavior in `describe` blocks)
3. Create test file next to the source file (e.g., `pricing.test.ts` beside `pricing.ts`)
4. For each test:
   - Arrange: set up inputs, render components, mock boundaries
   - Act: call function or simulate user interaction
   - Assert: verify output or DOM state with explicit assertions
5. Run tests with `npm test` or `npx vitest` to verify
6. On failure: check test output, use `npx vitest --reporter=verbose` for details

## Troubleshooting

- **"document is not defined"**: Ensure `environment: "jsdom"` is set in vitest config
- **Testing Library matchers not found**: Add `@testing-library/jest-dom/vitest` to `setupFiles`
- **`act()` warnings**: Use `userEvent.setup()` and `await` all interactions — don't wrap in `act()` manually
- **Element not found**: Check accessible name/role, use `screen.debug()` to inspect rendered output
- **Async state not updated**: Use `findBy*` queries or `waitFor` instead of `getBy*`
