# Naming & Language

## Language Rules

- **Code is always English** — file and directory names, functions, variables, interfaces, types, components, hooks, CSS classes, i18n keys, and test file names. This applies even when the team's working language is not English.
- **Documentation** (these guidelines, requirements, use case specs, test plans) is written in {team's working language}.
- **Domain terms** used in code follow the [Glossary](#glossary) below. Never invent a new translation ad hoc — extend the glossary in the same change instead.
- **UI strings** are never hardcoded: every user-facing string goes through {i18n mechanism, e.g., i18next `t()`} with keys in **all** supported locales ({e.g., de, fr, it, en}) and **no inline fallback texts**. {If the project is single-language, state that explicitly.}
- **Booleans** are named with `is` / `has` / `should` / `can` prefixes.

## Naming Conventions

- **Files:** {e.g., PascalCase for components, kebab-case for utilities}
- **Components:** {…}
- **Hooks / services / mappers:** {…}

## Glossary

Binding mapping between domain terms (team language) and code terms (English). Use these exact terms in code — do not invent alternatives. Abbreviations are spelled out here so nobody has to guess them.

| Domain Term ({team language}) | Code Term (English) | External System Field | Notes                             |
| ----------------------------- | ------------------- | --------------------- | --------------------------------- |
| {e.g., Gratisartikel}         | {e.g., freeGoods}   | {e.g., SAP `Gratis`}  | {…}                               |
| {e.g., Kundenschutzdatum}     | {…}                 | {…}                   | {abbreviation, e.g., KSD, if any} |
