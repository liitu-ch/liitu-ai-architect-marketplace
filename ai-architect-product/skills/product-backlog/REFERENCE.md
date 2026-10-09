# Scrum and Evidence-Based Management — Reference for the Product Owner skills

Condensed from the Scrum Guide (Schwaber & Sutherland, November 2020), the Evidence-Based Management Guide
(Scrum.org, May 2024) and Scrum.org's Product Owner learning material. Both guides are licensed CC BY-SA 4.0.
This file is the shared vocabulary for `product-vision`, `product-backlog`, and the Scrum-aware parts of the
other AI Architect plugins.

## Empiricism — the three pillars

| Pillar       | Meaning                                                                | Where the pipeline makes it concrete                                            |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Transparency | Process and work are visible to those doing and those receiving it     | Everything is a file under `docs/`: vision, backlog, requirements, specs, plans |
| Inspection   | Artifacts and progress toward goals are inspected frequently           | Status sync, `/ai-code-review`, Sprint Review against the Product Goal          |
| Adaptation   | Deviations outside acceptable limits are corrected as soon as possible | `/ai-issue` feeds findings back; the backlog is re-ordered, the spec is revised |

## From strategy to Sprint — the goal hierarchy

| Level             | Question                                                           | Owner / where                                                 |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Business Strategy | Which guardrails does the organisation set?                        | Organisation; quoted in `docs/vision.md` (constraints, terms) |
| Product Vision    | Why does the product exist, for whom, what value?                  | Product Owner; `docs/vision.md`                               |
| Product Strategy  | How is the vision realised (personas, problems, success, roadmap)? | Product Owner; vision's later goals, scope boundaries         |
| Product Goal      | What is the next measurable step?                                  | Product Owner; `docs/vision.md`, head of `docs/backlog.md`    |
| Sprint Goal       | Why is this Sprint valuable?                                       | Scrum Team; `docs/implementation/UC-XXX/plan.md`              |

The Product Strategy defines the Product Goal; each level is inspected every Sprint and may change as the team
learns. A Product Goal is a hypothesis, not a promise.

## Scrum artifacts and their commitments

| Artifact        | Commitment             | What it answers                                 | Pipeline file                                  |
| --------------- | ---------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Product Backlog | **Product Goal**       | Where is the product going, one goal at a time? | `docs/backlog.md` (goal from `docs/vision.md`) |
| Sprint Backlog  | **Sprint Goal**        | Why is this Sprint valuable?                    | `docs/implementation/UC-XXX/plan.md`           |
| Increment       | **Definition of Done** | When is work usable and part of the product?    | `docs/guidelines/definition-of-done.md`        |

- The **Product Goal** describes a future state of the product that the Scrum Team plans against. It lives in
  the Product Backlog; the rest of the backlog emerges to define _what_ fulfils it. The team fulfils or abandons
  one Product Goal before taking on the next.
- A **Product Backlog item** that can be Done within one Sprint is _ready_ for Sprint Planning. Readiness is
  reached through refinement: breaking down, adding detail (description, order, size), clarifying acceptance.
- The **Definition of Done** is a formal description of the state of the Increment when it meets the quality
  measures required for the product. Work that does not meet it is not part of an Increment and returns to the
  backlog.

## The Product Owner accountability

Accountable for maximising the value of the product resulting from the work of the Scrum Team, and for
effective Product Backlog management:

- developing and explicitly communicating the Product Goal
- creating and clearly communicating Product Backlog items
- ordering Product Backlog items
- ensuring the Product Backlog is transparent, visible and understood

The Product Owner is one person, not a committee; the organisation must respect their decisions. Work may be
delegated, accountability may not. **Scrum orders, it does not prioritise**: the backlog is a single ordered
list, two items never share a rank.

### Myths the skills must not reproduce

| Myth                                      | Reality                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| The PO writes every backlog item          | Writing may be delegated (Developers, stakeholders, Claude); the PO stays accountable   |
| The PO is the team's project manager      | The PO maximises value; scope, dates and task tracking are not the PO's job in Scrum    |
| The PO must be technical                  | The Developers own the _how_; the PO knows what delivers the most value                 |
| The PO only relays what stakeholders want | The PO decides; stakeholders also meet the team directly, at least in the Sprint Review |

### Product Backlog management

Creating, refining, and ordering the backlog: formulate the Product Goal, decide what goes in and what does
not, order, add detail, break down, size. It clarifies the _why_ and _what_; the _how_ emerges in the Sprint.

- **Saying no** — respectfully and transparently: name the current Product Goal, listen to why the request
  matters, decide with data (usage, satisfaction, Current and Unrealized Value), record the reason.
- **Keep it manageable** — a bloated backlog (a long list of random ideas) cannot be ordered, worked through, or
  understood by stakeholders. Review old items with stakeholders; remove what no longer serves a goal.
- **Problems, not solutions** — give the Developers the problem; it uses their expertise and builds ownership.
- **Break down** — large items are ambiguous; smaller valuable slices give at least one Done Increment per
  Sprint and faster feedback.
- **Size** — the Developers size, with the technique they choose: absolute (hours), relative (story points,
  T-shirt sizes), or right sizing (can it be Done within one Sprint? If not, split it).
- **Feedback** — the Sprint Review is where stakeholders inspect the Increment and the backlog is adapted.
- **Visible** — the backlog is accessible to the team and the stakeholders; choose the tool for transparency.

### Ordering factors

