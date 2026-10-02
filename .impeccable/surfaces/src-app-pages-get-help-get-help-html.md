---
version: 1
slug: "src-app-pages-get-help-get-help-html"
primary_target: "src/app/pages/get-help/get-help.html"
related_targets: ["src/app/pages/refer/refer.html"]
---

# Get Help page

## Scope and mode
`/get-help` (and `/es/get-help`). Visitor mode: **Persuade**, written as a practical reference. Inherits the home page's world (DESIGN.md). The Refer page (`/refer`) reuses this layout for referrers.

## Audience, job, action
- People seeking help for themselves, and parents or guardians asking for a child. Many arrive from search on a phone, unsure whether they qualify or what it costs.
- Job: find plain answers (who can ask, cost, what to have ready, privacy, common questions) and start a request.
- Primary action: Ask for help (to the request form at `/ask-for-help`). Secondary: call. Tertiary: refer someone.

## Proof and content
User-approved structure (IA round, 2026-10-01). Facts the ministry hasn't confirmed (eligibility limits, cost policy, response time, insurance, Spanish support) are written as best guesses and each carries a visible "Placeholder" tag, at the user's request.

## Constraints
HIPAA (no trackers on help pages), WCAG 2.2 AA, EN/ES structure, placeholder contact details.

## Approved comp
`.impeccable/mocks/decision/get-help-intake-reference.png` (surface round, card "Intake reference", locked by the user with no steer).

## Direction contract
THESIS: Everything a hesitant applicant needs to decide to ask, set as one calm, scannable reference with the action always in reach. It refuses the hero-image service page and the FAQ wall.
OWN-WORLD: Stoneware ground, iron serif headings, Mulish body, cobalt only for actions and brushstrokes. A sticky jump list of serif links marks the current section with a brushed cobalt stroke; sections in the wide column are divided by iron hairlines; numbered lists use italic serif numerals.
STORY: The visitor sees the promise in one line, finds who can ask, what it costs, what to have ready and how private it is, reads a few honest answers, then asks for help or calls.
FIRST VIEWPORT: Header with Get Help current. Full-width serif headline on one line at desktop, one-line lede beneath. Below: left 22% sticky jump list (five serif links with hairlines, current marked by a brushed stroke), the Ask for help swatch and an italic "Or call" line; right 65% the sections, Who can ask first, then What it costs, then the start of What to have ready with italic numerals.
FORM: Intake reference, rank 6 of 7 on the ranked list, seed key d26b23d2.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
