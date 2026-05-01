---
name: testing-concept
description: >
  Creates a project-level TESTING.md that documents the testing concept
  from the project's perspective: which test levels are used (manual,
  E2E/Playwright, unit/Vitest), why each is needed, and project-specific
  details (commands, focus areas, device matrix, backend integration).
  Use when the user asks to "create a testing concept", "write a TESTING.md",
  "document our testing strategy", "create a test overview", "set up testing
  documentation", or mentions needing a project-level overview of all test levels.
---

# Testing Concept Document

Create a `TESTING.md` at the project root that describes the project's testing concept: which test levels are used, why they are needed in this specific project context, and the project-specific details for each level (commands, focus areas, device matrix).

This document is a **project concept document**, not a how-to guide. It captures the team's decisions about testing strategy. Individual test-writing guidance lives in the plugin skills (`/playwright-test`, `/vitest`, `/manual-test`).

## Output

Write to `TESTING.md` in the project root.

## DO NOT

- Include generic test-writing instructions (how to use `getByRole`, how to structure `describe` blocks, etc.) — those belong in the plugin skills
- Leave placeholder text unfilled — every `{...}` must be replaced with real project context
- Write in a language that doesn't match the team's working language

## What to Include

### Header

A two-line callout referencing the plugin and its skills, so readers know where to find test-creation guidance:

```md
> Testartefakte werden mit dem Plugin `ai-architect-testing` erstellt.
> Skills: `/manual-test` · `/playwright-test` · `/vitest`
```

### Per test level: Was / Warum / Wie

For each of the three test levels (manual, E2E, unit), write three subsections:

- **Was**: One-sentence definition of what this test level covers in this project
- **Warum**: Why this level is needed given the project's specific constraints (mobile app, SAP backend, complex business logic, etc.) — not generic rationale
- **Wie** (project-specific only):
  - Manual: which devices, which user journeys, release process, issue tracking
  - E2E: framework config location, test directory, how the app is started (dev server / mock server + command + port), target browsers and mobile devices, focus areas, run command, skill reference
  - Unit: framework, file location convention, focus areas (domain classes, mappers, components, architecture checks), run command, skill reference

### Summary Table

| Level  | Tool       | Speed  | Coverage                     |
| ------ | ---------- | ------ | ---------------------------- |
| Manual | –          | Slow   | UX, native behavior, devices |
| E2E    | Playwright | Medium | Full user journeys, browsers |
| Unit   | Vitest     | Fast   | Logic, mappers, components   |

## Workflow

1. Identify tech stack and backend integration from the codebase
2. Find test commands in `package.json`
3. Check `playwright.config.ts` for browser/device configuration and test server setup
4. Identify key domain classes, mappers, and architecture layers from the source tree
5. Ask the user for manual testing scope (real devices, user journeys, release cadence)
6. Fill in all project-specific details — write in the team's language
7. Write to `TESTING.md`

## Template

Use [templates/testing-concept.md](templates/testing-concept.md) as the starting point.
