---
name: code-review
description: >
  Reviews the current changes (working tree, branch diff, or a pull request)
  against the project's binding conventions — language rules and glossary,
  i18n completeness, UI consistency and component reuse, documentation status
  sync — and against recurring defect classes such as dead state, lifecycle
  asymmetry, duplicate event handling, and silent error swallowing. Reports
  verified findings with severity, evidence, and concrete fixes. Use when the
  user asks to "review my changes", "do a code review", "review this PR",
  "check the diff", "review before merge", or wants a pre-merge quality gate.
---

# Code Review

Review the changes specified in $ARGUMENTS (a PR number, a branch name, or — if empty — the current working tree and branch diff against the default branch) against the project's binding conventions and known defect classes. The output is a structured findings report, not code changes.

This skill complements a generic code review: a generic review finds general correctness issues, while this skill enforces the **project-specific rule set** (`docs/guidelines/`, requirements status conventions, glossary) that a generic review cannot know.

## DO NOT

- Change code during the review — report findings; fixes happen after the review, on request
- Report taste-based style opinions that are not backed by `docs/guidelines/`, `CLAUDE.md`, or an official library recommendation
- Report a finding without reading the surrounding code — diff-only reading produces false positives
- Skip loading `docs/guidelines/` silently — if it is missing, say so and recommend creating it with `/ai-guidelines`
- Drown real findings in nits — order by severity and mark nits as such

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Determine review scope
- Load project conventions
- Review changes across all dimensions
- Verify findings
- Report

### Step 2: Determine the review scope

- `$ARGUMENTS` is a PR number → use `gh pr diff <n>` and `gh pr view <n>` for the diff and context
- `$ARGUMENTS` is a branch name → diff that branch against the default branch
- otherwise → uncommitted changes plus the current branch's diff against the default branch

List the changed files. If the branch is behind the default branch, flag it — reviews against a stale base produce misleading results (and broken E2E tests after merge).

Mark this todo done.

### Step 3: Load project conventions

Read these documents; note as missing where absent:

1. `docs/guidelines/` — binding rules: component inventory, standard UI patterns, styling rules, naming & language rules, glossary. Read `docs/guidelines/README.md` and the chapter files it links
2. `docs/requirements.md` and the `docs/use_cases/*.md` files touched by the change — to check status sync and spec conformance
3. `CLAUDE.md` / `TESTING.md` — project-specific conventions and test expectations

Mark this todo done.

### Step 4: Review dimensions

Check the changed code against each dimension. For each finding record: file, line, what is wrong, which rule or defect class it violates, and a concrete fix.

**A. Language & naming**

- Non-English file names, identifiers, CSS classes, or i18n keys
- Domain terms that bypass the glossary or invent new translations
- Booleans without `is`/`has`/`should`/`can` prefix

**B. i18n**

- Hardcoded user-facing strings
- Translation calls with inline fallback texts
- Keys missing in some supported locales; keys added but never used

**C. UI consistency & reuse**

- New components duplicating existing inventory components
- Deviations from the documented standard UI patterns (modals, footers, lists)
- Hardcoded colors/spacing instead of design tokens; semantic colors used as decoration
- Icons or wording that differ from existing views for the same concept

**D. Documentation & status sync**

- Implemented FRs/UCs whose status was not updated — or statuses set to `Implemented` without verification
- Behavior beyond the spec without a spec update (alternative flow) or clarification issue
- Duplicate requirement or use case IDs introduced by the change

**E. Defect classes**

- Dead state: exported hook values, store fields, i18n keys, or tables that nothing consumes
- Lifecycle asymmetry: a `start*`/`open*`/`subscribe` without its `end*`/`close*`/`unsubscribe` on every path, including error paths
- Duplicate event handling: handlers that fire twice on touch devices (click + touch), double increments
- Silent error swallowing: `catch` without user feedback or logging on user actions; destructive recovery without a log signal
- Async operations without error handling

**F. Contract & mock parity**

- New or changed backend endpoints not mirrored in the mock server or contract documentation
- Assumptions about external system behavior (e.g., metadata defaults like `sap:updatable`) treated as verified facts

**G. Hygiene**

- FIXME/TODO without a tracked issue
- Debug artifacts, seed/test files, or personal settings (local paths, personal permissions) in shared configuration
- Tests not updated for changed UI or flows; text-based test selectors that break in other locales

Mark this todo done.

### Step 5: Verify findings

Re-read the surrounding code for each finding and confirm it is real — e.g., a "dead state" export really has no consumer (search the codebase), a "missing locale key" really is absent from the locale files. Drop findings that do not survive verification.

Mark this todo done.

### Step 6: Report

Group findings by severity:

- **Blocker** — violates a binding rule or is a real defect; must be fixed before merge
- **Should fix** — likely defect or convention violation with real cost
- **Nit** — minor; fix when touching the file anyway

For each finding give: `file:line`, the issue, the violated rule (with its source: guidelines chapter, CLAUDE.md, or defect class), and the concrete fix. End with a one-paragraph verdict (ready to merge / needs work) and the list of dimensions checked, so gaps are visible.

Offer two follow-ups, but do not perform them unasked:

1. Apply the fixes
2. Create follow-up issues for out-of-scope findings — each with origin (PR/commit), affected files, UC/FR reference, and acceptance criteria

Mark this todo done.

### Step 7: Quality check

Verify before finishing:

- [ ] Every finding has file, line, violated rule or defect class, and a concrete fix
- [ ] Every finding was verified against the surrounding code, not just the diff
- [ ] Findings are ordered by severity; nits are marked as nits
- [ ] Status sync (dimension D) was checked against `docs/requirements.md`
- [ ] Missing convention documents are reported together with the skill that creates them
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing.
