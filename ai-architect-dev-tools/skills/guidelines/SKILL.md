---
name: guidelines
description: >
  Creates a project-level implementation guidelines document at
  docs/guidelines.md by scanning the codebase for the UI component library,
  styling approach, project structure, and naming conventions, validating the
  libraries found in package.json against their official documentation via the
  Context7 MCP server, reading the non-functional requirements from
  docs/requirements.md, and asking the user about supported platforms and
  devices and rules that are not visible in code. The resulting document is
  the binding reference for how UI components and code must be implemented —
  existing components are reused instead of building new ones. Use when the
  user asks to "create coding guidelines", "document UI guidelines", "create
  implementation guidelines", "document our component conventions", asks "how
  should UI components be implemented", or complains that implementations
  ignore existing components or add custom styling.
---

# Implementation Guidelines Document

Create a `docs/guidelines.md` that documents how code — especially UI — must be implemented in this project: which component library and existing project components to reuse, how styling is done, where new files belong, and which conventions apply.

This document is a **binding rule set**, not a tutorial. Other skills (notably `implement-use-case`) read it and carry its rules into implementation plans, so implementations reuse existing components instead of inventing new ones or adding custom styling.

## Output

Write to `docs/guidelines.md`.

## DO NOT

- Invent rules that are neither evident from the codebase scan, backed by official library documentation (Context7), nor confirmed by the user
- Skip the Context7 check silently — if the server is unavailable, note in the document that library rules are based on the codebase scan only
- Leave placeholder text unfilled — every `{...}` must be replaced with real project context
- Duplicate testing guidance — that belongs in `TESTING.md` (see the `ai-architect-testing` plugin)
- Write in a language that doesn't match the team's working language

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Scan codebase for conventions
- Check library best practices via Context7
- Read NFRs from `docs/requirements.md`
- Ask user about platforms, devices, NFRs, and rules not visible in code
- Write guidelines to `docs/guidelines.md`
- Quality check

### Step 2: Scan the codebase

Gather evidence of the project's actual conventions:

1. **UI library & styling approach** — read `package.json` dependencies (e.g., MUI, shadcn/ui, Ant Design; Tailwind, CSS Modules, styled-components, plain CSS)
2. **Theme & design tokens** — look for theme files, token definitions, CSS custom properties, Tailwind config
3. **Existing component inventory** — list the project's shared/reusable components (typically under `src/components/` or similar) with path and purpose
4. **Project structure & layers** — identify the folder layout and architectural layers (e.g., views, components, services, domain, api) and where new files of each kind belong
5. **Naming conventions** — file naming (PascalCase/kebab-case), component naming, hook prefixes, test file suffixes
6. **State & data access** — state management library, data-fetching pattern, where API calls live

Record findings with file paths as evidence. Mark this todo done.

### Step 3: Check library best practices via Context7

For each key dependency identified in `package.json` (UI library, styling solution, state management, data fetching, routing), use the Context7 MCP server to look up the official documentation:

1. Resolve the library (`resolve-library-id`) using the exact package name and version from `package.json`
2. Fetch the docs (`get-library-docs`) for the topics relevant to guidelines: component usage, styling/theming, customization, project structure recommendations

Use the results in two ways:

- **Check**: compare how the project actually uses each library (Step 2 findings) against the official recommendations. Record deviations (e.g., inline `style` props where the library prescribes theme-based styling, components rebuilt by hand that the library already provides).
- **Define**: derive concrete, library-specific rules grounded in the official docs (e.g., "extend MUI components via `styled()`/theme overrides — never copy component source", "use Tailwind utilities and `tailwind.config` tokens — no custom CSS files").

If the Context7 server is unavailable, continue with codebase evidence only and note this limitation in the document.

Mark this todo done.

### Step 4: Read non-functional requirements from `docs/requirements.md`

Read the NFR table (NFR-XXX) in `docs/requirements.md` and extract every NFR that constrains how code is implemented — typically Performance, Usability/Accessibility, Compatibility (browsers, devices, platforms), Security, and Maintainability. For each relevant NFR, note its ID, what it demands, and what it implies for implementation (e.g., an accessibility NFR implies semantic markup and ARIA-compliant library components; a performance NFR implies lazy loading and bundle-size discipline).

If `docs/requirements.md` is missing, note it — the NFRs will be collected from the user in Step 5 instead, and the document will recommend creating the catalog with the `requirements` skill.

Mark this todo done.

### Step 5: Ask the user about platforms, devices, NFRs, and rules not visible in code

Present your scan findings, any deviations from official library recommendations (Step 3), and the NFRs you extracted (Step 4) briefly, then ask:

> Based on my scan, the project uses [summary of findings]. Before I write the guidelines, a few questions:
>
> **1. Which platforms and devices must be supported?**
> (e.g., desktop/mobile web, native iOS/Android, target browsers and minimum versions, screen sizes/breakpoints, touch vs. mouse)
>
> **2. I extracted these non-functional requirements from `docs/requirements.md`: [list NFR IDs and summaries, or "the file is missing"]. Are these complete and correct for the implementation guidelines — and are there additional non-functional requirements I should include?**
>
> **3. When is it acceptable to build a new component instead of reusing an existing one — and where should new components live?**
>
> **4. Which practices are explicitly forbidden?** (e.g., inline styles, hardcoded colors/spacing, one-off CSS, copying a library component instead of wrapping it)
>
> **5. Is there a design system or design reference (e.g., Figma, brand guide) the implementation must follow?**
>
> **6. [Only if Step 3 found deviations]** The project deviates from the official library recommendations in these points: [list]. Should the guidelines enforce the official pattern, or document the project's current practice as the rule?

Wait for the user's answers before continuing. If the user skips a question, derive a sensible default from the scan and mark it as such in the document.

Mark this todo done.

### Step 6: Write the guidelines

Create `docs/guidelines.md` using [templates/guidelines.md](templates/guidelines.md) as the starting point. Fill every placeholder with project-specific content from Steps 2–5, including the library-specific rules derived via Context7, the supported platforms and devices, and the NFRs with their implementation implications. Write in the team's working language.

Mark this todo done.

### Step 7: Quality check

Verify before finishing:

- [ ] Every rule is backed by codebase evidence, official library documentation (Context7), or explicit user input
- [ ] Each key dependency from `package.json` was checked against its official documentation via Context7 (or the document notes that Context7 was unavailable)
- [ ] Library-specific rules name the library and version they apply to
- [ ] Supported platforms and devices are documented (confirmed by the user, not assumed)
- [ ] Relevant NFRs from `docs/requirements.md` are referenced by ID (NFR-XXX) with their implementation implications (or the document notes that `docs/requirements.md` is missing)
- [ ] The component inventory lists real components with correct paths
- [ ] The "reuse before build" rule states where new components belong when one is genuinely needed
- [ ] Forbidden practices are listed concretely (no vague "write clean code" statements)
- [ ] No placeholder text remains
- [ ] Document was written to `docs/guidelines.md`
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing.
