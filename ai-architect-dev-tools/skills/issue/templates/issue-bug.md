<!--
Issue body template for a Bug — the code deviates from a spec sentence that exists.
Translate all headings and prose into the team's working language; keep IDs, status values, and identifiers in English.
Remove every HTML comment before creating the issue.
-->

## Context

|                 |                                                                 |
| --------------- | --------------------------------------------------------------- |
| Requirement     | FR-XXX / UC-XXX                                                 |
| Area            | [view, dialog, or flow]                                         |
| Priority        | High / Medium / Low                                             |
| Spec status     | [status of the FR/UC in docs/requirements.md / docs/use_cases/] |
| Source          | Field test / Code review / Development / Stakeholder            |
| Reporter / Date | [name] ([YYYY-MM-DD])                                           |

**User story (FR-XXX):** [quoted from docs/requirements.md]

## Finding

**Observed:** «[reporter's words]»

**Expected:** [expected behaviour] — per [UC-XXX step N / A2 / BR-XXX](docs/use_cases/UC-XXX_….md#L…): «[quoted spec sentence]»

## Reproduction

| Environment                    | Test data                                | Result                                      |
| ------------------------------ | ---------------------------------------- | ------------------------------------------- |
| [mock / test backend / device] | [entity] `[identifier]` in state [state] | Reproduced / Not reproduced / Not attempted |

1. [step]
2. [step]
3. [observed result with exact values]

<!-- If not attempted: state why and which environment and record the retest needs. -->

## Root cause

[One sentence: the problem arose because … (decision, missing rule, gap), and stayed undetected because … (test) and … (review).]

- **Origin:** Spec / Code / Data / External system / Process
- **Spec:** [correct — the code deviates | gap | contradiction FR-XXX vs. BR-XXX | outdated] — [one sentence]
- **Code:** [`path/to/file.ts:line`](path/to/file.ts#Lline) — [what deviates]; defect class: [from the code-review catalogue]
- **Regression:** [no | yes — introduced by PR #n / commit `abc1234` as a side effect of #m]

## Why undetected

- **Tests:** [no test for this path | test uses data that hides the defect (…) | test pins the wrong behaviour (`file.test.ts:line`) | skipped | not automatable and not in the manual plan] — closing test: [unit/E2E/manual, file, assertion]
- **Review:** [defect class is dimension X of the review checklist but was not applied | not in the checklist — proposed rule: «…» | spec-driven, no review could catch it]
- **Guidelines:** [rule exists in docs/guidelines/… | missing rule: «…»]

## To implement

- [ ] [spec or documentation correction, if any — file and section]
- [ ] [code change — file, what]
- [ ] [regression test — level, file, what it asserts]
- [ ] Status sync: `docs/requirements.md` (FR-XXX) and `docs/use_cases/UC-XXX_….md`

## Acceptance criteria

- [ ] [verifiable criterion with the reported values]
- [ ] [verifiable criterion for the neighbouring cases]
- [ ] Regression test [file] covers [case] — or: manual retest against [system] with [identifier] passed

## To clarify

<!-- Only if a stakeholder decision is needed; otherwise remove this section. -->

- [question] — assumption in the meantime: [assumption]; affects: UC-XXX / BR-XXX

## References

- Spec: [UC-XXX](docs/use_cases/UC-XXX_….md), FR-XXX in [docs/requirements.md](docs/requirements.md), BR-XXX
- Related issues: #n (…), #m (…)
- Origin: PR #n / commit `abc1234`
- Files: [`path/to/file.ts`](path/to/file.ts)
- Report: [source, e.g. field test 2026-09-22, tester]
