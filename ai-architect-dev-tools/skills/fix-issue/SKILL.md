---
name: fix-issue
description: >
  Resolves a GitHub issue end to end by orchestrating the other AI Architect
  skills: loads the issue, runs the `issue` skill's root cause analysis when the
  issue lacks one, corrects the specification first (use case, requirements,
  business rules, entity model, glossary) when the root cause is a spec gap or
  contradiction, plans the fix with `implement-use-case`, writes the regression
  test first with `vitest` / `playwright-test` / `manual-test` and adds mock
  seed data or fixtures when reproduction needs them, implements the fix under
  the project guidelines, syncs requirement and use case statuses, reviews the
  branch with `code-review`, and commits with `commit`. Use when the user asks
  to "fix issue #123", "work on issue #123", "resolve the bug in #123",
  "implement change request #123", "Issue beheben", "Issue umsetzen",
  "Bug fixen", or references an issue number and wants it resolved.
---

# Fix Issue

Resolve the GitHub issue given in $ARGUMENTS (an issue number or URL). The deliverable is a branch on which the specification, the regression tests, the seed data, the code, and the requirement statuses are changed together, reviewed, and committed — ready for a pull request. Nothing is fixed "just in code": every fix starts at the artifact the root cause points to.

This skill is an orchestrator. It calls the other skills at defined points instead of re-implementing them:

| Step                               | Skill                                                                 |
| ---------------------------------- | --------------------------------------------------------------------- |
| Root cause missing or unclear      | `issue` (`/ai-issue <n>`)                                             |
| Specification correction           | `use-case-spec`, `requirements`, `entity-model` (`ai-architect-core`) |
| Guideline or glossary rule missing | `guidelines` (`/ai-guidelines`)                                       |
| Planning and traceability          | `implement-use-case` (`/ai-implement-use-case UC-XXX`)                |
| Regression tests                   | `vitest`, `playwright-test`, `manual-test` (`ai-architect-testing`)   |
| Pre-merge review                   | `code-review` (`/ai-code-review`)                                     |
| Commit                             | `commit` (`/ai-commit`)                                               |

## DO NOT

- Change code before the issue has a classified root cause (Bug or Change Request) with a governing UC/FR/BR — run the `issue` skill first when that analysis is missing
- Fix the symptom when the issue names the root cause elsewhere (e.g., clamp a value in the view when the mapper or the spec is wrong)
- Change a use case, requirement, business rule, or entity attribute silently — every spec change is an explicit edit with a status change and is listed in the plan and the PR
- Implement a Change Request whose stakeholder decision ("To clarify") is still open — ask for the decision or stop
- Ship a fix without a regression test that fails before and passes after the fix — or, when the case is not automatable, without a manual test case and a stated reason
- Adapt a test to the code — tests are written from the spec; a test that asserts the old, wrong behaviour is rewritten, not deleted
- Invent seed data — seed records are deterministic, pinned, documented, and never real customer data
- Build new UI components or custom styling when `docs/guidelines/` mandates existing ones; never bypass the glossary or the i18n mechanism
- Set an FR or UC status to `Implemented` without running the tests and verifying the behaviour in the running app
- Commit, push, or open a PR without the user's approval; never force-push
- Close the issue by hand — the PR's closing keyword closes it on merge

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Load and qualify the issue
- Prepare the branch
- Load project context
- Specification gate (docs first)
- Plan the fix
- Test and data gate (regression tests, seed data)
- Implement the fix
- Verify against the acceptance criteria
- Status and documentation sync
- Code review
- Commit, PR, and issue update
- Quality check

### Step 2: Load and qualify the issue

Load the issue with `gh issue view <n> --comments` and check for linked PRs (`gh pr list --search "<n>"`) — if a fix is already in progress, stop and report it.

Check whether the issue carries the structure the `issue` skill produces: a **Reproduction** with entity and identifiers, a **Root cause** with origin (Spec / Code / Data / External system / Process), a **Why undetected** section (tests, review), **To implement** tasks, and **Acceptance criteria**. If any of these is missing, or the issue is a bare symptom, **run the `issue` skill with the issue number** — it enriches the existing issue, asks about test data and the affected entity, and classifies the finding. Do not continue until you have:

