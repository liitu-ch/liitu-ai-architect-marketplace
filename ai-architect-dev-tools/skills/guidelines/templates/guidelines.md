# Implementation Guidelines

> Dieses Dokument wird mit dem Plugin `ai-architect-dev-tools` gepflegt (Skill: `/ai-guidelines`).
> Es ist verbindlich für jede Implementierung — Implementierungspläne (`/ai-implement-use-case`) referenzieren es.

## Supported Platforms & Devices

{Confirmed by the user — every implementation must work on all of these.}

| Platform                          | Devices / Browsers                      | Min. Version / Breakpoints |
| --------------------------------- | --------------------------------------- | -------------------------- |
| {e.g., Web (desktop)}             | {e.g., Chrome, Firefox, Safari, Edge}   | {…}                        |
| {e.g., Web (mobile) / native app} | {e.g., iPhone SE–Pro Max, Android ≥ 10} | {e.g., 360px–1920px}       |

- {Input modes to support, e.g., touch and mouse/keyboard}
- {Other platform constraints, e.g., offline capability, PWA}

## Non-Functional Requirements

Relevant NFRs from `docs/requirements.md` and what they mean for implementation.
{If `docs/requirements.md` is missing: note it and recommend creating it with `/ai-requirements`; list user-provided NFRs instead.}

| ID      | Requirement (summary) | Implementation Implication                                                           |
| ------- | --------------------- | ------------------------------------------------------------------------------------ |
| NFR-XXX | {e.g., WCAG 2.1 AA}   | {e.g., semantic markup, ARIA-compliant library components, keyboard navigation}      |
| NFR-XXX | {e.g., TTI < 3s}      | {e.g., lazy-load routes, no heavyweight dependencies without bundle-size assessment} |

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

## Styling

- **Approach:** {Tailwind / CSS Modules / styled-components / theme-based styling — how styling is done in this project}
- **Design tokens / theme:** {where colors, spacing, typography are defined; e.g., `src/theme.ts`, `tailwind.config.ts`}
- **Design reference:** {Figma / brand guide link, or "None"}

### Forbidden

- {e.g., Inline styles (`style={{…}}`)}
- {e.g., Hardcoded colors, spacing, or font sizes — always use design tokens}
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

## Naming Conventions

- **Files:** {e.g., PascalCase for components, kebab-case for utilities}
- **Components:** {…}
- **Hooks / services / mappers:** {…}

## State & Data Access

- **State management:** {library and where stores live}
- **Data fetching / API calls:** {pattern and where API code lives}

## Compliance Checklist

Check before completing any implementation task:

- [ ] UI built from existing project or library components — no unnecessary new components
- [ ] No forbidden styling practices (see above); design tokens used throughout
- [ ] Works on all supported platforms and devices (see table above)
- [ ] Relevant NFRs (see table above) are satisfied
- [ ] New files placed according to the project structure table
- [ ] Naming conventions followed
- [ ] State and data access follow the documented patterns
