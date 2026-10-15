# Store Submission Reference — Apple App Store and Google Play

Field limits and asset specifications used by `store-listing` and `store-screenshots`.

> **Verified 2026-10 against App Store Connect and Google Play Console help pages.** Both stores change these
> values without notice. Before an upload, open the upload dialog of the store and compare — the dialog's
> wording wins over this file. When a value differs, update this table in the same change.

## Apple App Store — text fields

| Field              | Limit      | Indexed for search | Changeable without new build | Notes                                                    |
| ------------------ | ---------- | ------------------ | ---------------------------- | -------------------------------------------------------- |
| Name               | 30 chars   | yes                | no                           | Unique on the store; avoid generic terms                 |
| Subtitle           | 30 chars   | yes                | no                           | One benefit, not a repeat of the name                    |
| Promotional Text   | 170 chars  | no                 | **yes**                      | Shown above the description; use for current news        |
| Description        | 4000 chars | no                 | no                           | First 3 lines visible before «more»                      |
| Keywords           | 100 chars  | yes                | no                           | Comma-separated, no spaces after commas, no name repeats |
| What's New         | 4000 chars | no                 | per version                  | Release notes; user-facing, no ticket numbers            |
| Support URL        | URL        | —                  | yes                          | Required                                                 |
| Marketing URL      | URL        | —                  | yes                          | Optional                                                 |
| Privacy Policy URL | URL        | —                  | yes                          | Required                                                 |
| Copyright          | text       | —                  | yes                          | `2026 Company AG`                                        |

Per localisation: Name, Subtitle, Promotional Text, Description, Keywords, What's New, screenshots.

## Apple App Store — screenshots

Minimum for submission: one iPhone set (6.9″ or 6.5″) and, when the app runs on iPad, one 13″ iPad set. Apple
scales the largest uploaded set down to smaller devices; a set for a smaller display is optional. 1–10 images
per device set. JPEG or PNG, **no alpha channel** (Playwright PNGs carry one — export JPEG), RGB.

| Display slot       | Portrait                              | Landscape                | Playwright viewport (pt) × scale |
| ------------------ | ------------------------------------- | ------------------------ | -------------------------------- |
| iPhone 6.9″        | 1320 × 2868, 1290 × 2796              | 2868 × 1320, 2796 × 1290 | 440 × 956 @3×                    |
| iPhone 6.5″        | 1242 × 2688, 1284 × 2778              | 2688 × 1242, 2778 × 1284 | 428 × 926 @3×                    |
| iPhone 6.3″ / 6.1″ | 1206 × 2622, 1179 × 2556              | 2622 × 1206, 2556 × 1179 | 402 × 874 @3×                    |
| iPad 13″ (12.9″)   | 2064 × 2752, 2048 × 2732              | 2752 × 2064, 2732 × 2048 | 1366 × 1024 @2× (landscape)      |
| iPad 11″           | 1668 × 2420, 1668 × 2388, 1640 × 2360 | 2420 × 1668, 2388 × 1668 | 1194 × 834 @2× (landscape)       |

A layout captured on a different device than the slot (e.g. an 11″ iPad layout delivered into the 13″ slot) is
resized to the slot's exact pixel size with `sharp` (`fit: 'cover'`, never stretched) — see the
`store-screenshots` templates.

App previews (video): 1920 × 886 / 886 × 1920 (iPhone 6.9″/6.5″), 1600 × 1200 / 1200 × 1600 (iPad 13″),
15–30 s, up to 3 per device set. Not covered by the skills.

## Google Play — text fields

| Field              | Limit                  | Notes                                             |
| ------------------ | ---------------------- | ------------------------------------------------- |
| App name           | 30 chars               |                                                   |
| Short description  | 80 chars               | Shown on the listing before «About this app»      |
| Full description   | 4000 chars             | Plain text; Play renders line breaks, no Markdown |
| Release notes      | 500 chars per language | Wrapped in `<xx-XX>` language tags in the console |
| App category       | pick list              | e.g. Business, Productivity                       |
| Contact e-mail     | address                | Required; shown publicly                          |
| Privacy policy URL | URL                    | Required                                          |

## Google Play — graphics

| Asset                  | Size / ratio                                                | Count                              | Format                        |
| ---------------------- | ----------------------------------------------------------- | ---------------------------------- | ----------------------------- |
| App icon               | 512 × 512                                                   | 1                                  | 32-bit PNG with alpha, ≤ 1 MB |
| Feature graphic        | 1024 × 500                                                  | 1 (required)                       | JPEG or 24-bit PNG, no alpha  |
| Phone screenshots      | 9:16 or 16:9, 320–3840 px per side, 1080 × 1920 recommended | 2–8                                | JPEG or 24-bit PNG, no alpha  |
| 7″ tablet screenshots  | 9:16 or 16:9, 1080–7680 px per side                         | up to 8 (≥ 4 for tablet featuring) | JPEG or 24-bit PNG, no alpha  |
| 10″ tablet screenshots | 9:16 or 16:9, 1080–7680 px per side                         | up to 8 (≥ 4 for tablet featuring) | JPEG or 24-bit PNG, no alpha  |

Rule for all Play screenshots: the long side is at most twice the short side. Device layouts to capture:

| Slot       | Playwright viewport (pt) × scale                                  | Output      |
| ---------- | ----------------------------------------------------------------- | ----------- |
| Phone      | 412 × 915 @2.625× (Pixel 7 class) → resize to 1080 × 1920         | 9:16        |
| 7″ tablet  | 600 × 1024 @2× → 1200 × 2048 (9:16) or landscape 2048 × 1200      | 16:9 / 9:16 |
| 10″ tablet | 1280 × 800 @2× → 2560 × 1600 (16:10 → resize to 16:9 2560 × 1440) | 16:9        |

## Distribution notes

- **Apple, internal/B2B apps**: an app that needs a company account states this in the first description
  paragraph and under App Review notes, with a demo account or a note that review is done in a test mode — App
  Review rejects apps it cannot sign into (Guideline 2.1). MDM-only distribution (Apple Business Manager custom
  apps, Intune) still goes through App Review.
- **Google Play, internal apps**: managed Google Play (private apps for an enterprise) uses the same listing
  fields; the listing is visible only to the enterprise's devices.
- Localised listings: a language the app does not support should not get a listing in that language — the
  store shows the default language instead.