- Type: **Bug** (code deviates from a quoted spec sentence) or **Change Request** (spec gap, contradiction, requirement change, documentation drift)
- Governing UC, FR(s), BR(s) with file references
- The spec finding, the code location, the test gap, and the review or guideline gap
- Test data: entity, identifiers, and the state needed for reproduction
- Acceptance criteria

If the issue is a Change Request with an open stakeholder decision, **use the `AskUserQuestion` tool** (header "Decision"): offer the options from the issue's change proposal (A / B …) with their consequences, plus "Wait for the stakeholder". On "Wait", post a short comment on the issue stating what is blocked and stop.

Mark this todo done.

### Step 3: Prepare the branch

Update the default branch and create the working branch from it. Follow the project's naming convention (from `CLAUDE.md` or the existing remote branches); default: `fix/<n>-<slug>` for a Bug, `feat/<n>-<slug>` for a Change Request, `docs/<n>-<slug>` for documentation drift. If the session already runs on a suitable branch or worktree for this issue, use it.

Mark this todo done.

### Step 4: Load project context

Read, and note as missing where absent:

1. `docs/use_cases/<UC>.md`, `docs/requirements.md`, `docs/use_cases.md`, `docs/entity_model.md` — the governing spec
2. `docs/guidelines/` — `README.md` and the chapters it links; binding for every code change
3. `TESTING.md`, the E2E folder and its README, unit test locations, `docs/test-plans/` — where the regression test belongs
4. The **mock server and seed data**: search for seed scripts, fixture files, faker seeds, SQLite seeds, contract documents (e.g., `mock-server/`, `e2e/fixtures*`, `*seed*`, `metadata.xml`) — where reproduction data lives and how it is pinned
5. `docs/implementation/<UC>*/plan.md` — an existing implementation plan for the governing use case
6. `CLAUDE.md` — project commands (test, lint, typecheck, temporary-marker lint), release-note rules, branch conventions

Mark this todo done.

### Step 5: Specification gate — docs first

Decide for every artifact whether it must change, using the issue's spec finding. Record the decision in a table (artifact, change or "none — reason"); this table goes into the plan (Step 6) and the PR.

| Artifact                          | Question                                                                                                                 | Action when yes                                                                   | Skill           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------- |
| Use case spec (`docs/use_cases/`) | Is a step, alternative flow, or postcondition missing, wrong, or contradicted by behaviour the stakeholder accepted?     | Edit the flow; set UC status to `Revision Required` now, `Implemented` at the end | `use-case-spec` |
| Business rules (BR-XXX)           | Is the rule wrong, contradictory to an FR or another BR, duplicated in ID, or referenced without a resolvable UC prefix? | Correct the rule text; keep the ID; note the superseded wording                   | `use-case-spec` |
| Requirements (FR/NFR/C)           | Is the user story wrong or incomplete? Is the status `Implemented` although the behaviour is broken? Is a new FR needed? | Edit `docs/requirements.md`; broken FR → `In Progress`                            | `requirements`  |
| Entity model                      | Is an attribute, length, value range, or relationship missing that the fix hinges on?                                    | Edit `docs/entity_model.md`                                                       | `entity-model`  |
| Glossary and guidelines           | Did the issue name a missing rule or term under "Why undetected → Guidelines"?                                           | Add the rule or term to `docs/guidelines/` and its compliance checklist           | `guidelines`    |
| Business-process and other docs   | Does a process document, contract snapshot, or CLAUDE.md note contradict the fixed behaviour?                            | Correct it in the same change; remove stale "known deviation" warnings            | —               |

This gate applies to Bugs as well: a Bug fixes code, but if the fixed behaviour is not described in the spec (an edge case, a boundary value, an error path), add the alternative flow — the `use-case-spec` skill forbids leaving observed behaviour undocumented.

When a spec change is more than a wording correction, **use the `AskUserQuestion` tool** (header "Spec") before editing: **Apply as proposed** (Recommended — list the concrete edits in the option description) / **Adjust** / **No spec change** (the user states why; record it). Apply the accepted changes through the named skills.

