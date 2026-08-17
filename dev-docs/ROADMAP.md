<!-- Last updated: 2026-08-10 -->
<!-- Last change: Incorporated sectionLoader.js discovery, container/accessibility constraints, and click-to-cycle theme decision -->

# Introductory Statistics OER - Implementation Roadmap

Generated from: `dev-docs/PRD.md`

## Constraints to keep in mind throughout

These aren't one-off steps, they apply any time a step below touches a page's markup:

- **Keep body content in one wrapping container per page.** Pages currently wrap their main content in a `<section>` (or similar). The developer manually copies that single container into D2L today, so no step should split content across multiple top-level containers or remove the wrapper.
- **Accessibility, checked on whatever page you're already editing:**
  - Heading order must not skip levels (`<h1>` then `<h2>` then `<h3>`, not `<h1>` straight to `<h4>`). Several existing pages already skip levels, fix it on any page you touch.
  - Color contrast should be spot-checked in the browser (light and dark theme) on any page you touch, and kept in mind for how it will look once the page's chrome is stripped for D2L.
  - Images should have a short caption, plus room for a more in-depth description near the image for accessibility. Add both on any page you touch that has images without them.
  - This is a rolling cleanup applied only to pages a step already needs to open and edit, not a dedicated full-site audit in this pass.

## Steps

- [x] **Step 1: Set up the ES module foundation**
  Create a `js/modules/` directory and a single entry point, `js/main.js`, that uses `<script type="module">`. For now `main.js` can just import a placeholder module or two, nothing extracted yet. Wire `index.html` to load `js/main.js` instead of (or alongside) `js/loadmathjax.js`, and confirm the page still behaves exactly as before. This step doesn't move any real logic yet, it just proves the module-loading pattern works with the existing no-build GitHub Pages deploy before any code gets moved into it.

- [x] **Step 2: Extract the MathJax module**
  Move MathJax config, `setMathJaxColorScheme()`, the dark-mode color style injection, and the dynamic MathJax script-loading logic out of `loadmathjax.js` into `js/modules/mathjax.js`. Import it from `main.js`. Verify on `index.html` and one content page (e.g. `2 Unit One Content/Calculating Mean of a Data Set.html`) that math still renders correctly in both light and dark mode.

- [x] **Step 3: Extract the theme toggle module (keep the click-to-cycle version, light/dark only)**
  There are currently two competing theme-toggle implementations in `loadmathjax.js`: a click-to-cycle version (clicking the button cycles light to dark to auto) wired to the `#theme-toggle` button, and a separate dropdown-item version tied to the `<ul class="dropdown-menu">` items in the same button's markup. Keep the click-to-cycle version, but drop "auto" so it only cycles light and dark, and move it into `js/modules/theme.js`. Remove the dropdown-item click handler code, and clean up the now-unused dropdown markup on the theme-toggle button (the `data-bs-toggle="dropdown"` attribute and `<ul class="dropdown-menu">`) in `index.html` so the button is a plain cycle-on-click control with nothing fighting it for the click event. Note: this toggle only themes Bootstrap chrome inside `<nav>` (search bar, dropdown colors) via `data-bs-theme` — it does not control the page's actual dark mode, which follows the OS-level `prefers-color-scheme` media query in `style.css` independently. Making the toggle drive page-wide theming is out of scope for this step. Verify theme switching still works on `index.html`.

- [x] **Step 4: Extract the print-notes module**
  Move `replaceBlanksForPrint()`, `restoreOriginalText()`, `setDivHeightFromData()`, and the `#printNotes` click handler into `js/modules/printNotes.js`. Verify the "Print Lecture Blank Notes" button still blanks out the right elements, triggers the print dialog, and restores original text afterward, on a page that actually has `.blanked` and `.inches` content (check a Lecture Notes page in Unit One or Unit Two).

- [x] **Step 5: Extract the search module**
  Move `searchPage()`, `highlightText()`, and `removeHighlights()` into `js/modules/search.js`. Update: the inline `onsubmit="searchPage(event)"` attribute doesn't work once `searchPage` lives in a module (module scope isn't global), so it was replaced with `id="searchForm"` on all 77 pages that had it, and `search.js`'s `init()` attaches the submit listener via `addEventListener`, matching the pattern used by `theme.js`/`printNotes.js`. Verified searching highlights matches and a second search clears the previous highlights first, on `index.html` and content pages.

- [ ] **Step 6: Extract the table-generation module**
  Move `generateTable()`, `generateTableFromPre()`, `toggleTable()`, `copyToClipboard()`, and `copyCodeToClipboard()` into `js/modules/tables.js`. These are used together on data-heavy pages, so they belong in one module. Verify on a page that uses one of these (search the unit content for `onclick="generateTable` or `toggleTable` to find one) that tables still render from CSV/`<pre>` data and the copy-to-clipboard buttons still work.