Order is a Product Owner decision based on value, risk, dependencies, learning, and cost of delay — never on
effort alone. A useful order puts first what retires the biggest uncertainty about the Product Goal, then what
delivers the most Current Value for the least cost, and keeps items that unblock others ahead of what they
unblock.

### Preferred stances of a Professional Product Owner (Scrum.org)

| Stance                      | Behaviour                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Visionary**               | Communicates vision, strategy and goals; focuses on what could be, not what is                           |
| **Collaborator**            | Works with stakeholders and the team; supports their discovery instead of handing down answers           |
| **Customer Representative** | Makes customer needs, pains and gains understood; explains how work affects users and business processes |
| **Decision Maker**          | Keeps time-to-market short by keeping decision time short                                                |
| **Experimenter**            | Treats features as hypotheses; validates value with small experiments before building everything         |
| **Influencer**              | Shapes strategy with market and user understanding; wins stakeholder buy-in by showing value             |

Anti-patterns to avoid in the skills' output: the **clerk** (writes down whatever stakeholders ask), the **story
writer** (produces items without owning value), the **project manager** (plans scope and dates instead of value),
the **gatekeeper** (becomes the only channel between team and users).

Sources: [Stances of the Product Owner](https://www.scrum.org/resources/blog/stances-product-owner),
[The Professional Product Owner](https://www.scrum.org/resources/the-professional-product-owner),
[9 Ways a Product Owner Can Be More Effective](https://www.scrum.org/learning-series/9-ways-product-owner-can-be-more-effective/),
[Product Vision learning series](https://www.scrum.org/learning-series/product-vision/),
[Product Backlog Management learning series](https://www.scrum.org/learning-series/product-backlog-management/).

## Qualities of a good Product Vision

| Quality                     | Meaning                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| Compelling and aspirational | Makes people want to join; for classic products, focused on the users and their benefit       |
| Aligned and connected       | Fits the business strategy and uses the organisation's own terms                              |
| Transparent and concise     | Accessible to everyone, simply worded, allowed to change                                      |
| Human and relatable         | Connects the product with the people who use it — the common denominator of all audiences     |
| Clear and unambiguous       | Gives guardrails, says what the product does **not** do, and so helps say no to backlog items |

Several representations for different audiences (statement, one-pager, vision board, presentation) are fine as
long as they stay current and connected to `docs/vision.md`.

## Evidence-Based Management (EBM)

EBM helps make better-informed decisions toward goals through intentional experimentation and feedback. It
distinguishes three goal levels and four Key Value Areas.

### Goal levels

| Level                   | Horizon                                | Pipeline equivalent                             |
| ----------------------- | -------------------------------------- | ----------------------------------------------- |
| Strategic Goal          | Mission/vision horizon, uncertain path | Vision statement in `docs/vision.md`            |
| Intermediate Goal       | Months; shows the strategy is working  | Product Goal in `docs/vision.md` / backlog head |
| Immediate Tactical Goal | Weeks; current focus of improvement    | Sprint Goal in the implementation plan          |

### What is measured

Inputs (what is spent), activities (what people do), outputs (what is produced), **outcomes** (what users can
newly do or experience), **impacts** (what the organisation gains when outcomes occur). Measuring activities and
outputs is easy; only outcomes tell whether value was delivered. A Product Goal is formulated as an outcome.

### Key Value Areas and example Key Value Measures

| KVA                           | Question                                        | Example KVMs                                                                          |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Current Value (CV)**        | What value is delivered today?                  | Customer satisfaction, employee satisfaction, usage index, revenue per employee       |
| **Unrealized Value (UV)**     | What additional value could be achieved?        | Satisfaction gap, potential market share, desired customer experience                 |
| **Ability to Innovate (A2I)** | How effective is the organisation at new value? | Innovation rate, defect trends, technical debt, on-product index, change failure rate |
| **Time-to-Market (T2M)**      | How long does it take to deliver new value?     | Lead time, release frequency, time-to-learn, time to restore service                  |

Market value (CV, UV) reflects customer outcomes; organisational capability (A2I, T2M) reflects the ability to
deliver them. A Product Goal's measure should come from CV or UV; A2I/T2M measures explain _why_ progress is
slow or fast and belong in the Sprint Retrospective, not in the Product Goal.

### The experiment loop

Hypothesis → experiment and measure → inspect → adapt (goal or approach). Every backlog item is a hypothesis
about value; the smallest item that tests the hypothesis comes before the full feature.

## Glossary (English → German, as used in the documents)

| English              | Deutsch                                 |
| -------------------- | --------------------------------------- |
| Product Goal         | Produkt-Ziel                            |
| Sprint Goal          | Sprint-Ziel                             |
| Product Backlog item | Product-Backlog-Eintrag                 |
| Definition of Done   | Definition of Done (not translated)     |
| Increment            | Increment (not translated)              |
| Refinement           | Refinement                              |
| Ordering             | Ordnung / Reihenfolge (not «Priorität») |
| Outcome / Output     | Ergebnis / Erzeugnis                    |
| Impact               | Wirkung                                 |
| Current Value        | Aktueller Wert                          |
| Unrealized Value     | Unrealisierter Wert                     |
| Ability to Innovate  | Innovationsfähigkeit                    |
| Time-to-Market       | Markteinführungszeit                    |
| Stakeholders         | Anspruchsgruppen / Stakeholder:innen    |

Core Scrum terms (accountabilities, artifacts, events) stay English in German documents, as the German Scrum
Guide translation does.
