---
name: product-backlog
description: >
  Creates or re-orders the Product Backlog (`docs/backlog.md`) as a single
  ordered list of Product Backlog items committed to the Product Goal from
  `docs/vision.md`: derives items from the requirements catalog, use cases,
  and open change requests, assigns a unique order with its value reasoning,
  tracks refinement state (Idea → Refining → Ready → In Sprint → Done), and
  records what is deliberately not done. Use when the user asks to "order the
  backlog", "create a product backlog", "refine the backlog", "what should we
  build next", "Backlog ordnen", "Refinement", "Product Backlog erstellen",
  or when `/ai-issue` produced a Change Request that needs a place in the
  backlog.
---

# Product Backlog

Create or update `docs/backlog.md` for the product in the current project. The backlog is the Product Owner's
ordered, transparent list of everything that is needed to improve the product toward the Product Goal — the
single source of work for the team. This skill proposes order and refinement state from the evidence in the
project's documents; the **Product Owner decides**, and the skill records the decision.

Vocabulary and rules: [REFERENCE.md](REFERENCE.md).

## DO NOT

- Order by effort or by who asked loudest — order follows value toward the Product Goal, risk, dependencies,
  and learning; the reasoning is written next to each item
- Give two items the same rank, or leave the order column empty — a backlog is a list, not a set
- Turn non-functional requirements or constraints into backlog items — they constrain acceptance criteria and the
  Definition of Done and are referenced from the items they apply to
- Mark an item **Ready** without a use case spec with acceptance criteria (`docs/use_cases/UC-XXX.md`, status
  `Approved`) and a size — readiness is earned through refinement, not declared
- Invent value statements, user numbers, or deadlines — quote the vision, the requirement, or the stakeholder
- Create new IDs for items that already have one — backlog items reuse `FR-XXX`, `UC-XXX`, or the GitHub issue
  number; the backlog links, it does not duplicate
- Proceed without `docs/vision.md` containing a Product Goal — stop and point to `/ai-product-vision`
- Write item titles and value statements in a language other than the team's working language; IDs, states, and
  sizes stay in English

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Read the Product Goal and the source artifacts
- Collect candidate items
- Propose order and refinement state
- Decide with the Product Owner (AskUserQuestion)
- Write the backlog
- Quality check

### Step 2: Read the Product Goal and the source artifacts

1. `docs/vision.md` — **required**: Product Goal (sentence, measure, horizon), scope boundaries, later goals. If
   there is no Product Goal, stop: "`docs/vision.md` has no Product Goal. Run `/ai-product-vision` first."
2. `docs/backlog.md` — the current backlog, when it exists: keep existing ranks as the starting point and the
   decision log intact
