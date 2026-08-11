# Styling

- **Approach:** {Tailwind / CSS Modules / styled-components / theme-based styling — how styling is done in this project}
- **Design tokens / theme:** {where colors, spacing, typography are defined; e.g., `src/theme.ts`, `tailwind.config.ts`}
- **Design reference:** {Figma / brand guide link, or "None"}

## Forbidden

- Hardcoded colors, spacing, or font sizes — always use design tokens / theme variables
- Semantic colors (e.g., danger/warning/success) as decoration — they are reserved for status feedback (validation, toasts, alerts)
- {e.g., Inline styles (`style={{…}}`)}
- {e.g., One-off CSS files outside the styling approach above}
- {e.g., Copying library components instead of wrapping/extending them}
