# Status handoff (updated 2026-11-02, after 01, 04, 05A and full English verification)

Read this first, then README.md and the ticket you pick up. Do not assume facts; ask the user.

## Layout polish pass (impeccable) DONE, uncommitted (85 tests, build, axe/overflow/menu/motion clean)
- About board underline bug: cause was the shared `.role:nth-child(n+3)` row hairline; Jay wrapped to row 2 column 1 so his top border sat under Dr. Franks. Board is now a stacked list (`.board__list`, `.board__name` in src/styles/_audience.scss), same hairline under each name. Volunteers/faith sections tightened (`split--brief`). Values list has hairlines at 375.
- New `split--wide` layout (title + lede on one row, list full width in 3-4 columns) on volunteer roles/other-ways/ask, partner kit/churches/businesses, give pays-for/other-ways; home conditions list is 3 across; Sponsor band is one short row; Send button no longer stretches; Accessibility "Known gaps" uses text-wrap: balance; footer about block takes its own row.
- Left as is: Get Help FAQ/privacy left column (sticky jump nav + CTA), volunteer "How to join" steps (empty left column at 1280), 5-item lists leave one empty cell in row 2 at 1280.
- Board shows names only. "Founder and Medical Director" for Dr. Franks is NOT displayed: it is not in en.json, owner confirmation pending (owner email item 6). Ask the user whether to add it.
- Look at es routes again after ticket 08.

## Latest (uncommitted; 85 tests pass, build passes, axe 0 violations on 14 routes)
User decisions: volunteer bare button removed (HTML comment in volunteer.html marks where volunteer testimony goes once written permission exists); footer/contact address is now a Google Maps link (`site.contact.addressMapHref`; web pages cannot open the OS default map app everywhere); other forms (Volunteer, Partner, Contact, Give) wait; remaining placeholders are fine for now.
Fixed during verification: (1) GitHub Pages base-path build 404'd on /media/*.webp because of critical-CSS inlining; fixed with `inlineCritical: false` in angular.json production config (check page speed later; unmeasured). (2) Escape in the mobile menu dropped focus to body. (3) Mobile menu now cycles Tab/Shift+Tab inside itself; after navigation focus moves to `#main` (App) when it was on body. (4) Footer columns rebalanced; address 4 lines; headings align at 1280.
English verification is COMPLETE: keyboard-only walkthrough, base-path build served under /beauty-from-ashes/ (14 routes 200, no broken assets), rendered pages have no mailto/EIN when empty and show them when set, screenshots of all 14 routes at 375 and 1280 reviewed (es routes show English + notice, review again after ticket 08). Not testable here: the map link on real phones.
Visual notes, NOT fixed, for a later impeccable pass if the user wants: home and get-help have an empty left half beside long lists at 1280; volunteer has sparse left columns at 1280 and its hero stacks two buttons with odd spacing at 375; partner/give: "A kit for churches" and the dark "Sponsor a surgery" band have large empty areas, Send button wider than the form column with brush edge offset; about: board names are three loose items with "Jay Kennedy" orphaned on a second row at 1280, "Volunteers" is one line, values list has no structure at 375; accessibility "Known gaps" has an orphan line; footer About column has tall empty area at 1280.
Still to do: tickets 05B (connect Paubox, blocked), 08 (Spanish, on hold until all English copy is final), then re-run ticket 09 for /es.

## Done since last update (uncommitted; commit after review)
- 05 PART A (vendor-neutral submission layer): done. src/app/core/submission/ (service, http impl, payload-format.ts field map, form-submission state machine, submit-status). Ask for Help and Refer use it. Endpoint is `SUBMISSION_ENDPOINT` in app.config.ts, empty = demo mode (demo notice stays, nothing is sent); must be https. Lead check: 76 tests pass, build passes.
  - TO CONNECT PAUBOX (part B, blocked on signed BAA + vendor answers): set the endpoint; edit only payload-format.ts (Paubox POST shape is UNVERIFIED; check docs.paubox.com/forms); confirm CORS from the production origin. GitHub Pages cannot host a proxy; if CORS is unsupported, hosting or a proxy decision is needed (raise with the user).
  - Possible double screen-reader announcement on "sent" (heading focus + live region). One-line fix: drop the live message for "sent". Decide during ticket 09 with a screen reader test.
  - Volunteer, Partner, Contact and Give forms are still demo-only and do not use this layer. They need a destination decision (they are not PHI, but still personal data). ASK THE USER.
  - .impeccable/build/submit-states.mjs needs a build with a fake https endpoint and an intercepting server; it crashes against the normal demo build (expected).
