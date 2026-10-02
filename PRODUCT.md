# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular (user-pinned; scaffold with the Angular CLI, pre-rendered static output for search visibility).
Demo and review: the user's GitHub Pages account. Production: a different static host chosen after the site is approved (recommendation pending user decision; see Capabilities and Constraints).

## Users

Ranked by priority, as confirmed by the user:

1. **People seeking help.** Adults, and parents or guardians of children, living with conditions that affect appearance or quality of life: trauma and accident injuries, congenital conditions, scars and burns, cancer-related reconstruction, deformity correction and restorative care, and other reconstructive needs. Many cannot afford care. They may arrive hesitant or ashamed, often on a phone, may live with disabilities, and may read Spanish first. Their job: understand whether this ministry can help them and ask for help without fear.
2. **People referring someone.** Pastors, physicians, social workers, family and friends. Their job: understand who qualifies and pass someone's name along with confidence.
3. **Medical professionals.** Surgeons, anesthesiologists, nurses and other clinicians who might give their skills. Their job: see a serious, well-run ministry worth joining.
4. **Partners.** Churches, businesses and organizations. Their job: find a concrete way to partner.
5. **Donors.** Individuals giving once or monthly, or sponsoring a surgery. Their job: trust the ministry with money.

## Product Purpose

Beauty From Ashes Surgical Ministry is a Christian nonprofit (approved 501(c)(3)) that provides restorative and reconstructive plastic surgery, free or at reduced cost, to people whose need exceeds their means. The website must give the ministry visibility, make it easy and safe for people to ask for help or refer someone, and recruit medical professionals, partners and donors.

Success: people who need help find the ministry and submit a request; referrers send people; clinicians, partners and donors join.

## Positioning

Surgical skill offered as ministry. Care is restorative, not cosmetic; it is free or reduced-cost; it is open to everyone regardless of faith; children are treated; prayer is offered to anyone who welcomes it and never required; and the ministry stays with patients long after surgery ends. Serves the Charlotte, NC and Fort Mill, SC area.

## Operating Context

- Requests for assistance and referrals arrive through website forms and go to a dedicated ministry inbox (address not yet provided). The process shown to applicants: submit a request or referral, initial review, conversation, decision, care and support (from the founder's prototype; confirm before launch).
- Applicants must be able to upload photos of their condition.
- For minors, a parent or guardian completes the request.
- Staff (non-developers) must be able to update content after launch, including patient stories and news.
- Donations through Stripe; the account is created after the site is approved.

## Capabilities and Constraints

- **HIPAA applies.** Request and referral submissions (including photos) are protected health information. They must go to a HIPAA-compliant service that signs a Business Associate Agreement, never plain email. The user will confirm compliance details later; the build must be ready for it. The GitHub Pages demo must not transmit real submissions.
- **No tracking on health pages.** No ad pixels or retargeting tags on request or referral pages.
- **Separation from the practice.** The ministry is legally and publicly separate from WDF Aesthetic Plastic Surgery. Do not link to WDF. Dr. W. Dale Franks, Jr., MD may appear only as contact information.
- **Languages.** English and Spanish. More languages may be added later; the architecture must allow it. The bilingual structure and language switch ship in the demo; Spanish copy is translated after the English copy is approved, then reviewed by a native speaker (the Spanish mission text needs the founder's approval).
- **Accessibility.** Full ADA compliance; people with disabilities will use this site (see Accessibility & Inclusion).
- **Staff-editable content.** A content system staff can use without a developer.
- **Hosting.** GitHub Pages for demo; production host and domain to be chosen (no domain owned yet).
- **Undecided or pending facts:** inbox address; response-time promise; income requirements (unknown); board and staff; EIN and legal name for the donate page; Stripe account; real contact details (use placeholders); production host and domain; HIPAA form vendor.

## Brand Commitments

- **Name:** Beauty From Ashes Surgical Ministry. Namesake: Isaiah 61:3. Scripture quotations use NKJV.
- **Mission card text is the main copy and is used verbatim** (source: `docs/reference/mission-card.jpg`). All other copy takes its voice from it:
  - Our Mission: "To glorify God by serving every patient with Christlike compassion and surgical excellence, fostering healing that reaches beyond the physical and opens the way for spiritual transformation."
  - Our Vision: "To inspire a community of gifted professionals to use what God has entrusted to them to serve others, bless those in need, and strengthen their communities."
  - Our Core Values: "We believe every person is created in the image of God, and that faithful stewardship, compassionate service, and excellence honor Him and inspire those around us."
  - Therefore:
    - We Listen. We give every patient the time their story deserves.
    - We Protect. We hold patient safety as our highest surgical standard.
    - We Pray. We pray with every patient who welcomes it.
    - We Accompany. We walk with every patient long after surgery ends.
    - We Honor. We honor the sacrifice behind every patient's decision.
    - We Serve. We extend surgical care where need exceeds means.
  - Closing mark: Soli Deo Gloria.
- **Faith is stated openly; care is open to everyone.**
- **Visual preference:** the founder likes the navy, gold and warm ivory of his ChatGPT prototype (`docs/reference/chatgpt-prototype.png`). The feel matters more than exact values: warm, dignified, hopeful, professional. The prototype is inspiration only; the user wants an original design that stands out.
- **Must never feel like:** a cosmetic surgery ad (glossy, aspirational, before/after spectacle); a church bulletin (clip-art crosses, sunsets, devotional styling that hides the medical seriousness); a pity appeal (sad faces, urgency to push donations); or a cold hospital system (clinical, corporate, impersonal). Confirmed by the user.
- **Prototype copy is placeholder.** "Restoring More Than What Can Be Seen" and "Seen. Valued. Never Forgotten." may be rewritten.
- **Logo:** none exists. Use a placeholder; a real logo will be designed later.

## Evidence on Hand

- Mission card: `docs/reference/mission-card.jpg`.
- Founder's prototype: `docs/reference/chatgpt-prototype.png` (sitemap, palette, process steps, form fields; its imagery and copy are placeholders).
- The ministry has performed surgeries; no count is available. Do not state a number.
- No patient stories or testimonials yet; the site must have a stories section ready for them. Never invent a patient story or present a sample as real. For the demo, the user approved written sample stories, each visibly labeled "Sample story, not a real patient"; they are replaced with real, consented stories before launch.
- No photos yet; real photos are coming. Layouts must accept them without depending on stock.
- No logo, no board list, no EIN on hand, no real contact details.

## Product Principles

1. **People before conditions.** Describe people first and conditions second. Never treat appearance as spectacle or pity.
2. **Lower every barrier to asking.** Plain language, mobile-first, Spanish, accessible to everyone, open to every faith, and always clear about what happens next.
3. **Faith stated plainly, never as a condition of care.**
4. **Only true claims.** No invented numbers, stories or credentials. The mission card's commitments carry the weight until real stories exist.
5. **Privacy is part of care.** Health information is handled under HIPAA, and nothing on the site watches people while they ask for help.

## Accessibility & Inclusion

- WCAG 2.2 AA at minimum, verified with keyboard-only use, screen readers (VoiceOver, NVDA), 200% text resize and 400% reflow, reduced motion and forced-colors/high-contrast modes.
- Users include people with visual, motor, cognitive and hearing disabilities, older adults, and people on phones with weak connections.
- Forms: labeled fields, clear errors, no time limits, accessible photo upload, and a parent/guardian path for minors.
- No accessibility overlay widgets; accessibility is built into the code.
- English and Spanish, with a language switch available on every page.
