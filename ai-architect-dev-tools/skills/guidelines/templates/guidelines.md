# Implementation Guidelines

> Dieses Dokument wird mit dem Plugin `ai-architect-dev-tools` gepflegt (Skill: `/ai-guidelines`).
> Es ist verbindlich für jede Implementierung — Implementierungspläne (`/ai-implement-use-case`) referenzieren es.

## UI Components

### Component Library

{Which UI library/design system is used (e.g., MUI, shadcn/ui) and where it is configured.}

### Reuse Before Build

New UI is composed from existing components. Building a new component is only allowed when **no existing component covers the need** — neither a project component (see inventory below) nor a library component.

- New shared components live in `{path, e.g., src/components/}`
- {Approval rule if any, e.g., "New shared components require sign-off from …"}

### Existing Component Inventory

| Component | Path  | Purpose / When to use |
| --------- | ----- | --------------------- |
| {Name}    | `{…}` | {…}                   |

### Standard UI Patterns

Recurring UI constructs follow **one** documented standard pattern — new instances copy the pattern instead of being restyled per view. Duplicated pattern CSS across components is extracted into the shared pattern.

| Pattern              | Standard                                                                                 | Reference Implementation |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
| {e.g., Modal/Dialog} | {e.g., shared modal class, close button position, sizing per platform mode (iOS vs. MD)} | `{path}`                 |
| {e.g., Page footer}  | {e.g., button order and placement}                                                       | `{path}`                 |

## Styling

- **Approach:** {Tailwind / CSS Modules / styled-components / theme-based styling — how styling is done in this project}
- **Design tokens / theme:** {where colors, spacing, typography are defined; e.g., `src/theme.ts`, `tailwind.config.ts`}
- **Design reference:** {Figma / brand guide link, or "None"}

### Forbidden

- Hardcoded colors, spacing, or font sizes — always use design tokens / theme variables
- Semantic colors (e.g., danger/warning/success) as decoration — they are reserved for status feedback (validation, toasts, alerts)
- {e.g., Inline styles (`style={{…}}`)}
- {e.g., One-off CSS files outside the styling approach above}
- {e.g., Copying library components instead of wrapping/extending them}

## Library-Specific Rules

Rules per key dependency from `package.json`, checked against the official documentation (via Context7).
{If Context7 was unavailable: note that these rules are based on the codebase scan only.}

| Library               | Version | Rule                                                                                   | Source                             |
| --------------------- | ------- | -------------------------------------------------------------------------------------- | ---------------------------------- |
| {e.g., @mui/material} | {x.y.z} | {e.g., extend components via `styled()`/theme overrides — never copy component source} | {Official docs / Project decision} |

{Known deviations from official recommendations and the agreed handling, if any.}

## Project Structure & Architecture

{Folder layout and layers — where new files of each kind belong.}

| Layer / Folder | Contains | New files go here when … |
| -------------- | -------- | ------------------------ |
| `{…}`          | {…}      | {…}                      |

## Naming & Language

### Language Rules

- **Code is always English** — file and directory names, functions, variables, interfaces, types, components, hooks, CSS classes, i18n keys, and test file names. This applies even when the team's working language is not English.
- **Documentation** (this file, requirements, use case specs, test plans) is written in {team's working language}.
- **Domain terms** used in code follow the glossary below. Never invent a new translation ad hoc — extend the glossary in the same change instead.
- **UI strings** are never hardcoded: every user-facing string goes through {i18n mechanism, e.g., i18next `t()`} with keys in **all** supported locales ({e.g., de, fr, it, en}) and **no inline fallback texts**. {If the project is single-language, state that explicitly.}
- **Booleans** are named with `is` / `has` / `should` / `can` prefixes.

### Naming Conventions

- **Files:** {e.g., PascalCase for components, kebab-case for utilities}
- **Components:** {…}
- **Hooks / services / mappers:** {…}

### Glossary

Binding mapping between domain terms (team language) and code terms (English). Use these exact terms in code — do not invent alternatives. Abbreviations are spelled out here so nobody has to guess them.

| Domain Term ({team language}) | Code Term (English) | External System Field | Notes                             |
| ----------------------------- | ------------------- | --------------------- | --------------------------------- |
| {e.g., Gratisartikel}         | {e.g., freeGoods}   | {e.g., SAP `Gratis`}  | {…}                               |
| {e.g., Kundenschutzdatum}     | {…}                 | {…}                   | {abbreviation, e.g., KSD, if any} |

## State & Data Access

- **State management:** {library and where stores live}
- **Data fetching / API calls:** {pattern and where API code lives}

## Compliance Checklist

Check before completing any implementation task:

- [ ] UI built from existing project or library components — no unnecessary new components
- [ ] Recurring UI constructs follow the documented standard patterns (see Standard UI Patterns)
- [ ] No forbidden styling practices (see above); design tokens used throughout
- [ ] New files placed according to the project structure table
- [ ] Naming conventions followed; all file names, identifiers, and CSS classes are English; domain terms follow the glossary
- [ ] No hardcoded UI strings — i18n keys exist in all supported locales, without inline fallback texts
- [ ] State and data access follow the documented patterns