- Interim 09 (English only): ng test/build pass; axe 0 violations on 14 routes at 1440 and 390; forms/overflow/menu/motion checks clean; 200% zoom and 400% reflow no overflow on home and ask-for-help; no "Sample", "to come", "example.org", "555", "10 business" left. Not done: keyboard walkthrough, base-href build test, rendered check that empty-email mailto links are hidden, review of get-help/refer/contact/give/stories/privacy screenshots (scratchpad has m-<page>.png at 375 and d-<page>.png at 1280).
- Visual problems found (not fixed; use impeccable): (1) volunteer: bare "Volunteer your skills" button alone in a 2-column grid between rules, duplicate of hero and form buttons: drop it or fix it; (2) volunteer: three Placeholder tags in a row; (3) about: Board names look orphaned in a 2-col grid, Volunteers is one line, "What we believe" is just "will appear here" + tag; (4) home: story section sparse; (5) footer: address column ~130px wide, wraps to 5 lines; (6) home 12-item conditions list: uneven row heights, "Something else" makes 13 cells; (7) ask-for-help is ~6,500px tall at 320px.
- 35 `placeholder: true` remain in en.json: getHelp cost.paragraphs[0], privacy.paragraphs[0], questions.items[1,5,6,7,8]; refer when.items[2], ask.paragraphs[1], next.items[0,2], partners.paragraphs[0]; volunteer ask.items[0-3], ask.paragraphs[0-2]; partner churches.items[1,4], businesses.items[1,3]; about faith, accountability.items[1,2]; privacy sections[0].p[1], [2].p[0], [4].p[0]; give sponsor, other.items[0,1,2,4], trust.items[1]. Owner decides which to keep (owner email item 9).
- Draft email to the owner: tickets/EMAIL-TO-OWNER.md (includes the Paubox question list). OWNER-OPEN-ITEMS.md is the same list in checklist form.

