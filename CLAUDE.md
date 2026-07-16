# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude Code plugin marketplace** called `liitu-ai-architect-marketplace`. It distributes three plugins:

- **`ai-architect-core`** — a stack-agnostic requirements engineering and system modeling toolkit with skills for
  creating requirements catalogs, entity models, use case diagrams, and use case specifications.
- **`ai-architect-testing`** — a testing toolkit with skills for documenting a project-level testing concept,
  creating Playwright E2E tests, Vitest unit tests (including architecture/layer-boundary checks), manual
  test plans, end-user guides as Word documents with Playwright-captured screenshots, and an interactive
  builder for project-specific user-guide/app-manual templates.
- **`ai-architect-dev-tools`** — developer workflow tools with skills for creating conventional commits,
  project-level implementation guidelines (UI component reuse, styling rules, conventions), structured use
  case implementation plans, and code review against the project conventions through guided interaction.

## Repository Structure

The repo has four layers:

- **Root level** — marketplace configuration (`.claude-plugin/marketplace.json`)
- **`ai-architect-core/`** — the core plugin, containing its own `.claude-plugin/plugin.json`, `skills/`, and
  `commands/` directories
- **`ai-architect-testing/`** — the testing plugin, containing its own `.claude-plugin/plugin.json`, `.mcp.json`
  (playwright, browser automation via `@playwright/mcp` for debugging E2E tests), `skills/`, and `commands/`
  directories
- **`ai-architect-dev-tools/`** — the dev tools plugin, containing its own `.claude-plugin/plugin.json`,
  `.mcp.json` (context7, used by the `guidelines` skill for library documentation lookup), `skills/`, and
  `commands/` directories

Each plugin ships both **skills** (`skills/<name>/SKILL.md`) and **slash commands**
(`commands/ai-<name>.md`). Commands are thin wrappers that delegate to the skill of the same name; they exist
so users can type the short alias `/ai-<name>` instead of the namespaced form
`/<plugin-name>:<name>`.

Skills live in `<plugin>/skills/<skill-name>/SKILL.md`. Some skills have supporting files:

- `ai-architect-core/skills/requirements/REFERENCE.md` — ID prefixes, priority levels, status values, NFR/constraint categories
- `ai-architect-core/skills/use-case-spec/templates/use-case.md` — template for use case specification documents
- `ai-architect-testing/skills/testing-concept/templates/testing-concept.md` — template for the project-level
  `TESTING.md`
- `ai-architect-testing/skills/playwright-test/templates/example-view.spec.ts` — Playwright E2E test template
- `ai-architect-testing/skills/vitest/templates/` — Vitest unit test templates (domain logic, components, mappers)
- `ai-architect-testing/skills/manual-test/templates/manual-test-plan.md` — manual test plan template
- `ai-architect-testing/skills/user-guide/templates/` — end-user guide templates (step-by-step use-case guide,
  app manual organised by app area, screenshot capture spec, Playwright config)
- `ai-architect-dev-tools/skills/guidelines/templates/guidelines.md` — template for the project implementation
  guidelines (`docs/guidelines.md`), consumed by the `implement-use-case` skill

## Skill Authoring Conventions

All skills follow these patterns:

- **Frontmatter**: YAML between `---` markers with `name` and multiline `description` (using `>` syntax). The
  description includes trigger phrases ("Use when the user asks to...") so Claude knows when to auto-invoke.
- **Workflow**: Skills use TodoWrite for task tracking and follow numbered step-by-step workflows.
- **Output**: Most skills write to a specific file in `docs/` (e.g., `docs/requirements.md`,
  `docs/entity_model.md`, `docs/use_cases.md`, `docs/use_cases/{name}.md`, `docs/guidelines.md`,
  `docs/implementation/{uc}/plan.md`, `docs/test-plans/{feature-name}.md`,
  `docs/user-guides/UC-XXX_{name}_Guide.md` plus the converted `.docx`,
  `docs/user-guides/templates/{user-guide|app-manual}-template.md`). Exceptions: `testing-concept`
  writes `TESTING.md` at the project root; `commit` and `code-review` produce no document (a git commit and a
  findings report, respectively).
- **Quality checks**: Skills include validation checklists at the end of their workflows.
- **$ARGUMENTS**: Used for user-provided input (e.g., the `use-case-spec` skill receives the use case to
  document via `$ARGUMENTS`).

## Command Authoring Conventions

For every skill `<name>` there is a matching slash command `commands/ai-<name>.md` in the same plugin. Commands
are thin wrappers — they contain a short YAML frontmatter (`description`) and a body that tells Claude to invoke
the corresponding skill, passing through `$ARGUMENTS`. When adding a new skill, always add the matching
`/ai-<name>` command so the user-facing alias keeps working.

## ID Conventions

- Functional Requirements: `FR-XXX`
- Non-Functional Requirements: `NFR-XXX`
- Constraints: `C-XXX`
- Use Cases: `UC-XXX` (3-digit, e.g., UC-001)
- Business Rules: `BR-XXX`
- Test Cases (manual): `TC-XXX` (3-digit, e.g., TC-001)

## Language Conventions

Skills generate two kinds of artifacts with different language rules. All skills must enforce this split:

- **Documentation artifacts** (requirements catalog, use case specs, guidelines, test plans, `TESTING.md`) are
  written in the **team's working language**.
- **Code artifacts are always English**, regardless of the team's working language: file and directory names,
  functions, variables, interfaces, types, components, hooks, CSS classes, i18n keys, and test file names.
- **Domain terms** in code are translated via the project glossary in `docs/guidelines.md` — never invent ad-hoc
  translations. If a term is missing from the glossary, it is added there in the same change.
- **UI strings** are never hardcoded in code — they go through the project's i18n mechanism, with keys in all
  supported locales.
- **IDs and status values** (`FR-XXX`, `UC-XXX`, `Open`, `Implemented`, …) stay in English even inside
  team-language documents so they remain searchable and consistent across projects.

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`, `style`, `perf`, `build`.
Append `!` after the type/scope for breaking changes (also add a `BREAKING CHANGE:` footer).

## Hooks

The project uses Claude Code hooks (`.claude/settings.json`):

- **PreToolUse** (`Edit|Write`): runs `.claude/hooks/protect-files.sh` to block writes to `.env`,
  `package-lock.json`, and `.git/`
- **PostToolUse** (`Edit|Write`): auto-formats changed files with Prettier (`npx prettier --write`)

## Testing Plugins Locally

```shell
claude --plugin-dir ./ai-architect-core
claude --plugin-dir ./ai-architect-testing
claude --plugin-dir ./ai-architect-dev-tools
```

After changes, run `/reload-plugins` inside Claude Code to pick up updates without restarting.