Mark this todo done.

### Step 6: Plan the fix

The fix is planned in the use case's living implementation plan, so traceability and progress stay in one place:

- **Plan exists** (`docs/implementation/<UC>*/plan.md`): append a section `## Issue #<n> — <title>` with the spec decisions from Step 5, the Missing Pieces rows for this issue (what, related FR/BR, source `Issue #<n>`), an ordered task list, and Open Questions & Risks. Add a Progress Log entry.
- **No plan exists**: run `/ai-implement-use-case <UC>` and let it create the plan; then scope the task list to this issue (other gaps the plan finds stay listed but untouched here).

The task list follows this order and includes the `implement-use-case` closing tasks (i18n completeness, mock & contract parity, platform parity, wiring & error feedback, status sync):

1. Specification and documentation changes (Step 5)
2. Seed data and fixtures (Step 7b)
3. Regression test(s), written to fail first (Step 7a)
4. Code change(s) at the root cause
5. Guideline or checklist rule (from "Why undetected → Review / Guidelines")
6. Closing tasks and status sync

Apply the **Spec Gap Protocol** from `implement-use-case` when something is still undecided: assumption under Open Questions, a pinning test, and a clarification task.

Mark this todo done.

### Step 7: Test and data gate

Everything in this step happens **before** the code change.

**7a. Regression tests** — from the issue's "Why undetected → Tests" and the closing test it names:

- **Unit** (`/ai-vitest`): a test with the issue's exact values — boundary values, the real customizing values, every supported locale — placed next to the module at the root cause. Reference the issue and the BR/FR in the test name or a comment (`// #123, BR-020`).
- **E2E** (`/ai-playwright-test`): a scenario in the governing use case's spec file or in the project's regression spec, using the pinned seed entities and accessibility-first locators.
- **Manual** (`/ai-manual-test`): a `TC-XXX` entry in `docs/test-plans/` when the case is not automatable (device behaviour, real backend, native plugin) — with the identifiers for the retest.
- **Existing tests that pin the wrong behaviour**: rewrite them from the spec. Keep the file, change the assertion, reference the issue.

Run the new tests and record that they **fail for the right reason** (the assertion about the reported case, not a setup error). A test that passes before the fix does not capture the defect — rework it.

**7b. Seed data and fixtures** — reproduction needs the entity state from the issue:

- Check whether the mock seed or fixture set already contains the entity (customer, order, material, configuration …) in the required state — search by the identifiers and the state conditions from the issue.
- If not, add deterministic records: fixed seed, pinned identifiers, values that exercise the case (e.g., the real threshold `149.99`, not a rounded stand-in), anonymised, and documented where the project documents its seed data (`TESTING.md`, E2E README, seed script header).
- Mirror every new or changed field, endpoint, or response in the mock server **and** the contract documentation (contract & mock parity). Do not treat a mock default as proof of real-system behaviour.
- When the case only reproduces against the real backend, record the identifiers and the environment for the manual retest and say so in the plan.

**Use the `AskUserQuestion` tool** in one call (max 3 questions), with recommendations derived from the issue:

1. **Tests** (header "Tests", `multiSelect: true`): unit / E2E / manual test case — pre-select what the issue's "Why undetected" names.
2. **Seed data** (header "Seed data"): extend the mock seed / add a test fixture only / existing data suffices (name it) / real system only (manual retest).
3. **Existing tests** (header "Existing tests", only if tests that pin the wrong behaviour were found): rewrite from the spec (Recommended) / keep and add a new test alongside.

Mark this todo done.

### Step 8: Implement the fix

- Change the code at the root cause; keep the diff as small as the guidelines allow. Reuse inventory components and design tokens; English identifiers; domain terms via the glossary; every user-facing string through i18n with keys in all locales; error feedback on every user action; lifecycle symmetry; no `TODO`/`FIXME` without an issue.
- Close the **review or guideline gap** the issue named: add the rule to `docs/guidelines/` (and its compliance checklist) in the same change. If the gap is in the `code-review` skill's own dimensions, note the proposed check in the PR description — the plugin is changed separately.
- Remove temporary markers or workarounds tied to the issue (e.g., `@temporary` markers referencing it), and stale warnings in docs about the deviation.
- Tick the plan's checkboxes as tasks complete.

