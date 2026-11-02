# Status handoff (updated 2026-11-02, after tickets 01 and 04)

Read this first, then README.md and the ticket you pick up. Do not assume facts; ask the user.

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
