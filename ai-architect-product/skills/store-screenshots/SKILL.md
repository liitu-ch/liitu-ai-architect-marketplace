---
name: store-screenshots
description: >
  Produces App Store and Google Play screenshots in the exact pixel sizes the
  stores accept: picks the most important screens from the use cases, drives
  the app with the project's Playwright E2E fixtures and deterministic mock
  data, hides development-only UI, captures per device slot (iPhone, iPad,
  Android phone and tablets), resizes with sharp where the layout device and
  the store slot differ, and verifies every image visually and by size. Use
  when the user asks to "create App Store screenshots", "generate store
  screenshots", "Screenshots für den App Store", "Play Store Screenshots",
  "update the store images", or names Apple/Google screenshot sizes.
---

# Store Screenshots

Generate the store screenshots for the device slots and languages named in $ARGUMENTS (default: the slots the
stores require for the app's platforms, in the team's working language). The result is a set of JPEG files per
language and device slot under `resources/store/`, produced by a Playwright spec in `scripts/store/` that can be
re-run for every release.

Sizes, slots, and formats: [../store-listing/REFERENCE.md](../store-listing/REFERENCE.md) — verify against the
store's upload dialog before uploading.

This skill shares its mechanics with `/ai-user-guide` (same fixtures, same screenshot discipline) but produces
**marketing images**: no highlight frames, no callouts, full screens that show the app at its best with
realistic data.

## DO NOT

- Reimplement login or data sync in the screenshot spec — import the project's E2E fixtures
- Let the spec run in the regular test suite or CI — own directory, own Playwright config
- Ship a PNG with an alpha channel to Apple or Play — export JPEG (`quality: 95`) or strip alpha with sharp
- Stretch an image to a store size — resize with `fit: 'cover'` from a layout whose aspect ratio is close, and
  document which layout device each slot uses
- Show development-only UI — DEMO/system badges, diagnostics notes, debug tabs, mock banners are hidden with an
  injected style tag before every shot
- Show placeholder data — lorem ipsum notes, «E2E …» names, mismatched e-mail addresses, 0-item orders, empty
  tiles; pick a showcase record and seed what the seed data lacks
- Take a screenshot before the content is loaded — maps need tiles, lists need items, totals need the price
  calculation; wait for the content, then settle
- Accept a run without opening every image — a store screenshot with a spinner, an open side menu, or a cut-off
  dialog is worse than none
- Hardcode store sizes in the spec — they live in the config's project list and in REFERENCE.md

## Prerequisites

Check before starting; stop and name what is missing instead of improvising:

- Playwright E2E setup with **authenticated fixtures** (login + data load solved) and a `language` option or an
  equivalent way to switch the UI language
- A deterministic data source (mock server, seeded database) with a stable **showcase record** per entity
  (customer, order, product) that looks real
- `sharp` resolvable from the project (`npm ls sharp` — often present transitively via image tooling; otherwise
  `npm i -D sharp`) when any slot needs resizing
- The WebKit and Chromium browsers installed for Playwright (`npx playwright install webkit chromium`)

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Read use cases and vision, pick the screens
- Settle slots, languages, and showcase data (AskUserQuestion)
- Write config and spec
- Run per slot and verify
- Report

### Step 2: Pick the screens

Read `docs/vision.md` (future-state headings = the story the screenshots tell), `docs/use_cases.md` (actors,
use cases), and `docs/requirements.md` (what is `Implemented`). Propose up to ten screens, in story order:

1. The entry screen the user sees daily (dashboard/overview) — with filled tiles
2. One screen per main use case of the primary actor, following the vision's narrative order
3. The screens that show the distinguishing qualities named in the vision (offline, map, speed, mode switch)
4. A detail or result view with real-looking data (an order with positions and totals, a record with history)

Leave out: settings, sync/diagnostics pages, login (unless the login itself is a selling point), empty states,
error states. Each screen gets a slug and a one-line caption (used later as the screenshot caption in the
store, if the store supports it).

Mark this todo done.

