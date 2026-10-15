---
name: product-vision
description: >
  Creates or sharpens the product vision document (`docs/vision.md`) as the
  Product Owner's starting artifact: a future-state narrative, a one-sentence
  vision statement, the stakeholders and users served, explicit scope
  boundaries, and a measurable Product Goal that bridges the vision and the
  Product Backlog (Scrum Guide 2020, Evidence-Based Management). Use when the
  user asks to "write a product vision", "create a vision document", "define
  the product goal", "Produktvision erstellen", "Zielbild formulieren", starts
  a new product or project, or when `/ai-requirements` reports that
  `docs/vision.md` is missing.
---

# Product Vision

Create or update `docs/vision.md` for the product named in $ARGUMENTS (or the current project). The vision is
the first artifact of the AI Architect pipeline: `/ai-requirements` derives the requirements catalog from it and
`/ai-product-backlog` orders the backlog against the Product Goal it defines.

The Product Owner owns the vision; this skill helps write it down so that it does its job — give direction,
build trust, connect the people involved, and motivate (see [REFERENCE.md](../product-backlog/REFERENCE.md) for
the Scrum and EBM concepts used here).

## DO NOT

- Write the vision as a feature list — it describes a change in the users' world, not screens or functions
- Formulate a Product Goal that is an output ("deliver module X") instead of an outcome a user or the organisation
  experiences, or one without a measure
- Invent users, stakeholders, numbers, or deadlines — ask, or mark them as open questions
- Leave scope implicit — what the product deliberately does **not** do belongs in the document
- Write the vision in a language other than the team's working language; headings and the Product Goal label
  stay in that language too (the file name `docs/vision.md` stays English)
- Exceed one page for the narrative plus statement — a vision nobody reads gives no direction
- Overwrite an existing `docs/vision.md` without reading it first — sharpen what is there, keep decisions that
  stakeholders already approved, and record changes in the document's revision table

## Workflow

### Step 1: Set up progress tracking

Use TodoWrite to create tasks for each remaining step:

- Collect source material
- Interview the Product Owner (AskUserQuestion)
- Draft the vision
- Formulate the Product Goal
- Quality check

### Step 2: Collect source material

Read what exists; note as missing where absent:

1. `docs/vision.md` — an existing vision to sharpen rather than replace
2. Kickoff material, briefs, slide decks, PDFs in `docs/` — source of users, pains, constraints, deadlines
3. `docs/requirements.md`, `docs/use_cases.md` — when they exist already, the vision must explain why they exist
4. `README.md`, `CLAUDE.md` — product name, platforms, organisation, stakeholders
5. `docs/backlog.md` — current Product Goal, if one was set before

Extract: who the users are, what they struggle with today, who pays and who decides, what the product replaces,
hard constraints (platform, regulation, deadline), any numbers already stated (user counts, volumes,
targets), and the organisation's business strategy as far as the material shows it — its guardrails and its
own terms, which the vision reuses so that it stays aligned (see the goal hierarchy in
[REFERENCE.md](../product-backlog/REFERENCE.md)).

Mark this todo done.

### Step 3: Interview the Product Owner

**Use the `AskUserQuestion` tool** (max 4 questions per call; two calls at most). Ground every option in the
material from Step 2 and mark the most plausible one "(Recommended)". Ask only what the material does not
answer:

1. **Users** (header "Users", `multiSelect: true`): the user groups whose day changes with the product
2. **Problem** (header "Problem"): the main pain or unrealised need the product addresses
3. **Difference** (header "Difference"): what the product does differently from the current solution or
   competitors (not "better" — different)
4. **Success** (header "Success"): how the Product Owner will know the product works — a user outcome or
   organisational impact that can be observed (satisfaction, time saved, adoption, revenue, error rate)

Second call, if still open: **Horizon** (first Product Goal in 3/6/12 months), **Out of scope** (what is
deliberately excluded), **Decision maker** (who approves the vision).

Record the answers; they are quoted in the document, not paraphrased into something the PO did not say.

Mark this todo done.

### Step 4: Draft the vision

Fill [templates/vision.md](templates/vision.md). The document has these parts, in this order:

1. **Zukunftsbild / Future state** — three to six short paragraphs, each with its own heading, describing how
   the users' work or life looks once the product exists. Present tense, concrete situations, no feature names.
   One paragraph may address the technical foundation when it is a decisive constraint (platform change,
   end-of-life of the predecessor).
2. **Vision statement** — one sentence in the elevator-pitch form: **For** [users] **who** [need], **the**
   [product] **is a** [category] **that** [key benefit]. **Unlike** [current alternative], **it** [primary
   difference]. Bold the connectors so the structure stays visible.
3. **Product Goal** — see Step 5.
4. **Users and stakeholders** — table: group, what they need from the product, how they are involved (user,
   decision maker, reviewer, operator). Roles from `docs/requirements.md` must appear here when the catalog
   exists.
5. **Scope boundaries** — two lists: what the product covers, what it deliberately does not (with the reason:
   deferred, out of scope, other system).
6. **Constraints that shape the vision** — deadline, platforms, regulation, integration partners; one line each
   with the source.
7. **What the vision is for** — four short paragraphs: Orientierung (direction), Vertrauen (trust), Verbindung
   (connection), Motivation — each stating what this vision gives the people involved. Translate the headings.
8. **Open questions** — anything the PO could not answer; owner and due date where known.
9. **Revision table** — date, change, approved by.

Mark this todo done.

### Step 5: Formulate the Product Goal

The Product Goal is the commitment of the Product Backlog: a future state of the product the Scrum Team plans
against, one at a time. Write it as a block with four fields:

| Field              | Rule                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Product Goal**   | One sentence, outcome-driven: what users or the organisation can do or experience, not what the team delivers |
| **Measure**        | One or two Key Value Measures with the current value and the target value (EBM: Current Value → target)       |
| **Horizon**        | The date or event by which the goal is inspected (release, pilot, season)                                     |
| **Why this first** | The reason this goal precedes others — the largest Unrealized Value, a hard constraint, a risk to retire      |

Checks: aligned with the vision statement; clear and concise; measurable; a shared understanding is possible
without further explanation. The Product Goal is a hypothesis: when the team learns it is wrong, the Product
Owner changes or abandons it and records that in the revision table. If the measure has no current value yet, write "baseline to be measured" and add
an open question with an owner — never invent a number. List the next candidate goals under "Nachfolgende
Ziele / Later goals" without measures; they are refined when the current goal is reached or abandoned.

Mark this todo done.

### Step 6: Quality check

Verify before finishing:

- [ ] The future-state narrative contains no screen names, menu paths, or feature lists
- [ ] The vision statement follows the For/who/the/is a/that/Unlike/it form and fits in one sentence
- [ ] The Product Goal is an outcome, has a measure with current (or "baseline to be measured") and target value,
      a horizon, and a reason
- [ ] Every user group in the statement appears in the users-and-stakeholders table
- [ ] Scope boundaries name at least one deliberate exclusion with its reason, so that a plausible request can
      be answered with a clear «no» by pointing at the vision
- [ ] The vision uses the organisation's own terms and the language of its audience (qualities in
      [REFERENCE.md](../product-backlog/REFERENCE.md))
- [ ] Every number and date has a source (material or PO answer) — none is invented
- [ ] Open questions have an owner
- [ ] The document is in the team's working language; the revision table has today's entry
- [ ] All TodoWrite tasks are marked done

Fix any failing check before finishing. Then tell the user the next step: `/ai-requirements` derives the
requirements catalog from this vision; `/ai-product-backlog` orders the backlog against the Product Goal.

## Output

`docs/vision.md`
