<!--
Issue body template for a Change Request — the specification is silent, contradictory, outdated,
or the stakeholder now expects different behaviour. The spec change comes first, the implementation second.
Translate all headings and prose into the team's working language; keep IDs, status values, and identifiers in English.
Remove every HTML comment before creating the issue.
-->

## Context

|                 |                                                                          |
| --------------- | ------------------------------------------------------------------------ |
| Requirement     | FR-XXX / UC-XXX                                                          |
| Area            | [view, dialog, or flow]                                                  |
| Priority        | High / Medium / Low                                                      |
| Spec status     | [status] → `Revision Required` once accepted                             |
| Kind            | Spec gap / Spec contradiction / Requirement change / Documentation drift |
| Source          | Field test / Code review / Development / Stakeholder                     |
| Reporter / Date | [name] ([YYYY-MM-DD])                                                    |

**User story (FR-XXX):** [quoted from docs/requirements.md]

## Finding

**Observed:** «[reporter's words]»

**Expected (per reporter / stakeholder):** [expected behaviour]

**Current specification:** [«quoted sentence» from UC-XXX / BR-XXX | spec silent — no step, alternative flow, or BR covers this case | contradiction: FR-XXX says «…», BR-XXX says «…»]

## Reproduction

| Environment                    | Test data                                | Result                                      |
| ------------------------------ | ---------------------------------------- | ------------------------------------------- |
| [mock / test backend / device] | [entity] `[identifier]` in state [state] | Reproduced / Not reproduced / Not attempted |

1. [step]
2. [observed result — which today is spec-conform]

## Root cause

[One sentence: the behaviour follows the spec / is undefined because … (missing rule, decision, changed need), and the gap stayed undetected because … (review, test, or spec review).]

- **Origin:** Spec / Process / Requirement change
- **Spec finding:** [which document, which section is silent, wrong, or contradictory — file:line]
- **Code:** [`path/to/file.ts:line`](path/to/file.ts#Lline) — [what implements the current spec]
- **Origin of the current rule:** [issue #n / workshop / decision date]

## Why undetected

- **Spec review:** [the case was not considered when UC-XXX was approved | the contradiction between FR-XXX and BR-XXX was introduced in #n]
- **Tests:** [tests pin the current spec — they need updating with the spec, file] — closing test: [unit/E2E/manual]
- **Review:** [a code review checks against the spec and could not catch this | the review missed «…» — proposed rule]

## Change proposal

| Option | Description                                      | Effort                 | Consistency with existing rules    |
| ------ | ------------------------------------------------ | ---------------------- | ---------------------------------- |
| A      | [reporter's proposal]                            | small / medium / large | [e.g. keeps deviation from BR-XXX] |
| B      | [alternative that fits the existing systematics] | …                      | …                                  |

<!-- One option is fine when the change is unambiguous. -->

## To clarify

- [question for the stakeholder] — assumption in the meantime: [assumption]; affects: UC-XXX / FR-XXX / BR-XXX

## To implement (after decision)

- [ ] Update spec: `docs/use_cases/UC-XXX_….md` ([step / alternative flow / BR-XXX]) — `/ai-use-case-spec UC-XXX`
- [ ] Update requirements: `docs/requirements.md` (FR-XXX text/status) — `/ai-requirements`
- [ ] [entity model / glossary / guideline update, if any]
- [ ] [code change — file, what]
- [ ] [regression test — level, file, what it asserts; existing tests updated to the new spec]
- [ ] Status sync: FR-XXX and UC-XXX

## Acceptance criteria

- [ ] Spec and code agree: [criterion quoting the new rule]
- [ ] [verifiable criterion with the reported values]
- [ ] [neighbouring cases unchanged — regression criterion]
- [ ] Regression test [file] covers [case] — or: manual retest against [system] with [identifier] passed

## References

- Spec: [UC-XXX](docs/use_cases/UC-XXX_….md), FR-XXX in [docs/requirements.md](docs/requirements.md), BR-XXX
- Related issues: #n (…), #m (…)
- Files: [`path/to/file.ts`](path/to/file.ts)
- Report: [source, e.g. field test 2026-09-22, tester]
