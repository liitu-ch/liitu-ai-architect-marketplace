---
name: guidelines
description: >
  Creates a project-level implementation guidelines directory at
  docs/guidelines/ (one file per chapter plus a README index) by scanning the
  codebase for the UI component library, styling approach, project structure,
  naming conventions, i18n setup, and domain terminology, validating the
  libraries found in package.json against their official documentation via the
  Context7 MCP server, then asking the user about rules that are not visible
  in code. The result is the binding reference for how UI components and code
  must be implemented — existing components are reused instead of building new
  ones, code identifiers are always English, and domain terms follow a binding
  glossary. Use when the user asks to "create coding guidelines", "document UI
  guidelines", "create implementation guidelines", "document our component
  conventions", "document naming or language conventions", "create a domain
  glossary", asks "how should UI components be implemented", or complains
  that implementations ignore existing components, add custom styling, or mix
  languages in identifiers and file names.
---

# Implementation Guidelines Document

Create a `docs/guidelines/` directory — one kebab-case file per chapter plus a `README.md` index — that documents how code — especially UI — must be implemented in this project: which component library and existing project components to reuse, how styling is done, where new files belong, which naming and language rules apply, and how domain terms map to English code terms (glossary).

This document is a **binding rule set**, not a tutorial. Other skills (notably `implement-use-case`) read it and carry its rules into implementation plans, so implementations reuse existing components instead of inventing new ones or adding custom styling.

## Output

Write each chapter as its own kebab-case file in `docs/guidelines/`, with `docs/guidelines/README.md` as the index.

## DO NOT

- Invent rules that are neither evident from the codebase scan, backed by official library documentation (Context7), nor confirmed by the user
- Skip the Context7 check silently — if the server is unavailable, note in the document that library rules are based on the codebase scan only
- Leave placeholder text unfilled — every `{...}` must be replaced with real project context
- Duplicate testing guidance — that belongs in `TESTING.md` (see the `ai-architect-testing` plugin)
- Write documentation in a language that doesn't match the team's working language
- Soften the language rule for code — file names, code identifiers, CSS classes, i18n keys, and test file names are always English, even when the team's working language is not
- Leave the glossary empty when the scan found domain-specific terms — every domain term used in code needs exactly one binding English translation

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Scan codebase for conventions
- Check library best practices via Context7
- Ask user about rules not visible in code
- Write guidelines to `docs/guidelines/`
- Quality check

### Step 2: Scan the codebase

Gather evidence of the project's actual conventions:

1. **UI library & styling approach** — read `package.json` dependencies (e.g., MUI, shadcn/ui, Ant Design; Tailwind, CSS Modules, styled-components, plain CSS)
2. **Theme & design tokens** — look for theme files, token definitions, CSS custom properties, Tailwind config
3. **Existing component inventory** — list the project's shared/reusable components (typically under `src/components/` or similar) with path and purpose
4. **Project structure & layers** — identify the folder layout and architectural layers (e.g., views, components, services, domain, api) and where new files of each kind belong
5. **Naming conventions** — file naming (PascalCase/kebab-case), component naming, hook prefixes, test file suffixes
6. **State & data access** — state management library, data-fetching pattern, where API calls live
7. **Internationalization** — i18n library, where locale files live, the supported locales, and how UI strings are referenced (also note hardcoded strings and inline fallback texts as violations to rule out)
8. **Domain terminology** — collect domain terms from code identifiers, documentation (`docs/requirements.md`, use case specs), and external system fields (e.g., SAP/OData field names) as input for the glossary; note existing translations and inconsistencies (the same term translated differently in different places, non-English identifiers)

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

### Step 4: Ask the user about rules not visible in code

First, briefly present your scan findings and any deviations from official library recommendations (Step 3) so the user has context.

Then **use the `AskUserQuestion` tool** to collect the answers — do not ask these as free-form prose in a normal message. Each question below becomes one `AskUserQuestion` question, with concrete options derived from your scan so the user can pick rather than type. Always phrase options grounded in the actual findings (e.g., real component paths, the styling approach you detected), and rely on the tool's built-in "Other" choice for custom answers.

Ask these questions:

1. **Header "New components"** — When is it acceptable to build a new component instead of reusing an existing one, and where should new components live? (Offer options such as: only when no existing component fits / never without approval / freely; combined with the detected components location.)
2. **Header "Forbidden"** — Which practices are explicitly forbidden? Use `multiSelect: true`. (Offer options such as: inline styles, hardcoded colors/spacing, one-off CSS files, copying a library component instead of wrapping it.)
3. **Header "Design ref"** — Is there a design system or design reference (e.g., Figma, brand guide) the implementation must follow? (Offer options such as: Figma / brand guide / none.)
4. **Header "Deviations"** — _Only include this question if Step 3 found deviations._ The project deviates from the official library recommendations in these points: [list]. Should the guidelines enforce the official pattern, or document the project's current practice as the rule? (Options: enforce official pattern / document current practice.)

Send the applicable questions in a single `AskUserQuestion` call (max 4 questions). Wait for the user's answers before continuing. If the user skips a question or chooses an option that implies no constraint, derive a sensible default from the scan and mark it as such in the document.

Mark this todo done.

### Step 5: Write the guidelines

Create the `docs/guidelines/` directory using [templates/guidelines/](templates/guidelines/) as the starting point: write one file per chapter (`ui-components.md`, `styling.md`, `library-specific-rules.md`, `project-structure.md`, `naming-and-language.md`, `state-and-data-access.md`, `compliance-checklist.md`) plus a `README.md` index linking them. Fill every placeholder with project-specific content from Steps 2–4, including the library-specific rules derived via Context7. Write in the team's working language; code identifiers in rules and examples stay English. Fill the Glossary in `naming-and-language.md` with the domain terms collected in Step 2 — mark translations you are not sure about with `(to confirm)` so the team can review them.

Mark this todo done.

### Step 6: Quality check

Verify before finishing:

- [ ] Every rule is backed by codebase evidence, official library documentation (Context7), or explicit user input
- [ ] Each key dependency from `package.json` was checked against its official documentation via Context7 (or the document notes that Context7 was unavailable)
- [ ] Library-specific rules name the library and version they apply to
- [ ] The component inventory lists real components with correct paths
- [ ] The "reuse before build" rule states where new components belong when one is genuinely needed
- [ ] Forbidden practices are listed concretely (no vague "write clean code" statements)
- [ ] `naming-and-language.md` states that file names, code identifiers, CSS classes, i18n keys, and test files are always English
- [ ] The glossary maps every domain term found in the scan to exactly one English code term; uncertain entries are marked `(to confirm)`
- [ ] The i18n rule names the mechanism and all supported locales (or states explicitly that the project is single-language)
- [ ] No placeholder text remains
- [ ] Guidelines were written to `docs/guidelines/` — one file per chapter plus a `README.md` index
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing.