Mark this todo done.

### Step 9: Verify against the acceptance criteria

Run the project's checks from `CLAUDE.md`: unit tests, the E2E spec(s) of the governing use case, lint, typecheck, and any marker lint. The regression test(s) from Step 7 now pass. Reproduce the issue's scenario with its test data (probe, mock server, or app) and confirm the fixed behaviour; check the neighbouring cases named in the acceptance criteria (e.g., values just below and above a threshold, other locales, other order types).

Walk through every acceptance criterion and record evidence (test name, command output, screenshot). An unmet criterion sends you back to Step 8. A criterion that cannot be verified locally (real backend, device) stays open and is marked for the manual retest with its identifiers — it is never ticked on assumption.

Mark this todo done.

### Step 10: Status and documentation sync

- `docs/requirements.md`: affected FR statuses — `Implemented` once verified in the running app, otherwise `In Progress` with a note
- `docs/use_cases/<UC>.md`: UC status — `Revision Required` → `Implemented` when the changed flow is verified; `Verified` stays reserved for stakeholder acceptance
- Plan: checkboxes ticked, Progress Log entry, open manual retests listed under Open Questions & Risks
- Release note or changelog entry per the project's release process (PR template, `CHANGELOG.md`)
- Cross-references: business-process docs, contract snapshots, `TESTING.md` seed documentation

Mark this todo done.

### Step 11: Code review

Run the `code-review` skill on the branch. Fix every **Blocker** and **Should fix**; nits at your discretion. Re-run the review until no Blocker remains. Keep the list of dimensions the review checked for the PR description.

Mark this todo done.

### Step 12: Commit, PR, and issue update

**Commit** with the `commit` skill. The message references the issue: `Fixes #<n>` when every acceptance criterion is verified, `Refs #<n>` when a manual retest remains. Split into separate commits when the spec change, the tests, and the code change are large enough to be reviewed independently (`docs:` for the spec, `test:` or `fix:`/`feat:` for the rest) — otherwise one commit.

**Use the `AskUserQuestion` tool** (header "Publish"): **Push and open a PR** (Recommended) / **Push only** / **Stop after the commit**.

**PR**: `gh pr create` with the project's PR template filled in (e.g., a release-note block — "none" for internal changes). The body states the root cause (link to the issue), the spec changes with the status moves, the tests added and what they assert, the seed or fixture changes, the guideline rule added, the review dimensions checked, and any open manual retest with identifiers.

**Issue**: add a comment with the PR link, what was changed at which artifact, and what remains (manual retest against the real system with the record identifiers). Do not close the issue by hand.

Mark this todo done.

### Step 13: Quality check

Verify before finishing:

- [ ] The issue had, or received via the `issue` skill, a classified root cause with governing UC/FR/BR, test data, and acceptance criteria
- [ ] Spec gate decisions are recorded for UC, BR, FR, entity model, glossary/guidelines, and other docs — each as a change or "none — reason"
- [ ] Every spec change was applied through the matching skill and moved the affected status
- [ ] The regression test failed before the fix and passes after; or a manual TC exists with the reason
- [ ] Seed data or fixtures for the reproduction state exist, are deterministic and documented, and the mock mirrors any contract change
- [ ] The code change sits at the root cause and complies with `docs/guidelines/`
- [ ] The guideline or checklist rule named under "Why undetected" was added, or the plugin gap is noted in the PR
- [ ] Every acceptance criterion has evidence or is explicitly left open for a manual retest
- [ ] FR and UC statuses, the plan, and the release note are updated
- [ ] `code-review` ran and no Blocker remains
- [ ] The commit references the issue; push and PR happened only with the user's approval
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing.

## Output

A branch with the specification, seed data, regression tests, code, guideline, and status changes for the issue; the use case's `docs/implementation/<UC>*/plan.md` extended with the issue's section; on approval a pushed branch, a pull request, and a comment on the issue.