### Step 3: Settle slots, languages, and showcase data

**Use the `AskUserQuestion` tool** (one call, max 4 questions):

1. **Screens** (header "Screens"): accept the proposed list / adjust (the user names changes via "Other")
2. **Slots** (header "Slots", `multiSelect: true`): the device slots to produce, pre-selected from the app's
   platforms — Apple iPhone 6.9″ (or the slot App Store Connect asks for), Apple iPad 13″, Android phone,
   Android 7″/10″ tablet — and whether a smaller layout device (e.g. iPad 11″) should be used for a larger slot
3. **Languages** (header "Languages", `multiSelect: true`): from the app's locales; one output folder per
   language
4. **Showcase data** (header "Data"): use the records the user names / let the skill pick records from the seed
   that have complete, realistic fields / seed dedicated showcase records

If the user names records, their identifiers go verbatim into the spec's constants. When the skill picks, query
the seed data (database, fixtures) for records that have every field filled with plausible values and no
placeholder text, and name them in the spec with the reason.

Mark this todo done.

### Step 4: Write config and spec

Create `scripts/store/playwright.config.ts` from
[templates/playwright.config.template.ts](templates/playwright.config.template.ts) and
`scripts/store/store-screenshots.spec.ts` from
[templates/store-screenshots.spec.template.ts](templates/store-screenshots.spec.template.ts). Follow the
project's conventions where it already has a store or user-guide screenshot setup (directory, naming, fixture
import path).

Config rules the template implements — keep them:

- One Playwright **project per device slot**, named after the slot (`iphone-69`, `ipad-13`, `android-phone`,
  …); `viewport × deviceScaleFactor` yields the store size directly where possible
- Where a layout device is used for a larger slot, the project carries `metadata.storeSize`; the spec resizes
  with sharp to exactly that size (`fit: 'cover'`, `removeAlpha`, JPEG)
- `workers: 1`, `retries: 0`, generous timeout (login + full data load), `reuseExistingServer: true`

Spec rules the template implements — keep them:

- Import the E2E `test` fixture and helpers; set the language via the fixture option; loop over languages only
  if the fixture supports switching without re-login
- `shot(page, name)`: inject a style tag hiding development-only selectors, settle 600 ms, capture the
  viewport with `scale: 'device'`, write JPEG (or resize through sharp when `storeSize` is set)
- Before every shot: close overlays (side menu — retry until the `show-menu` class is gone and the animation
  settled), wait for the content marker of that screen (first list item, a non-zero total, the map canvas plus
  `networkidle`), scroll to the intended position
- Seed realistic «today» data for tiles that show only current records; use the showcase records from Step 3;
  scroll past records that would look like test data if they cannot be removed
- File names `NN-slug.jpg` in story order, written to `resources/store/<lang>/<slot>/`

Mark this todo done.

### Step 5: Run per slot and verify

Run one slot at a time (`--project=<slot>`); a full run of ten screens takes several minutes per slot because
every test logs in. After each run:

1. Check sizes: every file has exactly the slot's pixel size (`sips -g pixelWidth -g pixelHeight` on macOS, or
   sharp's `metadata()`); the count matches the screen list
2. **Open every image** and check: no spinner, no open menu, no dev badge, no placeholder text, realistic
   values, nothing cut off, the intended scroll position
3. Fix the spec for every finding and re-run only the affected tests (`--grep`)

Mark this todo done.

### Step 6: Report

Tell the user: the folders and the exact sizes produced, which slot uses which layout device, the showcase
records used, the two commands to regenerate (install browsers, run the config), and any screens that still
show seed-data artefacts the project should fix in its seed. Offer `/ai-store-listing` for the texts.

Mark this todo done.

## Output

| Artifact      | Location                                    |
| ------------- | ------------------------------------------- |
| Screenshots   | `resources/store/<lang>/<slot>/NN-slug.jpg` |
| Spec + config | `scripts/store/`                            |

Follow the project's existing convention when it differs (e.g. `resources/appstore/<lang>/<slot>/`).
