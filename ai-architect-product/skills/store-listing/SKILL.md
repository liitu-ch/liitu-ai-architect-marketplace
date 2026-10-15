---
name: store-listing
description: >
  Writes and maintains the store listing texts for the Apple App Store and
  Google Play from the product vision and requirements: name, subtitle,
  promotional text, short and full description, keywords, release notes —
  per language, each field within the store's character limit, written for
  the person deciding whether to install. Use when the user asks to "write
  the App Store description", "create store texts", "Store-Texte erstellen",
  "App-Store-Beschreibung", "Play Store listing", "What's New schreiben",
  "Release Notes für den Store", "keywords for the app store", or prepares an
  app submission.
---

# Store Listing

Create or update the store listing texts for the stores and languages named in $ARGUMENTS (default: both stores,
all languages the app supports). Output: one file per store and language under `resources/store/<lang>/` —
`apple.md` and `google.md` — each field with its limit and the current character count, ready to paste into
App Store Connect or the Play Console.

Limits and specifications: [REFERENCE.md](REFERENCE.md). Verify them against the store dialog before uploading.

## DO NOT

- Exceed a field limit — count characters (`wc -m`) for every field and write the count into the file; a text
  that is one character too long is rejected by the store
- Write for the development team — the reader decides whether to install; no requirement IDs, internal system
  names (SAP, Intune, …) unless they matter to the user, no ticket numbers in release notes
- Repeat the app name in the keywords, pad keywords with spaces after commas, or use competitor names
- Mix languages within one file, or write a listing for a language the app does not support
- Translate feature names ad hoc — use the wording of the app's own i18n files for the respective language so
  the listing and the app say the same thing
- Hide that an app needs a company account or MDM enrolment — say it in the first description paragraph;
  App Review and users must know before installing
- Invent feature claims — every sentence maps to an implemented requirement (`docs/requirements.md` status
  `Implemented`/`Verified`) or a visible screen; planned features do not go into the listing
- Overwrite existing store texts without reading them — keep approved wording, change what the release changed,
  and note the change under the file's revision table

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Read product sources
- Settle stores, languages, and distribution (AskUserQuestion)
- Draft the fields
- Localise
- Count and verify
- Quality check

### Step 2: Read product sources

1. `docs/vision.md` — the vision statement is the seed of the description's first paragraph; the future-state
   headings are the section headings of the description
2. `docs/requirements.md` — only `Implemented`/`Verified` FRs may be claimed; NFRs give the trust statements
   (offline, performance, accessibility, languages)
3. `docs/use_cases.md` — the user journeys; the description follows them, not the menu structure
4. The app's i18n files (e.g. `src/i18n/locales/*.json`) — binding wording for features, roles, and screens per
   language; `docs/guidelines/naming-and-language.md` for the glossary
5. Existing store texts (`resources/store/`, `resources/appstore/`, `fastlane/metadata/`, `CHANGELOG.md`) —
   approved wording and the release notes source
6. `package.json`, `capacitor.config.*`, `ios/App/App/Info.plist`, `android/app/src/main/res/values/strings.xml`
   — app name as shipped, version, bundle IDs

Mark this todo done.

### Step 3: Settle stores, languages, and distribution

**Use the `AskUserQuestion` tool** (one call, max 4 questions), skipping what $ARGUMENTS or the sources already
answer:

1. **Stores** (header "Stores", `multiSelect: true`): Apple App Store / Google Play
2. **Languages** (header "Languages", `multiSelect: true`): the app's supported locales, pre-selected from the
   i18n files; the team's working language is the master, the others are translations of it
3. **Distribution** (header "Distribution"): public / company account required (public listing, login
   restricted) / MDM or managed Play only — this decides the first paragraph and the review notes
4. **Scope of this run** (header "Scope"): full listing / release notes only (`What's New`, Play release notes)
   for the version in $ARGUMENTS

Mark this todo done.

### Step 4: Draft the fields (master language)

Fill [templates/apple.md](templates/apple.md) and [templates/google.md](templates/google.md). Writing rules:

- **Name** — the shipped app name; **Subtitle** (Apple) — one benefit in ≤ 30 characters, no repetition of the
  name
- **Promotional text** (Apple, 170) and **Short description** (Play, 80) — what the app is, for whom, the one
  distinguishing quality; a full sentence, no truncated list
- **Description** (4000) — paragraph 1: the vision statement rewritten for the reader (for whom, what it is,
  what changes); then 3–5 sections with ALL-CAPS headings taken from the vision's future-state headings, each
  with 3–5 bullet lines («• …») naming what the user can do; a «flexibility/trust» section from the NFRs
  (offline, languages, devices); a closing «IMPORTANT NOTE» when a company account or enrolment is required;
  one final claim line. Never more than 4000 characters including line breaks
- **Keywords** (Apple, 100) — 8–12 single words or short terms, comma-separated, lowercase, no duplicates with
  name/subtitle, in the listing's language
- **What's New / Release notes** — from the version's changelog: user-visible changes only, grouped «Neu /
  Verbessert / Behoben» (or the language's equivalents), no issue numbers, Play limited to 500 characters per
  language
- **Review notes** (Apple, not public) — demo account or test mode, how the reviewer gets past login, what the
  reviewer cannot test and why

Mark this todo done.

### Step 5: Localise

For every other language: translate the master texts sentence by sentence, then replace every feature, role,
and screen name with the wording from that language's i18n file — not with a free translation. Keep the
structure (headings, bullets, note) identical across languages so the Product Owner can review them side by
side. Keywords are re-derived per language, not translated word for word.

Mark this todo done.

### Step 6: Count and verify

For every field in every file run a character count (`wc -m` on the field's text, line breaks included) and
write it into the field's `<!-- chars: n / limit -->` marker. Any field over its limit is shortened before the
file is saved. Then cross-check every claim sentence against `docs/requirements.md` — list the FR behind each
section in the file's «Nachweis / Evidence» table so a reviewer can trace it.

Mark this todo done.

### Step 7: Quality check

Verify before finishing:

- [ ] Every field is within its limit and carries the current character count
- [ ] Every feature claim traces to an `Implemented`/`Verified` FR or a visible screen (Evidence table filled)
- [ ] Feature, role, and screen names match the app's i18n wording in each language
- [ ] A required company account or enrolment is stated in the first description paragraph and in the review
      notes
- [ ] Keywords: no name repetition, no spaces after commas, no competitor names, ≤ 100 characters
- [ ] Release notes contain no ticket or PR numbers and fit Play's 500 characters
- [ ] One language per file; file set matches the languages chosen in Step 3
- [ ] Revision table updated with today's date and what changed
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing. Then tell the user which fields to paste where, and that
`/ai-store-screenshots` produces the matching screenshots.

## Output

| Artifact                | Location                           |
| ----------------------- | ---------------------------------- |
| Apple App Store listing | `resources/store/<lang>/apple.md`  |
| Google Play listing     | `resources/store/<lang>/google.md` |

Follow an existing project convention when it differs (e.g. `resources/appstore/<lang>/store-texte.md` or
`fastlane/metadata/<locale>/`): keep the location, adopt the field structure.
