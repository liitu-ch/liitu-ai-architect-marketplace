---
name: issue
description: >
  Captures a new issue for a reported problem or field-test feedback and
  performs a real root cause analysis before writing it: locates the governing
  use case, requirements, and business rules, checks whether the specification
  is wrong, contradictory, or silent, finds the code deviation and whether it is
  a regression, and explains why the existing tests and the code review did not
  catch it. Asks about available test data and the affected entity for
  reproduction, classifies the finding as Bug or Change Request, and creates the
  issue via `gh` using the project's GitHub issue template. Use when the user
  asks to "create an issue", "file a bug", "report a bug", "capture testing
  feedback", "Issue erfassen", "Bug melden", "Testingfeedback erfassen", asks
  "why did this bug happen" or for a "root cause", or pastes a field-test
  finding that should become an issue.
---

# Capture Issue

Turn the observation in $ARGUMENTS (free text, pasted testing feedback, a screenshot path, or an existing issue number to re-analyze) into a GitHub issue that states not only **what** is wrong but **why it happened** and **why it was not caught earlier**. The output is the issue itself — no code, spec, or test changes are made during this skill.

The skill closes the loop of the other AI Architect skills: it reads the artifacts they produce (`docs/requirements.md`, `docs/use_cases/*.md`, `docs/entity_model.md`, `docs/guidelines/`, `TESTING.md`, `docs/test-plans/`, `e2e/`, unit tests) and reports where those artifacts — not just the code — need correction.

## DO NOT

- Create the issue before the user has confirmed title, body, and labels
- Classify a finding as **Bug** without quoting the spec sentence (UC step, alternative flow, BR, or FR) the code violates — if no such sentence exists, it is a spec gap and therefore a **Change Request**, never a Bug
- Invent test data, reproduction steps, or reproduction results — reproduction is either executed and recorded with the exact values, or marked as "not attempted" with the reason
- Skip the **why undetected** analysis (tests, review, spec) — the section is mandatory even when the answer is "no test exists for this path"
- Mix independent root causes in one issue — split them into separate issues and cross-link
- Duplicate an existing issue — search first; if a duplicate exists, add the new evidence as a comment there instead
- Change code, specs, tests, or requirement statuses during this skill — such changes become tasks in the issue and are offered as follow-ups
- Write the issue body in a language other than the team's working language — IDs (`UC-XXX`, `FR-XXX`, `BR-XXX`), status values, and code identifiers stay in English
- Ignore an existing project issue template (`.github/ISSUE_TEMPLATE/`) — when one exists, its sections and fields are binding
- Ask reproduction and classification questions as free-form prose — use the `AskUserQuestion` tool as described below

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Capture the report and ask about test data
- Load project context and detect issue conventions
- Locate spec, code, and related issues
- Reproduce
- Root cause analysis (spec, code, tests, review)
- Classify with the user
- Compose the issue
- Create the issue and offer follow-ups
- Quality check

### Step 2: Capture the report and ask about test data

Parse $ARGUMENTS. If it is an issue number, load it with `gh issue view <n> --comments` — the skill then enriches that issue instead of creating a new one. Extract what is known:

- **Observed** (Ist): what happened, in the reporter's words — quote them
- **Expected** (Soll, as reported): what the reporter expected
- **Where**: view, dialog, list, flow
- **Who / when**: tester or reporter, date, source (field test, code review, development, stakeholder)
- **Evidence**: screenshots, log excerpts, record identifiers mentioned in the report

Then **use the `AskUserQuestion` tool** in a single call (max 4 questions) to collect what reproduction needs. Ground every option in the project: derive entity names from `docs/entity_model.md`, environments from `TESTING.md` and the project's run scripts. Mark the most plausible option "(Recommended)" and rely on the built-in "Other" choice for anything else.

1. **Source** (header "Source"): field test / code review / development / stakeholder request — skip if $ARGUMENTS already says so.
2. **Test data** (header "Test data"): "Yes — known records exist" / "Yes — in the mock seed" / "No — must be created" / "Unknown".
3. **Entity** (header "Entity", `multiSelect: true`): which entities from the entity model are involved in reproducing the problem (e.g. Customer, Order, Material, Configuration). Offer the four most plausible ones from the symptom.
4. **Environment** (header "Environment"): where the problem was observed and where it should be reproduced — mock server / test backend / production / device build (iOS, Android, browser).

If the user has known records, ask in a short follow-up message for the concrete identifiers (e.g. customer number, order number, material number, user) and the state the record must be in. These identifiers go verbatim into the **Reproduction** section. Never guess them.

Mark this todo done.

### Step 3: Load project context and detect issue conventions

