<!--
Issue body template for a Technical task — a finding without a governing requirement: security, accessibility,
tests/CI, build, dependencies, refactoring, or internal documentation consistency.
Translate all headings and prose into the team's working language; keep IDs, status values, and identifiers in English.
Remove every HTML comment before creating the issue.
-->

## Context

|                 |                                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| Topic           | Security / Accessibility / Tests & CI / Build / Dependencies / Refactoring / Docs |
| Area            | [part of the app, or cross-cutting]                                               |
| Priority        | High / Medium / Low                                                               |
| Source          | Code review / Development / Monitoring / Stakeholder                              |
| Reporter / Date | [name] ([YYYY-MM-DD]), found in [e.g. review of PR #n]                            |

## Problem

[What is wrong and what it leads to — with `path/to/file.ts:line` references. No governing requirement; name the
NFR or guideline rule if one applies.]

## Root cause

[One sentence: the problem arose because … (decision, missing rule, gap), and stayed undetected because … (test,
lint, or review gap).]

- **Code:** [`path/to/file.ts:line`](path/to/file.ts#Lline) — [what]; defect class: [from the code-review catalogue]
- **Regression:** [no | yes — introduced by PR #n / commit `abc1234`]

## Why undetected

- **Tests / lint:** [no check for this | check exists but …] — closing check: [test, lint rule, CI step]
- **Review:** [not in the review checklist — proposed rule: «…» | rule existed but was not applied]

## Proposal

[The change, and alternatives if the choice is not obvious.]

## Acceptance criteria

- [ ] [verifiable criterion]
- [ ] [the closing test, lint rule, or CI step is in place]

## References

- Related issues and PRs: #n (…)
- Files: [`path/to/file.ts`](path/to/file.ts)
