---
title: "{Product name} — User Guide"
subtitle: "{Use case title} ({UC-ID}) · {Device, e.g. iPad landscape}"
date: "Version: {DD.MM.YYYY}"
lang: "{de-CH}"
---

<!--
  Standard user-guide template (pandoc Markdown → Word).

  Placeholders use {curly braces} — replace all of them. In the metadata
  block above, replace the placeholders but keep the quotes; pandoc reads
  `lang` as a plain string (de-CH, fr-CH, it-CH, en-US, …).
  Translate every heading and boilerplate sentence into the guide language
  (the language end users read). Keep the structure.

  Conversion:
    pandoc {file}.md -o {file}.docx --toc --toc-depth=1 -V lang={de-CH|fr-CH|it-CH|en-US}
  Optional corporate styling once a Word template exists:
    --reference-doc=path/to/corporate-template.docx
-->

# About this guide

This guide shows step by step how to {goal of the use case, phrased for the
end user}. All screenshots were taken on {device} in {orientation}; the red
outline marks the area each step refers to.

**Prerequisites:**

<!-- From the use case's preconditions, phrased for end users.
     Reference other guides instead of UC IDs where possible. -->

- {Prerequisite 1, e.g. "You are signed in to the app (see guide «Signing in»).}
- {Prerequisite 2}

<!-- ─── One section per step of the main success scenario. ───
     Pattern per step:
       1. What to do (imperative: "Tap …", "Open …")
       2. What the user sees / what it means
       3. Optional hint/warning box (from alternative flows or error cases)
       4. Screenshot with caption, fixed width
-->

# Step 1: {Action, e.g. "Open the dashboard"}

{1–3 sentences: what to do and what the screen shows. Explain terms the
first time they appear. No requirement IDs, no internal jargon.}

![{Caption describing what the screenshot shows}]({uc-xxx}/01-{slug}.png){width=16cm}

# Step 2: {Action}

{Instruction text.}

> **Note:** {Optional box for an alternative flow or error case that belongs
> to this step — e.g. what the user sees when data is stale, and what to do
> about it. Include support/error codes here if the app shows them.}

![{Caption}]({uc-xxx}/02-{slug}.png){width=16cm}

<!-- Repeat for every step … -->

<!-- ─── Combined manual (multiple use cases in one document) ───
     Promote each use case to an H1 chapter and demote steps to H2:

       # {Use case 1 title}
       ## Step 1: {Action}
       …
       # {Use case 2 title}
       ## Step 1: {Action}

     Use ONE metadata block for the whole manual, convert with --toc-depth=2,
     and keep screenshots in per-UC folders (uc-002/, uc-003/, …).
-->
