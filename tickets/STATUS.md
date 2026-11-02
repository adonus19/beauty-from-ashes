# Status handoff (updated 2026-11-02)

Read this first, then README.md and the ticket you pick up. Do not assume facts; ask the user.

## Done, verified by the lead session (not committed; all changes are in the working tree)
`npx ng test --watch=false`: 14 files, 47 tests pass. `npx ng build`: passes, 24 routes prerendered.
- 02 response time + insurance FAQ: done. Spec: src/app/core/response-copy.spec.ts
- 03 contact/identity/board: done. Phone + address in, email empty (hidden), EIN empty (hidden), board = Franks/J. Kennedy/Jay Kennedy, no titles. Spec helper: src/app/core/testing/locale-stub.ts
- 06 stories: done. Samples removed, empty state with consent copy.
- 07 conditions/wording: done. New "Conditions we help with" on Get Help, 12 home items, banned-phrase spec src/app/core/wording.spec.ts.
No screenshots/visual checks have been done for any of these. Ticket 09 owns that.
Next step for the user: review `git diff`, then commit (nothing is committed yet).

## Not started
- 01 research HIPAA form service (Sonnet, medium) can start now.
- 04 minimal first application (Sonnet, medium) can start now. Removed-field list APPROVED by the user (2026-11-02); no need to ask again. Ready to run.
- 05 secure submission: blocked on 01, 04, signed BAA.
- 08 Spanish: blocked on 04 (English must be final). es.json is 9 lines vs 1,992 for en.json.
- 09 final verification: last.

## User decisions on earlier questions (2026-11-02)
- Ticket 04 approved, including the removed-field list (O-4 satisfied): drop date of birth, photos, daily life, how long, insurance, how-did-you-hear, free notes.
- Removed: sample volunteer letter (CTA button kept in a bare `.letter` section on the volunteer page; check its layout in ticket 09, the grid is still two-column), About "Leaders" section, contact "Office hours" line, "Sample stories..." known-gaps line.
- Insurance FAQ placeholder flag cleared; "initial requests" wording kept; no change to "Who decides".
- Home story section (permission note + link) approved.
- Pro bono FAQ from ticket 07 is fine as a placeholder for now; owner confirms cost terms (O-5).
- careType dropdowns must match the 12-item conditions list: added to ticket 04.
- After these edits: `ng test` 47/47 pass, `ng build` passes.

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
