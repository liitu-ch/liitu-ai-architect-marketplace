# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude Code plugin marketplace** called `liitu-ai-architect-marketplace`. It distributes the
`ai-architect-core` plugin — a stack-agnostic requirements engineering and system modeling toolkit with skills for
creating requirements catalogs, entity models, use case diagrams, and use case specifications.

## Repository Structure

The repo has two layers:

- **Root level** — marketplace configuration (`.claude-plugin/marketplace.json`)
- **`ai-architect-core/`** — the plugin itself, containing its own `.claude-plugin/plugin.json`, `.mcp.json`, and
  `skills/` directory

Skills live in `ai-architect-core/skills/<skill-name>/SKILL.md`. Some skills have supporting files:
- `requirements/REFERENCE.md` — ID prefixes, priority levels, status values, NFR/constraint categories
- `use-case-spec/templates/use-case.md` — template for use case specification documents

## Skill Authoring Conventions

All skills follow these patterns:

- **Frontmatter**: YAML between `---` markers with `name` and multiline `description` (using `>` syntax). The
  description includes trigger phrases ("Use when the user asks to...") so Claude knows when to auto-invoke.
- **Workflow**: Skills use TodoWrite for task tracking and follow numbered step-by-step workflows.
- **Output**: Each skill writes to a specific file in `docs/` (e.g., `docs/requirements.md`,
  `docs/entity_model.md`, `docs/use_cases.puml`, `docs/use_cases/{name}.md`).
- **Quality checks**: Skills include validation checklists at the end of their workflows.
- **$ARGUMENTS**: Used for user-provided input (e.g., the hello skill greets `$ARGUMENTS` by name).

## ID Conventions

- Functional Requirements: `FR-XXX`
- Non-Functional Requirements: `NFR-XXX`
- Constraints: `C-XXX`
- Use Cases: `UC-XXX` (3-digit, e.g., UC-001)
- Business Rules: `BR-XXX`

## Testing Plugins Locally

```shell
claude --plugin-dir ./ai-architect-core
```

After changes, run `/reload-plugins` inside Claude Code to pick up updates without restarting.