## Done, verified by the lead session
(Earlier tickets 02, 03, 06, 07 are committed. Tickets 01 and 04 below are in the working tree, NOT committed. Review `git diff`, then commit.)
- 01 research: docs/research/hipaa-form-service.md. Recommends Paubox Forms (BAA on all plans; ~\$384/yr Email Suite Standard by the agent's arithmetic), fallback Jotform Gold (\$1,188/yr, ~\$594 with nonprofit discount). Lead session has NOT independently verified the costs or sources; many items are marked unverified in the doc (Paubox CORS/spam/retention/nonprofit pricing; Formstack and Google Workspace pricing; HHS pages read via summaries).
- 04 minimal first application: done. Ask for Help and Refer trimmed to the approved fields; careType dropdowns = home.conditions + "Other / not sure" (src/app/core/forms/care-type-options.ts); "photos and records later, securely" copy added in forms, process step, Get Help, privacy notice. The Ask form's "A little more" section was renamed "Prayer". Lead check: 55 tests pass, build passes, mobile screenshot of Ask form looks right (demo notice still shown; ticket 05 removes it). Agent ran form-check/forms-check/refer-check and axe on both forms: clean.
- Lead fix after 04: the volunteer page's leftover `.letter` section was a `<section aria-label>` that tripped axe `landmark-unique`; it is now a plain `<div>`. Not re-run through axe yet (ticket 09).
`npx ng test --watch=false`: 14 files, 47 tests pass. `npx ng build`: passes, 24 routes prerendered.
- 02 response time + insurance FAQ: done. Spec: src/app/core/response-copy.spec.ts
- 03 contact/identity/board: done. Phone + address in, email empty (hidden), EIN empty (hidden), board = Franks/J. Kennedy/Jay Kennedy, no titles. Spec helper: src/app/core/testing/locale-stub.ts
- 06 stories: done. Samples removed, empty state with consent copy.
- 07 conditions/wording: done. New "Conditions we help with" on Get Help, 12 home items, banned-phrase spec src/app/core/wording.spec.ts.
No screenshots/visual checks have been done for any of these. Ticket 09 owns that.
Next step for the user: review `git diff`, then commit (nothing is committed yet).

## Not started
- 05 secure submission: 01 and 04 are done. Still blocked on the user/owner choosing a service and a signed BAA (see Open for 05). Do not start until the user picks a service.
- 08 Spanish: unblocked by 04, but wait until English copy is final (ticket 05 removes the demo notice and adds submit states; do 08 after 05's strings, or translate 05's strings as part of it). Ask the user which order. es.json is 9 lines vs 1,992 for en.json.
- 09 final verification: last.

## User decisions on earlier questions (2026-11-02)
- Ticket 04 approved, including the removed-field list (O-4 satisfied): drop date of birth, photos, daily life, how long, insurance, how-did-you-hear, free notes.
- Removed: sample volunteer letter (CTA button kept in a bare `.letter` section on the volunteer page; check its layout in ticket 09, the grid is still two-column), About "Leaders" section, contact "Office hours" line, "Sample stories..." known-gaps line.
- Insurance FAQ placeholder flag cleared; "initial requests" wording kept; no change to "Who decides".
- Home story section (permission note + link) approved.
- Pro bono FAQ from ticket 07 is fine as a placeholder for now; owner confirms cost terms (O-5).
- careType dropdowns must match the 12-item conditions list: added to ticket 04.
- After these edits: `ng test` 47/47 pass, `ng build` passes.

## Open for 05 (user answers 2026-11-02)
- Service: Paubox Forms approved by the user.
- Ministry already has a secure email, so no Email Suite purchase for email. BUT Paubox Forms is bundled only with a paid Paubox plan (per the research doc, unverified): ask the user which provider the ministry's existing secure email uses. If not Paubox, a plan may still be needed for Forms.
- Covered entity vs business associate: user believes so, will confirm. OPEN.
- Paubox sales questions (CORS, spam, retention, nonprofit pricing): the user asked whether we can handle this for the owner. Answer given: we can draft the questions; the owner/an officer must send them as the account holder and sign the BAA. OPEN.
- All owner-facing items are collected in tickets/OWNER-OPEN-ITEMS.md (send-ready, plain language). Keep it updated.
- Records (RESOLVED 2026-11-02): records are optional; the ministry will ask for them later if the person has them because they help, but they are never required. Copy updated in en.json (form notes, FAQ). Photos/records "later, through a secure system" wording elsewhere is unchanged and consistent.
- Existing-email provider: user will confirm with the owner; it is item 4 in OWNER-OPEN-ITEMS.md. OPEN.

## Still open
- Many other `placeholder: true` flags remain in en.json (volunteer roles, partner, give amounts, accountability, statement of faith "will appear here", etc.). Not owner-answered; ask the user which to resolve or hide before launch. Ticket 09's leftover grep should list them.
- Ticket 07 specs were written before copy but never run red (minor).

## Owner review (O-5) from ticket 07
New: Facial differences and reconstruction; Cleft lip and cleft-related surgery; Skin lesions or growths; Abdominal wall and body changes; Revision after previous surgery.
Reworded: Scar repair and revision; Birth defects and congenital differences; Breast reconstruction or deformity; Children with congenital or acquired differences. Removed: "Restorative care: Correcting physical differences".

## Working notes for the next agent
- Decisions are final: no patient count; no past-care claims; no ECFA/Candid; no testimonials/photos without written consent; no email or EIN shown until supplied; six mission-card "We ___" values unchanged; response time "We generally respond to initial requests within 5–7 business days."
- Skills per ticket: humanizer (copy), impeccable (UI), angular-developer (code), mattpocock-skills:tdd (red first, actually run red). mattpocock grill-with-docs, to-tickets and /verify are not installed; ticket 09 defines verification.
- Test runner is vitest: no Jasmine `.withContext()`.
- When running parallel agents, they share one tree; en.json is edited by all. Use small Edit calls, never rewrite the file.
- Model/effort per ticket is in README.md. Tickets 01, 04 can run in parallel.
