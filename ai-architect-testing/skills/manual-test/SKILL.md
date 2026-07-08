---
name: manual-test
description: >
  Creates structured manual test plans with step-by-step test cases for
  explorative user testing on real devices and browsers. Use when the user asks
  to "create a test plan", "write manual tests", "prepare user tests",
  "create acceptance tests", "write QA checklist", or mentions manual testing,
  user acceptance testing (UAT), explorative testing, device testing, or
  test protocol. Also trigger when the user references a use case (UC-*) and
  asks for manual tests or test plans.
---

# Manual Test Plan

Create a manual test plan for the feature or view specified in $ARGUMENTS. The plan documents step-by-step test cases that a human tester executes on real devices or browsers.

## Template

Use [templates/manual-test-plan.md](templates/manual-test-plan.md) as the starting point for new test plans.

## Output

Write the test plan to `docs/test-plans/{feature-name}.md`.

## DO NOT

- Write vague steps like "verify it works" — every step needs a concrete expected result
- Skip negative / error test cases — they catch the most important bugs
- Assume a specific device or browser — document the required test environment
- Number test cases without the `TC-` prefix — use `TC-001`, `TC-002`, etc.
- Mix multiple features in a single test plan — create separate plans per feature or view

## Test Case Structure

Each test case follows this format:

```markdown
## TC-001: [Descriptive Title]

**Priority:** High | Medium | Low
**Preconditions:** [What must be true before the test starts]

| Step | Action | Expected Result | Pass/Fail | Notes |
| ---- | ------ | --------------- | --------- | ----- |
| 1    | ...    | ...             |           |       |
```

### Priority Levels

| Priority | When to use                                                       |
| -------- | ----------------------------------------------------------------- |
| High     | Core user journeys, payment flows, data integrity, authentication |
| Medium   | Secondary features, edge cases that affect usability              |
| Low      | Cosmetic issues, minor UX improvements, rare edge cases           |

## Test Categories

### Happy Path

Test the main success scenario — the way the feature is intended to be used.

```markdown
## TC-001: Create a new order

**Priority:** High
**Preconditions:** User is logged in, at least one product exists.

| Step | Action                        | Expected Result                      | Pass/Fail | Notes |
| ---- | ----------------------------- | ------------------------------------ | --------- | ----- |
| 1    | Navigate to "New Order"       | Order form is displayed              |           |       |
| 2    | Select customer "Muster AG"   | Customer name appears in header      |           |       |
| 3    | Add product "Widget A", qty 3 | Line item appears, total = 3 × price |           |       |
| 4    | Tap "Submit Order"            | Success notification, order in list  |           |       |
```

### Validation & Error Handling

Test that invalid inputs are rejected with clear error messages.

```markdown
## TC-002: Submit order without required fields

**Priority:** High
**Preconditions:** User is on the "New Order" screen.

| Step | Action                             | Expected Result                     | Pass/Fail | Notes |
| ---- | ---------------------------------- | ----------------------------------- | --------- | ----- |
| 1    | Leave customer field empty         | —                                   |           |       |
| 2    | Tap "Submit Order"                 | Error: "Customer is required"       |           |       |
| 3    | Select customer, leave items empty | —                                   |           |       |
| 4    | Tap "Submit Order"                 | Error: "At least one item required" |           |       |
```

### Offline / Network

Test behavior when network is unavailable or unreliable.

```markdown
## TC-003: Order sync after reconnect

**Priority:** High
**Preconditions:** User has pending offline orders.

| Step | Action                     | Expected Result                | Pass/Fail | Notes |
| ---- | -------------------------- | ------------------------------ | --------- | ----- |
| 1    | Enable airplane mode       | App shows "Offline" indicator  |           |       |
| 2    | Create a new order         | Order is saved locally         |           |       |
| 3    | Disable airplane mode      | Orders sync automatically      |           |       |
| 4    | Check order in backend/SAP | Order exists with correct data |           |       |
```

