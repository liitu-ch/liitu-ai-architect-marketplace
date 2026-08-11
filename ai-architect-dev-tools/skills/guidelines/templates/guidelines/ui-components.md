# UI Components

## Component Library

{Which UI library/design system is used (e.g., MUI, shadcn/ui) and where it is configured.}

## Reuse Before Build

New UI is composed from existing components. Building a new component is only allowed when **no existing component covers the need** — neither a project component (see inventory below) nor a library component.

- New shared components live in `{path, e.g., src/components/}`
- {Approval rule if any, e.g., "New shared components require sign-off from …"}

## Existing Component Inventory

| Component | Path  | Purpose / When to use |
| --------- | ----- | --------------------- |
| {Name}    | `{…}` | {…}                   |

## Standard UI Patterns

Recurring UI constructs follow **one** documented standard pattern — new instances copy the pattern instead of being restyled per view. Duplicated pattern CSS across components is extracted into the shared pattern.

| Pattern              | Standard                                                                                 | Reference Implementation |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
| {e.g., Modal/Dialog} | {e.g., shared modal class, close button position, sizing per platform mode (iOS vs. MD)} | `{path}`                 |
| {e.g., Page footer}  | {e.g., button order and placement}                                                       | `{path}`                 |
