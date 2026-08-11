---
title: "{Product name} — Manual"
subtitle: "{App name} version {X.Y} · {Device, e.g. tablet landscape}"
date: "Version: {DD.MM.YYYY}"
lang: "{de-CH}"
---

<!--
  App-manual template (pandoc Markdown → Word).

  Use this template for a FULL APP MANUAL organised by app area / screen
  (feature reference), as opposed to user-guide-template.md, which documents
  ONE use case as a step-by-step guide.

  Structure per app-area chapter:
    1. One overview screenshot of the screen with numbered callouts (1..N)
    2. One subsection per callout explaining that element
  Task-oriented workflows (e.g. "capture an order") get their own chapter
  with sequential steps instead of callouts.

  Placeholders use {curly braces} — replace all of them. In the metadata
  block above, replace the placeholders but keep the quotes; pandoc reads
  `lang` as a plain string (de-CH, fr-CH, it-CH, en-US, …).
  Translate every heading and boilerplate sentence into the manual language
  (the language end users read). Keep the structure.

  Conversion:
    pandoc {file}.md -o {file}.docx --toc --toc-depth=2 -V lang={de-CH|fr-CH|it-CH|en-US}
  Optional corporate styling once a Word template exists:
    --reference-doc=path/to/corporate-template.docx
-->

<!-- ─── Getting started ───
     How the user opens/signs in to the app. Keep credentials OUT of the
     document unless they are intentionally shared (e.g. a device passcode
     policy) — prefer "your personal code" phrasing. -->

# Getting started

To start working with {app name}, {describe how to open and sign in to the
app: which icon to tap, which code or credentials to enter, how to confirm}.

![{Caption: sign-in screen}]({assets-dir}/00-01-{slug}.png){width=16cm}

The app is divided into {N} areas: {list the main areas / tabs / registers}.
The following chapters describe each of them.

<!-- ─── One chapter per app area / screen. ───
     Pattern:
       1. One overview screenshot with numbered callouts (1..N). Add the
          numbers as annotations on the screenshot (or red frames per
          element if numbers are impractical).
       2. A short intro sentence.
       3. One H2 subsection per callout, numbered to match.
     Repeat this chapter for every area of the app. -->

# {Area 1, e.g. "Overview / Dashboard"}

![{Caption: overview of the area with numbered callouts}]({assets-dir}/01-00-overview.png){width=16cm}

{1–2 sentences: what this area is for and when the user opens it.}

## {1. Element name, e.g. "Options"}

{What this element shows or does, phrased for the end user. Explain terms
the first time they appear. Cross-reference other chapters by title
("see chapter {X}"), never by requirement or use case IDs.}

## {2. Element name}

{Explanation.}

> **Note:** {Optional box for a pitfall, edge case, or error state that
> belongs to this element — what the user sees and what to do about it.
> Include support contact or error codes here if the app shows them.}

<!-- Repeat H2 subsections for every callout, then repeat the chapter
     pattern for every app area … -->

<!-- ─── Task-oriented workflow chapters. ───
     For key workflows (e.g. "capture an order") use sequential steps like
     in user-guide-template.md: what to do, what the user sees, screenshot.
     Variants of the workflow (special cases, options) become H2
     subsections after the main flow. -->

# {Workflow chapter, e.g. "Capture an order"}

{1–2 sentences: goal of the workflow and its starting point.}

{Step 1: what to do (imperative: "Tap …", "Open …") and what the screen
shows.}

![{Caption}]({assets-dir}/05-01-{slug}.png){width=16cm}

{Step 2 …}

## {Workflow variant, e.g. "Remove an item"}

{How this variant differs from the main flow; screenshot if the screen
looks different.}

<!-- ─── Optional: special modes ───
     A mode that changes the whole app (e.g. an event/kiosk mode): how to
     enter it, what is different (which areas are unavailable), how to
     leave it. -->

# {Special mode, e.g. "Event mode"} (optional)

{How to enter the mode, what is different, how to leave it.}

<!-- ─── Optional: device & maintenance ───
     Non-app housekeeping the audience must do themselves: reinstall the
     app, OS updates, closing background apps, out-of-office setup. Skip
     this chapter when a central IT team handles devices. -->

# General device notes (optional)

## {Task, e.g. "Reinstall the app"}

{Step-by-step instructions with screenshots. Call out destructive steps
("unsent data will be lost") in a bold **WARNING** before the step.}

<!-- ─── Optional: appendix with reference tables ───
     Code lists, status values, symbol legends — anything users look up
     rather than read. One table per topic, footnotes below the table. -->

# Appendix: {Reference topic, e.g. "Status codes"} (optional)

| {Code / value} | {Meaning} | {Effect / who can set it} |
| -------------- | --------- | ------------------------- |
| {…}            | {…}       | {…}                       |

{Footnotes explaining special rows.}
