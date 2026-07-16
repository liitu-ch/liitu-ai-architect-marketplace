---
name: create-user-guide-template
description: >
  Interactively builds a project-specific user-guide / app-manual Markdown
  template through guided AskUserQuestion rounds about scope, structure, and
  layout, and stores it in the project so the user-guide skill uses it for
  every generated document. Use when the user asks to "create a user guide
  template", "define the structure of our manuals", "customize the guide
  template", "set up a documentation template", or wants the generated
  Anleitungen/manuals to follow a house structure. Do NOT use to write an
  actual guide for a use case — that is the user-guide skill.
---

# Create a Project User-Guide Template

Build a reusable, project-specific template for end-user documentation and
store it in `docs/user-guides/templates/`. The `user-guide` skill prefers
this template over its built-in ones, so the decisions made here shape every
guide the project generates afterwards.

$ARGUMENTS may already answer some questions (e.g. "auf Deutsch, als
App-Handbuch") — skip what is already decided.

## Workflow

Track the steps with TodoWrite.

### 1. Scan the project

Ground every question option in reality before asking:

- **Existing guides/templates** — anything under `docs/user-guides/`,
  `docs/anleitungen/`, or similar? An existing template means updating, not
  duplicating.
- **Documentation language** — the language of `docs/` content.
- **Device profile** — what the project's Playwright config defines
  (viewport, device).
- **Corporate Word template** — any `*.docx` reference document in the repo.
- **Built-in starting points** — read the `user-guide` skill's
  `templates/user-guide-template.md` (step-by-step per use case) and
  `templates/app-manual-template.md` (full manual organised by app area).

### 2. Ask about type and framing

**Use the `AskUserQuestion` tool** — do not ask these as free-form prose.
Derive concrete options from the scan, mark the most likely one
"(Recommended)", and rely on the built-in "Other" choice for custom answers.
Ask in a single call (max 4 questions); skip anything $ARGUMENTS or the scan
already answered:

1. **Document type** (header "Type"): step-by-step guide per use case /
   full app manual organised by app area / both templates.
2. **Language** (header "Language"): options grounded in the docs language
   (e.g. de-CH, fr-CH, it-CH, en-US). This fixes the language of headings
   and boilerplate in the template.
3. **Audience** (header "Audience"): external end users / internal staff
   (field reps, support) / mixed. Drives tone, whether internal contact
   points and codes may appear, and how prerequisites are phrased.
4. **Screenshot format** (header "Screenshots"): device and orientation,
   grounded in the Playwright config (e.g. "iPad landscape (from
   playwright.config.ts)"), plus the highlight convention (red frame).

### 3. Ask about structure and scope

Second **`AskUserQuestion`** call, again max 4 questions. Use
`multiSelect: true` where sections can be combined:

1. **Sections** (header "Sections", multiSelect): which optional parts the
   template includes — "About this guide" intro with prerequisites,
   note/warning boxes for edge cases, special-mode chapter, device &
   maintenance chapter, appendix with reference tables.
2. **Title page & footer** (header "Metadata", multiSelect): product name,
   app version, document version/date, responsible team/department, page
   numbers (via Word reference doc).
3. **Manual granularity** (header "Granularity", only for app manuals): one
   chapter per app area with numbered callouts / workflows as separate
   chapters / both (recommended, mirrors the built-in manual template).
4. **Word styling** (header "Styling"): pandoc defaults / corporate
   reference doc (offer the path if the scan found one) / create a reference
   doc later.

### 4. Build the template

Start from the matching built-in template(s) and apply the answers:

- Translate all headings, boilerplate, and comment instructions into the
  chosen language; keep placeholders in `{curly braces}`.
- Remove sections the user deselected; keep the guiding HTML comments for
  everything that stays.
- Fill project-level constants directly (product name, device, language tag,
  `--reference-doc` path in the conversion comment) — those are not
  placeholders anymore. Keep per-document values ({UC-ID}, {date}, captions)
  as placeholders.
- Keep the pandoc conversion command in the header comment, adjusted to the
  decisions (toc depth, lang, reference doc).

Write to:

| Document type  | File                                                |
| -------------- | --------------------------------------------------- |
| Use-case guide | `docs/user-guides/templates/user-guide-template.md` |
| App manual     | `docs/user-guides/templates/app-manual-template.md` |

Follow the project's guide directory if it differs (e.g.
`docs/anleitungen/templates/`).

### 5. Report

Show the user where the template lives, summarize the decisions it encodes,
and point out that `/ai-user-guide` will now pick it up automatically.

## Quality Checks

Before finishing, verify:

- [ ] Every question was asked via AskUserQuestion, none as free-form prose
- [ ] All remaining placeholders use `{curly braces}` and are per-document
      values only — no unresolved project-level decisions left
- [ ] No customer names, personal data, or credentials in the template
- [ ] Headings/boilerplate are entirely in the chosen language (no mix)
- [ ] The pandoc conversion comment matches the decisions (lang, toc depth,
      reference doc)
- [ ] File written to `docs/user-guides/templates/` (or the project's guide
      directory)

## DO NOT

- Write an actual guide for a use case — that is the `user-guide` skill
- Invent structure options that ignore the built-in templates — they encode
  the screenshot and pandoc conventions the user-guide skill relies on
- Put real customer data, credentials, or personal names into the template
- Ask more than 4 questions per AskUserQuestion call, or ask questions the
  scan / $ARGUMENTS already answered