3. `docs/requirements.md` — FR/NFR/C with status; FRs are the main source of items, NFRs and Cs are constraints
4. `docs/use_cases.md` and `docs/use_cases/UC-XXX.md` — which FRs are specified, their status, acceptance criteria
5. `docs/implementation/*/plan.md` — what is in progress (`In Progress`) or done
6. Open GitHub issues labelled as change requests or enhancements (`gh issue list --state open --limit 100`,
   filter by the project's labels) — candidate items that have no FR yet
7. `TESTING.md`, `docs/guidelines/definition-of-done.md` — the Definition of Done the items must meet

Mark this todo done.

### Step 3: Collect candidate items

One item per unit of value a user or stakeholder can recognise. Sources and their mapping:

| Source                                            | Item ID  | Notes                                                                             |
| ------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| FR in `docs/requirements.md`, status not Verified | `FR-XXX` | Title and user story from the catalog; group FRs that only make sense together    |
| Use case without FR mapping                       | `UC-XXX` | Flag the missing FR as a gap for `/ai-requirements`                               |
| Change Request issue                              | `#<n>`   | Title from the issue; link; mark **Idea** or **Refining** until an FR/UC exists   |
| Later goal in `docs/vision.md`                    | `GOAL-n` | Placeholder item at the end of the list; not refined before the current goal ends |

For each item capture: title, the Product Goal it serves (current goal, later goal, or **none** → candidate for
"Not doing"), the value statement (one sentence, quoting the source), dependencies (other items, external
systems), size when known (`S` / `M` / `L` / `XL`, or the team's story points), current state from the status
columns: `Open` → **Idea** or **Refining**, UC `Approved` with acceptance criteria and size → **Ready**, plan
`In Progress` → **In Sprint**, `Implemented`/`Verified` → **Done**.

Items that serve no Product Goal, are out of the vision's scope, or were rejected go to the **Not doing**
section with the reason — removing them from the list is a decision worth recording.

Mark this todo done.

### Step 4: Propose order and refinement state

Rank every item that is not Done. Apply the ordering factors from [REFERENCE.md](REFERENCE.md) in this sequence
and write the deciding factor into the **Why here** column:

1. **Unblocks others** — items other ranked items depend on
2. **Retires the biggest uncertainty about the Product Goal** — unknown integrations, unproven assumptions
   (prefer the smallest item that tests the hypothesis)
3. **Most Current Value for the Product Goal's measure** — direct contribution to the KVM
4. **Cost of delay** — deadlines, seasons, regulatory dates from the vision's constraints
5. **Learning** — items whose result changes later decisions

Ties are broken by smaller size first. The result is a unique integer rank starting at 1. Items at the top of
the list that are not **Ready** get a refinement note: what is missing (spec, acceptance criteria, size, decision)
and the skill that closes it (`/ai-use-case-spec`, `/ai-requirements`, `/ai-entity-model`, a stakeholder
decision).

Mark this todo done.

### Step 5: Decide with the Product Owner

**Use the `AskUserQuestion` tool** (max 4 questions per call). Present the proposed top ten in the question
text with rank, ID, title, and the deciding factor, then ask:

1. **Top of the backlog** (header "Order"): accept the proposed order / move named items up or down (the user
   names them via "Other") / re-propose with a different leading factor
2. **Not doing** (header "Not doing", `multiSelect: true`): confirm each item proposed for exclusion
3. **Readiness** (header "Ready"): which of the top items should be refined next (one or two) — these get
   refinement tasks
4. **Sizes** (header "Sizes"): accept the proposed sizes / the team sizes them later (sizes stay blank with a
   refinement note)

Repeat with the next block only when the user asks to go deeper; the order below the top ten is a proposal the
PO can change at any time. Record every change the PO makes in the decision log with the date.

Mark this todo done.

### Step 6: Write the backlog

Fill [templates/backlog.md](templates/backlog.md): the Product Goal block copied from `docs/vision.md` (same
wording — the vision is the master), the ordered table, the refinement queue, the Not-doing list, the decision
log, and the links to the source documents. Keep rows short; detail lives in the linked FR, UC, or issue.

Mark this todo done.

### Step 7: Quality check

Verify before finishing:

- [ ] The Product Goal block is identical to the one in `docs/vision.md`
- [ ] Every ranked item has a unique integer rank, a Product Goal reference, a value statement with its source,
      and a deciding factor in **Why here**
- [ ] No NFR or constraint appears as an item; the ones that apply are referenced in the items' notes
- [ ] Every **Ready** item links to a UC spec with status `Approved` and has a size
- [ ] Every item that is not Done and ranks in the top ten has either state **Ready** or a refinement note with
      the closing skill
- [ ] Every Change Request issue in the repository appears either as an item or under Not doing
- [ ] Not-doing entries have a reason; nothing was silently dropped from a previous version
- [ ] The decision log has today's entry naming what the Product Owner changed
- [ ] Titles and value statements are in the team's working language; IDs, states, sizes are English
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing. Then name the next step: refine the top item with `/ai-use-case-spec
UC-XXX`, or plan the first Ready item with `/ai-implement-use-case UC-XXX`.

## Output

`docs/backlog.md`
