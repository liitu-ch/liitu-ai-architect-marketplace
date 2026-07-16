---
name: user-guide
description: >
  Creates end-user guides (Anleitungen) as Word documents from use case
  specifications: drives the app with the project's existing Playwright E2E
  fixtures, captures annotated screenshots (tablet landscape by default),
  fills a standard Markdown guide template, and converts it to .docx via
  pandoc. Use when the user asks to "create a user guide", "write an
  Anleitung", "document a use case for end users", "create a manual or
  handbook", "generate a Word document with screenshots", or references a
  use case (UC-*) and wants step-by-step instructions for users — even if
  Word or screenshots are not mentioned explicitly. Supports one or many
  use cases per run (separate documents or one combined manual).
---

# User Guide from Use Cases

Create an end-user guide as a Word document for the use case(s) specified in
$ARGUMENTS. The guide walks a real user step by step through the main success
scenario, illustrated with screenshots captured from the running app.

This is **end-user documentation, not a test artifact**: the reader is the
person operating the app, not a developer or tester.

## Collect Input

Determine from $ARGUMENTS and the project; ask (AskUserQuestion) only what
remains unclear:

1. **Document type** — a step-by-step guide per use case (default,
   [templates/user-guide-template.md](templates/user-guide-template.md)) or a
   full app manual organised by app area / screen
   ([templates/app-manual-template.md](templates/app-manual-template.md)).
   Choose the manual when the user asks for a handbook covering the whole app
   rather than one task.
2. **Use case(s)** — one or more UC IDs. Specs usually live in
   `docs/use_cases/UC-*.md` or similar. A full app manual may also be driven
   by the app's areas/screens instead of UC IDs.
3. **Output mode** (only when multiple UCs): one document per use case
   (default) or a single combined manual with one chapter per use case.
4. **Device profile** — default `iPad (gen 11) landscape`; respect what the
   project's Playwright config already defines.
5. **Language** — the language end users read. Default to the language of the
   project's documentation; never mix languages within one guide.

## Prerequisites

Check before starting; stop and tell the user what is missing instead of
improvising around it:

- A Playwright E2E setup with **authenticated fixtures** (login + data sync
  already solved). Reuse it — never reimplement login in the screenshot spec.
- A way to run the app with deterministic data (mock server, seeded fixtures).
- `pandoc` on the PATH (`brew install pandoc` / `apt install pandoc`).

## Workflow

### 1. Read the use case specification

The **main success scenario** defines the guide's step sequence. Alternative
flows become hint/warning boxes inside the related step (e.g. "sync failed"
becomes a note in the sync step) — not separate chapters. Business rules
translate into user-facing explanations; requirement IDs (FR-_, BR-_) stay
out of the guide text, end users don't know them.

### 2. Create the screenshot spec

Put screenshot specs in a dedicated directory (e.g. `scripts/user-guide/`)
with their **own Playwright config**, so guide generation never runs as part
of the regular test suite or CI. Follow the project's existing convention if
one exists.

- Start from [templates/playwright.config.template.ts](templates/playwright.config.template.ts)
  and [templates/screenshot-spec.template.ts](templates/screenshot-spec.template.ts).
- Import the project's E2E fixtures (login, sync, seeding helpers) — the
  templates show the seams to adapt.
- One spec file per use case, one test that walks the scenario in order.
- Name screenshots `NN-slug.png` (`01-dashboard.png`, `02-search.png`, …) so
  file order equals step order. Save them next to the guide, e.g.
  `docs/user-guides/uc-002/` (or the project's guide directory, e.g.
  `docs/anleitungen/`).

Screenshot conventions the templates implement — keep them:

- **Highlight** the element the step talks about with a red frame
  (`3px solid #d70021`), take the screenshot, then remove it. Use the
  overlay-div helper from the template — CSS outlines on the element itself
  get clipped by scroll/overflow containers and vanish from the screenshot.
