# Google Play Console — [Language] ([locale, e.g. de-CH])

App: [App name] · Version: [x.y.z] · Stand: [YYYY-MM-DD] · Vertrieb: [public / company account / managed Play]

Limits: App-Name 30 · Kurzbeschreibung 80 · Vollständige Beschreibung 4000 · Versionshinweise 500 pro Sprache.
Vor dem Upload mit dem Dialog in der Play Console abgleichen. Play rendert nur Zeilenumbrüche, kein Markdown.

## App-Name

<!-- chars: 0 / 30 -->

```text
[App name]
```

## Kurzbeschreibung

<!-- chars: 0 / 80 -->

```text
[What the app is, for whom, the one distinguishing quality.]
```

## Vollständige Beschreibung

<!-- chars: 0 / 4000 -->

```text
[Paragraph 1 — the vision statement rewritten for the reader.]

[SECTION HEADING FROM THE VISION]
• […]
• […]

[SECTION HEADING]
• […]

[FLEXIBILITY / TRUST — from the NFRs]
• […]

WICHTIGER HINWEIS
[Only when a company account or enrolment is required.]

[Closing claim line]
```

## Versionshinweise — Version [x.y.z]

<!-- chars: 0 / 500 -->

```text
<de-CH>
Neu: […]
Verbessert: […]
Behoben: […]
</de-CH>
```

## Einstellungen

| Feld            | Wert           |
| --------------- | -------------- |
| Kategorie       | [Business / …] |
| Kontakt-E-Mail  | [address]      |
| Datenschutz-URL | [URL]          |
| Website         | [URL]          |

## Grafiken

| Asset           | Grösse                    | Datei                                   |
| --------------- | ------------------------- | --------------------------------------- |
| App-Symbol      | 512 × 512 PNG             | `resources/store/icon-512.png`          |
| Funktionsgrafik | 1024 × 500 JPEG/PNG       | `resources/store/feature-graphic.jpg`   |
| Smartphone      | 1080 × 1920 (9:16), 2–8   | `resources/store/<lang>/android-phone/` |
| 7-Zoll-Tablet   | 9:16 oder 16:9, ≥ 1080 px | `resources/store/<lang>/android-7/`     |
| 10-Zoll-Tablet  | 9:16 oder 16:9, ≥ 1080 px | `resources/store/<lang>/android-10/`    |

## Nachweis

| Abschnitt / Satz  | Beleg                        |
| ----------------- | ---------------------------- |
| [Section heading] | FR-XXX (Implemented), UC-XXX |

## Revisionen

| Datum        | Änderung    | Durch  |
| ------------ | ----------- | ------ |
| [YYYY-MM-DD] | Erstfassung | [Name] |