### Cross-Device / Cross-Browser

Test on all target devices and browsers from the test matrix.

```markdown
## TC-004: Layout on tablet landscape

**Priority:** Medium
**Preconditions:** iPad in landscape orientation.

| Step | Action               | Expected Result                   | Pass/Fail | Notes |
| ---- | -------------------- | --------------------------------- | --------- | ----- |
| 1    | Open the orders list | Two-column layout (list + detail) |           |       |
| 2    | Rotate to portrait   | Single-column layout              |           |       |
```

### Native Configuration (mobile apps)

When the tested change touches native layers — a new external domain, a new device feature, an updated plugin — include configuration checks. Each forgotten entry here surfaces only on a real device, typically after the release build.

```markdown
## TC-006: New backend domain reachable on device

**Priority:** High
**Preconditions:** Release/TestFlight build installed on a physical device.

| Step | Action                                        | Expected Result                                | Pass/Fail | Notes |
| ---- | --------------------------------------------- | ---------------------------------------------- | --------- | ----- |
| 1    | Trigger a request to the new domain (iOS)     | Request succeeds (ATS exception in Info.plist) |           |       |
| 2    | Trigger the network feature (Android)         | Works (permission in AndroidManifest.xml)      |           |       |
| 3    | Install and launch on the oldest supported OS | App starts, feature works (SDK/OS constraints) |           |       |
```

### Performance / UX

Test that the app feels responsive and interactions are smooth.

```markdown
## TC-005: Large price list scrolling

**Priority:** Medium
**Preconditions:** Price list has 500+ items.

| Step | Action                         | Expected Result                     | Pass/Fail | Notes |
| ---- | ------------------------------ | ----------------------------------- | --------- | ----- |
| 1    | Open price list                | First items appear within 2 seconds |           |       |
| 2    | Scroll through the entire list | Scrolling is smooth, no jank        |           |       |
| 3    | Search for item near the end   | Result appears within 1 second      |           |       |
```

## Test Environment Matrix

Document which devices and browsers to test. Keep desktop browsers in the matrix even for mobile-first apps — event-handling bugs (e.g., a stepper counting twice per click) often reproduce only in a desktop browser, and input-type differences (touch vs. mouse) hide bugs from single-platform testing:

```markdown
## Test Matrix

| Device / Browser | OS / Version    | Screen Size | Status |
| ---------------- | --------------- | ----------- | ------ |
| Chrome (latest)  | macOS / Windows | Desktop     |        |
| Firefox (latest) | macOS / Windows | Desktop     |        |
| Safari (latest)  | macOS           | Desktop     |        |
| Safari           | iOS 17+         | iPhone 15   |        |
| Chrome           | Android 14+     | Pixel 7     |        |
| Safari           | iPadOS 17+      | iPad Gen 11 |        |
```

## Workflow

1. Read the use case specification or feature description
2. Identify test scenarios: happy path, validation, error handling, offline, cross-device, performance
3. Write test cases with `TC-XXX` IDs, priority, preconditions, and step-by-step tables
4. Include a test environment matrix listing target devices and browsers
5. Add a summary table with all test cases and their pass/fail status
6. Add an "Issues Found" section for documenting bugs during test execution
7. Save the test plan to `docs/test-plans/{feature-name}.md`

## Summary Table Format

Every test plan ends with a summary:

```markdown
## Summary

| Test Case | Title                          | Priority | Result |
| --------- | ------------------------------ | -------- | ------ |
| TC-001    | Create a new order             | High     |        |
| TC-002    | Submit without required fields | High     |        |
| TC-003    | Order sync after reconnect     | High     |        |

**Overall Result:** ☐ Pass ☐ Fail
**Tester Signature:** **\*\*\*\***\_**\*\*\*\***
**Date:** **\*\*\*\***\_**\*\*\*\***
```