- [ ] **Step 7: Consolidate prev/next navigation into one module**
  Prev/next page logic is currently duplicated between `js/navigation.js` and an inline version inside `loadmathjax.js`'s `DOMContentLoaded` handler (the inline version additionally handles GitHub Pages base-URL detection, which the standalone file lacks). Merge these into a single `js/modules/navigation.js` that fetches `json/pages.json`, flattens it once, handles both local and GitHub Pages base URLs, and wires up `#prevPage`/`#nextPage`. Delete the old `js/navigation.js`. This step does not touch `js/sectionLoader.js`, that's handled separately in Step 8 since it serves a different feature (loading multiple pages into one), not prev/next navigation. Verify prev/next buttons work correctly on `index.html`, on the first page of a unit, and on the last page of a unit (to check the disabled-button edge cases).

- [ ] **Step 8: Flatten the dynamically-stitched Lecture Notes pages, then retire sectionLoader.js**
  `js/sectionLoader.js` is actively used by three pages to fetch and stitch together several sub-page `<section>` elements into one long page at load time: `2 Unit One Content/Chapter 2 Lecture Notes.html` (13 sub-pages), `2 Unit One Content/Chapter 3 Lecture Notes.html` (17 sub-pages), and `3 Unit Two Content/Chapter 4 Lecture Notes.html` (6 sub-pages). This dynamic-loading approach is no longer needed. For each of the three pages, manually copy the `<section>` content from each of its listed sub-pages (in the order given in its `sectionPages` array) directly into the Lecture Notes page as static HTML, inserting a page-break divider between each section the way `sectionLoader.js` currently does. Remove the `sectionPages` array and the `<script src="...sectionLoader.js">` reference from all three pages. Once confirmed nothing else references it, delete `js/sectionLoader.js` and the leftover `2 Unit One Content/Section Loader Test.html` test page. Verify all three flattened Lecture Notes pages render correctly, including MathJax and any tables/images from the merged sections. Apply the heading-order and container constraints above while assembling these pages, since you're combining multiple `<h1>`-having pages into sub-sections of one page.

- [ ] **Step 9: Retire loadmathjax.js now that every page loads main.js**
  Update: the `<script type="module" src=".../js/main.js">` tag was already added to all 79 real content pages during Step 4, once we discovered that deleting migrated code from `loadmathjax.js` was silently breaking every page except `index.html` (which is the only one that had main.js at the time). The theme-toggle dropdown markup was also cleaned up site-wide at the same time, matching Step 3's fix on `index.html`. `test.html` and the 16 "MCT"/"Instructor Only Module" pages were left alone, they use a separate D2L template and never referenced `loadmathjax.js`.
  What's left for this step: once Steps 5-8 finish moving everything else (search, tables, navigation, the sectionLoader flattening) out of `loadmathjax.js` into modules, confirm the file is empty of real logic, delete `js/loadmathjax.js` itself, and remove its now-dead `<script src=".../js/loadmathjax.js">` tag from all 80 pages (79 content pages + `index.html`). Apply the accessibility and container constraints above (heading order, image captions) on any page you're already touching for this cleanup.

- [ ] **Step 10: Spot-check verification pass**
  Manually click through one representative page from each section (Start Here, Unit One, Unit Two, Unit Three, plus `index.html`) and confirm MathJax rendering, theme toggle, print-notes, search, table generation, and prev/next navigation all still work. On these same pages, check heading order, spot-check color contrast in both light and dark theme, and confirm images have captions. Fix any regressions or accessibility issues found before moving on to the footer work.

- [ ] **Step 11: Build and prototype the license + navigation footer**
  Write the CC BY 4.0 license notice (with attribution for both authors) and decide what navigation elements belong in the footer per the PRD. Build `js/modules/footer.js`, a small module that injects this footer markup into a placeholder element (e.g. `<div id="site-footer"></div>`) on `DOMContentLoaded`, so the content lives in one file instead of being copy-pasted into 90+ pages. Prototype it on `index.html` only and confirm it renders correctly, links work, sits inside (or clearly after) the page's main content container without breaking it, and doesn't interfere with print-notes styling.

  **User Stories:**
  - As another instructor reusing this course, I want to see a clear CC BY 4.0 license and attribution on every page, so I know I'm allowed to copy and adapt the material.

- [ ] **Step 12: Roll out the footer to all pages**
  Add the footer placeholder div and the `footer.js` script include to every HTML page across the site (same rollout pattern as Step 9). Spot-check a handful of pages across different units to confirm the footer renders consistently and the license link works from every folder depth. Apply the accessibility and container constraints on any page where you notice obvious issues while you're there.

- [ ] **Step 13: Repo hygiene cleanup**
  Confirm that `MATH1530_STATS_OER.zip`, `test.html`, and `structure.txt` are not linked from `index.html`, `json/pages.json`, or any content page (grep for each filename first). Once confirmed unused, delete them from the repo. Leave `Debug Folder/` alone, its purpose is still unknown and it's out of scope for now.