- **Viewport screenshots**, not `fullPage` — apps with internal scroll
  containers (e.g. Ionic `ion-content`) render `fullPage` useless. Scroll the
  element into view first.
- **Settle animations** before each shot (a short `waitForTimeout` after
  scrolling or opening overlays).
- **Seed deterministic data** when a list or tile would otherwise be empty
  (e.g. an order created "today"). An empty widget teaches the reader
  nothing. Note seeded demo data in the PR/commit description.

### 3. Run and visually verify

Run the spec, then **look at every screenshot** (open the image files) before
writing the guide. Check: the highlight sits on the right element, no
half-finished animations, no leftover overlays, realistic-looking data. A
guide with a wrong screenshot is worse than no guide. Re-run after fixes.

### 4. Write the guide from the template

**Template resolution:** if the project has its own template under
`docs/user-guides/templates/` (created with `/ai-create-user-guide-template`),
use that one — it encodes the project's structure decisions. Otherwise fall
back to the built-in template matching the document type:

- Step-by-step use-case guide →
  [templates/user-guide-template.md](templates/user-guide-template.md): YAML
  metadata block for the Word title page, one `# Step N` section per scenario
  step, images with captions and fixed width.
- Full app manual →
  [templates/app-manual-template.md](templates/app-manual-template.md): one
  chapter per app area (overview screenshot with numbered callouts + one
  subsection per element), separate task-oriented workflow chapters, optional
  special-mode / device / appendix chapters.

Both are pandoc-flavoured Markdown files.

- Translate all headings and boilerplate into the guide language.
- Write for the end user: "Tippen Sie auf …" / "Tap …" — imperative, no
  internal jargon, no requirement IDs, no test terminology.
- Every step: what to do, what the user sees, then the screenshot.
- **Combined manual** (multiple UCs, single document): one H1 chapter per use
  case, steps as H2, one shared metadata block and TOC. Screenshot folders
  stay per-UC (`uc-002/`, `uc-003/`, …).

### 5. Convert to Word

```bash
cd docs/user-guides   # or the project's guide directory
pandoc UC-002_Guide.md -o UC-002_Guide.docx --toc --toc-depth=1 -V lang=de-CH
```

- `--toc-depth=1` for single-UC guides, `2` for combined manuals.
- Set `lang` to the guide language (`de-CH`, `fr-CH`, `it-CH`, `en-US`, …).
- If the project has a corporate Word template, add
  `--reference-doc=path/to/template.docx` — the Markdown structure stays the
  same, only the styling changes. Until such a template exists, pandoc's
  default styles are fine.

Verify the result: the docx must embed all images
(`unzip -l guide.docx | grep -c word/media` equals the screenshot count).

### 6. Report

Tell the user where the documents live and how to regenerate them (the two
commands: Playwright run + pandoc). Keep the Markdown source next to the
docx — it is the editable master.

## Output

| Artifact                 | Location (default)                          |
| ------------------------ | ------------------------------------------- |
| Guide (Word)             | `docs/user-guides/UC-XXX_<Name>_Guide.docx` |
| Guide (Markdown master)  | `docs/user-guides/UC-XXX_<Name>_Guide.md`   |
| Screenshots              | `docs/user-guides/uc-xxx/NN-slug.png`       |
| Screenshot spec + config | `scripts/user-guide/`                       |

Follow the project's existing naming and directory conventions when they
differ (e.g. a German project may use `docs/anleitungen/`).

## DO NOT

- Reimplement login or data sync in the screenshot spec — reuse the E2E
  fixtures; that is the whole point of building on the existing test suite
- Let the screenshot spec run in the regular test suite or CI — separate
  config, separate directory
- Write requirement IDs (FR-_, BR-_, NFR-*) or test jargon into the guide
  text — end users don't know them
- Ship a guide without opening every screenshot — verify highlights, data,
  and timing visually
- Use `fullPage` screenshots in apps with internal scroll containers
- Leave lists or tiles empty in screenshots when seeding can fill them
- Mix languages within one guide