Read these documents; note as missing where absent:

1. `docs/requirements.md`, `docs/use_cases.md`, `docs/use_cases/*.md`, `docs/entity_model.md` — the specification the observation is measured against
2. `docs/guidelines/` — `README.md`, `naming-and-language.md` (glossary), `compliance-checklist.md` — binding rules a fix must follow
3. `TESTING.md`, `docs/test-plans/`, `e2e/` (or the project's E2E folder), unit test locations — the test levels and where coverage should exist
4. `CLAUDE.md` — project-specific conventions (e.g. issue references in `@temporary` markers, release-note rules)

Detect the **issue conventions** of the project:

- **Project issue template**: look for `.github/ISSUE_TEMPLATE/*.yml` or `*.md` in the repository, then in the organisation's `.github` repository (`gh api repos/<org>/.github/contents/.github/ISSUE_TEMPLATE`). If a template exists, its sections or form fields are binding for the issue body — fill every field. If none exists, use this skill's templates ([templates/issue-bug.md](templates/issue-bug.md), [templates/issue-change-request.md](templates/issue-change-request.md)) and note in the final report that the project has no issue template (the GitHub best-practice forms in [templates/github/ISSUE_TEMPLATE/](templates/github/ISSUE_TEMPLATE/) can be installed as a follow-up).
- **Labels**: `gh label list` — only existing labels are offered in Step 7.
- **House style**: `gh issue list --limit 20 --state all` — learn the title pattern (e.g. `Testingfeedback FR-XXX (Bereich): Ist — Soll`), the language, and the recurring section headings. New issues follow the observed style, not the skill's defaults, unless the user asks otherwise.

Mark this todo done.

### Step 4: Locate spec, code, and related issues

**Specification.** Find the use case, requirements, and business rules that govern the observed behaviour. Search `docs/use_cases/*.md` and `docs/requirements.md` for the nouns and actions in the report (derive search terms as the `implement-use-case` skill does — from the actor, goal, and key nouns, not only from IDs). Record:

- Governing UC(s) with status, the FR(s) with status and priority, the BR(s) — with file paths and line numbers
- The exact sentence(s) that define the expected behaviour for this case — quote them. If no sentence covers the case, record "spec silent".

**Related issues.** `gh issue list --search "<keywords>" --state all` plus the IDs found above (`gh issue list --search "FR-105"`). Record duplicates, related open issues, and the issue or PR that introduced the current behaviour ("Korrektur zu #…", "Regression aus PR #…"). If a duplicate exists, stop the creation path: report it, and offer to add the new evidence as a comment.

**Code.** Locate the implementation: the component, service, mapper, store, or rule enforcement that produces the observed behaviour. Record `file:line`. Use `git log -S '<key expression>'` and `git blame` to find the originating commit and PR — this is the input for the regression and review questions in Step 6.

Mark this todo done.

### Step 5: Reproduce

Reproduce with the test data from Step 2 where this is possible without side effects:

- **Domain logic, mappers, pricing, validation** → write a throwaway probe (a temporary unit test or script outside the project tree) that calls the function with the reported values, run it, and record the actual output
- **UI behaviour** → run the app against the mock server and drive it with the Playwright MCP server (shipped by the `ai-architect-testing` plugin) if available; otherwise describe the manual steps precisely and mark the result "not attempted"
- **External system behaviour** (real backend, device-specific behaviour) → do not attempt; record the exact steps for a manual retest and the record identifiers to use

Record one of: **Reproduced** (with the exact input and output values), **Not reproduced** (what was tried), **Not attempted** (why). Remove any probe files afterwards.

Mark this todo done.

### Step 6: Root cause analysis

Work through the four layers in order. Keep asking "why" until the answer is a decision, a missing rule, or a missing check — a symptom is never a root cause.

**6a. Specification — is the spec right?**

Compare the observed behaviour with the governing spec from Step 4:

| Finding                                                                      | Meaning             | Consequence                                                                                         |
| ---------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| Spec defines the expected behaviour, the code deviates                       | Code defect         | **Bug**                                                                                             |
| Spec is silent — no step, alternative flow, or BR covers the case            | Spec gap            | **Change Request**: spec update (`/ai-use-case-spec`) plus implementation; UC → `Revision Required` |
| Spec contradicts itself — FR vs. BR, BR vs. BR, UC vs. UC, spec vs. glossary | Spec defect         | **Change Request** with a stakeholder decision under "To clarify"                                   |
| Spec and code agree, but the stakeholder now expects something else          | Requirement change  | **Change Request** (`/ai-requirements`, `/ai-use-case-spec`)                                        |
| Spec is outdated — obsolete BR, duplicate IDs, references to removed rules   | Documentation drift | **Change Request** (documentation)                                                                  |

Additional checks, each of which is a finding on its own:

- Duplicate BR IDs across use cases, or BR references without a UC prefix that cannot be resolved
- FR or UC status `Implemented` / `Verified` although the behaviour is broken — the status was set without verification
- Observed UI behaviour that the spec does not describe (the `use-case-spec` skill forbids leaving observed behaviour undocumented) — an alternative flow is missing
- Entity model silent on an attribute, length, or value range that the problem hinges on (`/ai-entity-model`)
- Glossary term missing or translated ad hoc in the affected code

**6b. Code — where and since when?**

- The deviation at `file:line`, in one or two sentences
- The **defect class**, using the `code-review` skill's catalogue: dead state, lifecycle asymmetry, duplicate event handling, silent error swallowing, async without error handling, contract & mock parity, i18n, language & naming, UI consistency, documentation & status sync — or a new class if none fits (say so explicitly; this feeds 6d)
- **Regression?** Originating commit and PR from Step 4; whether the behaviour was a side effect of another fix (name it)
- **Mock vs. real backend**: whether the mock server behaves differently from the real system for this case (a defect that only shows against the real backend is a mock-parity gap)

**6c. Tests — why did no test catch it?**

Check the E2E spec of the governing UC, the unit tests of the located module, `docs/test-plans/` for the feature, and the strategy in `TESTING.md`. Classify:

| Finding                                                                                                                | Missing test level and skill                                                    |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No test covers this path                                                                                               | Unit (`/ai-vitest`), E2E (`/ai-playwright-test`), or manual (`/ai-manual-test`) |
| A test exists but uses data that hides the defect (round values where a boundary matters, happy-path only, one locale) | Test data rule missing — boundary values, real customizing values               |
| A test pins the wrong behaviour (asserts the bug)                                                                      | The test was written from the code, not from the spec                           |
| Test is skipped (`fixme`, `skip`) or flaky                                                                             | Coverage silently lost                                                          |
| Not automatable (device, native, real backend) and not in a manual test plan                                           | Manual test plan gap (`/ai-manual-test`)                                        |
| Covered against the mock only; the real backend behaves differently                                                    | Mock parity gap — test system retest required                                   |

Name the concrete regression test the fix must add (level, file, what it asserts) and whether `TESTING.md` needs a rule (e.g. "boundary values are tested with the real customizing values").

**6d. Review — why did the code review not catch it?**

- Did the originating PR have a review? (`gh pr view <n> --comments`) What did it cover?
- Is the defect class part of the `code-review` skill's dimensions (A language & naming, B i18n, C UI consistency, D documentation & status sync, E defect classes, F contract & mock parity, G hygiene)? If yes, the rule existed but was not applied — note whether the change predates the rule. If no, the review checklist has a gap: propose the new check (one sentence) for the `code-review` skill and for `docs/guidelines/compliance-checklist.md`
- Is a guideline missing in `docs/guidelines/` that would have made the correct implementation obvious (e.g. "convert language codes only via the shared converter")? Propose the rule
- If the root cause is a spec defect, say so plainly: a review checks code against the spec and cannot catch what the spec approved

**6e. Root cause statement**

Condense the analysis into one sentence in the team's working language, of the form: "The problem arose because … (decision, missing rule, or gap), and stayed undetected because … (test gap) and … (review or spec gap)." Add the two-axis classification:

- **Origin**: Spec / Code / Data / External system / Process
- **Detection gap**: Test / Review / Both / None possible (e.g. field-only behaviour)

If the analysis reveals **more than one independent root cause**, prepare one issue per root cause and cross-link them — do not fold them into one.

Mark this todo done.

### Step 7: Classify with the user

**Use the `AskUserQuestion` tool** in a single call (max 4 questions). Put your recommendation first and label it "(Recommended)"; the option descriptions carry the evidence from Step 6 so the user can decide without re-reading the analysis.

1. **Type** (header "Type"): **Bug** (code deviates from a quoted spec sentence) / **Change Request** (spec gap, spec defect, requirement change, or documentation drift) / **Clarification needed** (a stakeholder decision must precede any implementation — the issue is created as a question).
2. **Priority** (header "Priority"): High / Medium / Low. Recommend High for data loss, wrong amounts or prices, sync and duplicate records, blocked core journeys; Medium for wrong but recoverable behaviour; Low for cosmetic findings.
3. **Labels** (header "Labels", `multiSelect: true`): only labels that exist in the repository (Step 3), pre-selected to match the type and source (e.g. `bug`, `change-request`, `question`, a testing-feedback label).
4. **Follow-ups** (header "Follow-ups", `multiSelect: true`): which detected gaps get their own issue — spec correction, missing test, review-checklist rule, guideline rule — or "fold into this issue".

If Step 6 found several independent root causes, ask in a second call (header "Split") whether to create one issue per root cause (recommended) or one combined issue.

Mark this todo done.

### Step 8: Compose the issue

**Title** — follow the house pattern from Step 3. Default when the project has none: `<Kind> <ID> (<area>): <observed> — <expected>` (e.g. `Testingfeedback FR-105 (Position-Kontextmenü): Menü schliesst nach jedem Mengenschritt — +1/−1 soll offen bleiben`). Keep it under 120 characters; the ID goes into the title so the issue is searchable by requirement.

**Body** — fill the project template if one exists; otherwise use [templates/issue-bug.md](templates/issue-bug.md) or [templates/issue-change-request.md](templates/issue-change-request.md). Whatever the template, the body must contain:

1. **Context** — table with requirement/UC, area, priority, current spec status, source, reporter and date; the user story or UC goal quoted
2. **Finding** — observed vs. expected, with the reporter's words quoted and the spec sentence quoted
3. **Reproduction** — environment, test data (entity and identifiers from Step 2), numbered steps, result of Step 5
4. **Root cause** — the statement from 6e, the spec finding (6a), the code location and defect class (6b), regression origin
5. **Why undetected** — tests (6c) and review (6d), each with the concrete gap and the skill or rule that closes it
6. **To implement** — ordered checklist: spec and documentation updates first, then code, then the regression test, then status sync (`docs/requirements.md`, `docs/use_cases/UC-XXX.md`)
7. **Acceptance criteria** — verifiable checkboxes; the last one is always the regression test (or a justified manual retest against the real system)
8. **To clarify** — only when a stakeholder decision is needed: the question, the assumption taken in the meantime, the affected IDs
9. **References** — UC/FR/BR with file links, related issues and PRs, affected files, the source of the report

Write it in the team's working language; keep IDs, status values, and identifiers in English; link files as `path:line`.

Show the complete draft (title, labels, body) to the user, then **use the `AskUserQuestion` tool** (header "Create"): **Create now** / **Adjust** (the user states what to change; revise and ask again) / **Save as draft only** (write the body to a file the user names and stop).

Mark this todo done.

### Step 9: Create the issue and offer follow-ups

Write the body to a temporary file and create the issue with `gh issue create --title "<title>" --body-file <file> --label <label> …`. For an enrichment of an existing issue use `gh issue edit` (body) or `gh issue comment` (analysis only), as agreed with the user. Report the issue URL.

Create the follow-up issues chosen in Step 7 the same way — each with its origin ("Found while analysing #<n>"), the affected IDs, and acceptance criteria — and link them from the main issue.

Offer, but do not perform unasked:

1. Install the GitHub issue forms from [templates/github/ISSUE_TEMPLATE/](templates/github/ISSUE_TEMPLATE/) into the project when it has none
2. Correct the specification: `/ai-use-case-spec UC-XXX`, `/ai-requirements`, `/ai-entity-model`
3. Close the test gap: `/ai-vitest`, `/ai-playwright-test`, or `/ai-manual-test` for the named regression test
4. Extend the review rules: the proposed check for the `code-review` skill and `docs/guidelines/` (`/ai-guidelines`)
5. Plan the fix: `/ai-implement-use-case UC-XXX`

Mark this todo done.

### Step 10: Quality check

Verify before finishing:

- [ ] Test data and entity were asked via `AskUserQuestion`; identifiers appear verbatim under Reproduction or the section says why none exist
- [ ] The governing UC/FR/BR are named with file references, and the expected behaviour is quoted from the spec — or "spec silent" is stated and the type is not Bug
- [ ] Reproduction is recorded as Reproduced / Not reproduced / Not attempted with exact values or the reason
- [ ] The root cause statement names a decision, rule, or gap — not a symptom
- [ ] "Why undetected" covers tests **and** review, each with the concrete gap and the closing skill or rule
- [ ] Existing issues were searched; duplicates were not created
- [ ] The project's issue template (if any) is fully filled; labels exist in the repository
- [ ] Independent root causes are separate, cross-linked issues
- [ ] The body is in the team's working language; IDs, statuses, and identifiers are English
- [ ] Acceptance criteria end with the regression test or a justified manual retest
- [ ] The user confirmed the draft before `gh issue create` ran
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing.

## Output

A GitHub issue (URL reported to the user), optionally plus follow-up issues for spec, test, review, and guideline gaps. No document is written to `docs/`; when the user chooses "Save as draft only", the body is written to the file they name.
