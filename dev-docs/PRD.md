<!-- Last updated: 2026-08-10 -->
<!-- Last change: Reviewed with developer - dropped Debug Folder/Delete Later from cleanup scope, clarified footer contents and D2L exclusion, confirmed JS modularization as first target -->

# Introductory Statistics OER - Product Requirements Document

## Problem Statement

This repo is an open-education Introductory Statistics course (built with a co-author) published to GitHub Pages. Two problems need solving:

1. **Repo hygiene and JavaScript structure.** The site's shared behavior (MathJax setup, theme toggling, search, print-notes, table generation, prev/next navigation) all lives in one 748-line file, `js/loadmathjax.js`, despite its name.
2. **No open license on the published site.** The course is meant to be freely copyable by other instructors, but no page currently states a license. Nothing in the repo blocks copying today; the license text simply needs to exist.

A third, related need exists but is explicitly a later phase (see Out of Scope): making individual lesson pages easy to drop into Brightspace D2L, with page chrome that isn't relevant inside D2L (nav/search/theme toggle/footer) suppressed there while staying intact on GitHub Pages.

## Target Users

- **The two maintainers** (the developer and their co-author), who edit content and JS directly in the repo.
- **Other instructors**, who clone or download the repo to adapt the course for their own classes. They are not expected to run a build step; they read and copy plain HTML/CSS/JS.
- **Students**, who view the published GitHub Pages site.

## Core Requirements

### 1. JavaScript modularization (first priority)

- Split `js/loadmathjax.js` into separate, purpose-named modules. Based on what's currently bundled in it:
  - MathJax config/loading and dark-mode color handling
  - Theme toggle (light/dark/auto)
  - Print-notes (blank replacement, `.inches` spacing, print event handling)
  - Search-in-page (highlight/remove highlights)
  - Table generation from CSV/`<pre>` data (`generateTable`, `generateTableFromPre`, `toggleTable`, `copyToClipboard`, `copyCodeToClipboard`)
  - Prev/next page navigation (already partly separated in `js/navigation.js` and `js/sectionLoader.js`, but overlaps with logic duplicated in `loadmathjax.js` — this duplication should be resolved)
- Use plain ES modules (`<script type="module">`), no bundler or build step. This preserves the current zero-build GitHub Actions deploy (`static.yml`, which uploads the repo as-is) and keeps the source directly copyable by other instructors.
- Every content page currently loads its scripts individually; after modularization, pages should reference the same shared module files rather than duplicating logic inline.

### 2. Repo hygiene

- Remove or relocate content not part of the published course: `MATH1530_STATS_OER.zip`, `test.html`, `structure.txt`.
- Confirm nothing in those paths is linked from `index.html`, `json/pages.json`, or any content page before removal.
- `Debug Folder/` is left alone for now — its original purpose is unclear and it's not worth the risk of deleting something still in use. Revisit later if its purpose becomes clear.
- `Delete Later/` has already been removed by the developer, outside this workflow.

### 3. Open license + navigation footer

- Add a shared footer to every published page on GitHub Pages, holding two things: the CC BY 4.0 license notice/attribution, and page-navigation elements that make sense to centralize there.
- Because there's no build/templating step today, the footer needs a mechanism that keeps ~90+ HTML files in sync without hand-editing each one (see Technical Stack below).
- The existing top nav (Home/About/Print/Search/Theme) is unaffected by this; the license and footer nav live in a new footer section.
- **This footer does not carry over to the future D2L version.** D2L pages are chrome-free by design (see Out of Scope), so the footer is a GitHub-Pages-only element, not something that needs to survive the eventual D2L export.

## Technical Stack

Existing stack (unchanged): static HTML pages, Bootstrap 5 (CDN), MathJax 3 (CDN), vanilla JavaScript, `json/pages.json` as the site's page manifest for prev/next navigation, deployed to GitHub Pages via `actions/upload-pages-artifact` (raw repo upload, no build).

### Stack Decisions

- **No bundler/build step.** Keeps the deploy workflow simple and keeps the repo directly forkable/editable by instructors who won't run `npm install`. Trade-off: the shared footer and shared script `<script>` tags must be added to each HTML file (or injected via a small shared JS snippet), rather than templated at build time.
- **Plain ES modules for JS.** `<script type="module" src="...">` gives real file separation and native imports without adding tooling.
- **Footer delivery: open question for review** — either (a) a shared JS include that injects the footer into a placeholder element on `DOMContentLoaded` (one script tag added to each page, content lives in one place), or (b) hand-inserted static HTML footer copied into each page. Leaning toward (a) since it mirrors how `pages.json`-driven navigation already works, but not decided.

## Scope

### In Scope (v1 — targeting Fall 2026 semester start)

- Split `loadmathjax.js` into ES modules by responsibility; remove duplicated logic between it and `navigation.js`/`sectionLoader.js`. **This is the first thing to build.**
- Add a CC BY 4.0 license + navigation footer, consistently present across all GitHub Pages published pages.
- Remove repo clutter (`MATH1530_STATS_OER.zip`, `test.html`, `structure.txt`) after confirming nothing references them.

### Out of Scope (future phase)

- **D2L/Brightspace export.** Producing stripped-down versions of content pages (chrome-free: no top nav, no theme toggle, no search, no footer) that instructors can paste into or upload as D2L content, while the GitHub Pages version keeps full chrome. Current thinking is a duplicated set of stripped HTML files in their own directory (built from the cleaned-up pages), but the exact mechanism (duplicate files vs. a query-param toggle vs. something else) is undecided and explicitly deferred until after the JS modularization and license/footer work land.
- `Debug Folder/` cleanup — deferred indefinitely until its purpose is known.
- Adding a JS bundler/build pipeline.
- Restructuring `json/pages.json` or the unit/chapter content organization itself.
- New course content (new chapters, new GeoGebra activities).

## Success Criteria

- `loadmathjax.js` no longer exists as a monolith; its responsibilities live in separate, clearly named module files, and there's a single source of truth for prev/next navigation logic (no duplication between modules).
- Every published GitHub Pages page shows a CC BY 4.0 license notice and its navigation footer, editable from one place rather than 90+ separate edits.
- The repo root and unit folders contain only files that are part of the published course or its build/deploy config, aside from the still-unresolved `Debug Folder/`; the stray zip, `test.html`, and `structure.txt` are gone (or relocated outside the deployed tree).
- The GitHub Pages site continues to deploy via the existing no-build `static.yml` workflow with no new tooling required.
