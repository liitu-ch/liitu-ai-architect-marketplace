# Product Backlog: [Product name]

Stand: [YYYY-MM-DD] · Product Owner: [Name] · Quelle der Einträge: `docs/requirements.md`,
`docs/use_cases/`, GitHub-Issues

## Produkt-Ziel

<!-- Identisch mit docs/vision.md — die Vision ist das Original. -->

|                  |                                                      |
| ---------------- | ---------------------------------------------------- |
| **Produkt-Ziel** | [One sentence, outcome-driven]                       |
| **Messgrösse**   | [KVM] — heute: [current value], Ziel: [target value] |
| **Horizont**     | [Date or event]                                      |

## Geordnetes Backlog

Ein Eintrag pro Zeile, Rang eindeutig. **Warum hier** nennt den entscheidenden Ordnungsfaktor: Entblockt /
Unsicherheit / Wert / Verzögerungskosten / Lernen.

| Rang | ID     | Titel                    | Produkt-Ziel | Wert (Quelle)                             | Warum hier     | Abhängig von | Grösse | Zustand                                     |
| ---- | ------ | ------------------------ | ------------ | ----------------------------------------- | -------------- | ------------ | ------ | ------------------------------------------- |
| 1    | FR-XXX | [Title]                  | aktuell      | [One sentence — «…» (vision.md / FR-XXX)] | Entblockt #2–4 | —            | M      | Ready                                       |
| 2    | UC-XXX | [Title]                  | aktuell      | [Sentence (source)]                       | Unsicherheit   | FR-XXX       | L      | Refining — Spec fehlt (`/ai-use-case-spec`) |
| 3    | #123   | [Title]                  | aktuell      | [Sentence (issue #123)]                   | Wert           | —            | —      | Idea                                        |
| …    |        |                          |              |                                           |                |              |        |                                             |
| n    | GOAL-2 | [Later goal placeholder] | nachfolgend  | [Sentence (vision.md)]                    | Lernen         | —            | —      | Idea                                        |

Zustände: **Idea** → **Refining** → **Ready** (UC `Approved` mit Akzeptanzkriterien, Grösse geschätzt) →
**In Sprint** (Plan `In Progress`) → **Done** (FR `Implemented`/`Verified`).

## Refinement-Warteschlange

Was den obersten nicht-bereiten Einträgen noch fehlt:

| Rang | ID     | Fehlt                                      | Schliesst                  | Bis    |
| ---- | ------ | ------------------------------------------ | -------------------------- | ------ |
| 2    | UC-XXX | Use-Case-Spezifikation, Akzeptanzkriterien | `/ai-use-case-spec UC-XXX` | [Date] |
| 3    | #123   | Anforderung (FR) und Use Case              | `/ai-requirements`         | [Date] |

## Erledigt

| ID     | Titel   | Done am      | Nachweis                             |
| ------ | ------- | ------------ | ------------------------------------ |
| FR-XXX | [Title] | [YYYY-MM-DD] | UC-XXX `Verified`, Release [version] |

## Bewusst nicht

| ID / Thema | Grund                                             | Entschieden am |
| ---------- | ------------------------------------------------- | -------------- |
| [Item]     | Ausserhalb der Vision («…», vision.md Abgrenzung) | [YYYY-MM-DD]   |
| [Item]     | Zurückgestellt bis Produkt-Ziel 2                 | [YYYY-MM-DD]   |

## Entscheidungen

| Datum        | Entscheidung                                          | Durch |
| ------------ | ----------------------------------------------------- | ----- |
| [YYYY-MM-DD] | Erstordnung; #123 vor FR-YYY wegen Messetermin [Date] | [PO]  |

## Quellen

- `docs/vision.md` — Produkt-Ziel, Abgrenzung
- `docs/requirements.md` — FR-XXX, NFR-XXX, C-XXX
- `docs/use_cases.md`, `docs/use_cases/UC-XXX.md`
- `docs/guidelines/definition-of-done.md` — Definition of Done
- GitHub-Issues mit Label [change-request label]
