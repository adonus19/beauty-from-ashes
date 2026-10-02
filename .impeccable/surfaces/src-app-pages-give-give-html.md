---
version: 1
slug: "src-app-pages-give-give-html"
primary_target: "src/app/pages/give/give.html"
related_targets: []
---

# Give page

## Scope and mode
`/give` (and `/es/give`). Visitor mode: **Persuade**. Inherits the established world (DESIGN.md). Reached from the header's Give swatch on every page.

## Audience, job, action
- Donors: individuals giving once or monthly, and people, families, churches or businesses sponsoring a surgery.
- Job: understand what a gift pays for, trust the ministry with money, and give.
- Primary action: the Give button (Stripe checkout once the account exists; the demo charges nothing). Secondary: sponsor a surgery, other ways to give.

## Proof and content
501(c)(3) status is confirmed. EIN, Stripe, costs, gift amounts, sponsorship cost and the state solicitation disclosure are not; those are marked Placeholder. User steer after the surface round: "As part of the give page I wanted to have the Sponsor a surgery option that was present in one of the comps, and also have a section that has What your gift pays for that was present in another of the comps." Sponsor a surgery comes from give-three-ways.png, What your gift pays for from give-form-beside.png; both join below the first viewport.

## Constraints
No pity appeal or urgency. WCAG 2.2 AA. EN/ES structure. Demo forms send nothing and charge nothing.

## Approved comp
`.impeccable/mocks/decision/give-photo-appeal.png` (surface round card "Photograph appeal", chosen through the structured question after the decision page closed; steer above).

## Direction contract
THESIS: The gift sits under the ministry's own material: a wide ash-glaze photograph opens the page, a calm centered appeal follows, and the giving form is right there. It refuses the charity checkout page with a sad photo and a countdown.
OWN-WORLD: Stoneware ground, the amber and olive glaze photograph (the only place glaze color appears), iron serif, Mulish body, cobalt swatches for actions. Amount choices are inked frames; the chosen amount becomes a brushed cobalt swatch; the chosen frequency carries the brushed link stroke.
STORY: A donor sees the glaze, reads one honest sentence about what gifts cover, chooses once or monthly and an amount, and gives; below, they learn what gifts pay for, how to sponsor a whole surgery, other ways to give and how the ministry is accountable.
FIRST VIEWPORT: Header with Give current (no nav link underlined). A full-width glaze photograph band under the header, about 30% of the frame, fading into the ground. Centered beneath: the serif headline on one line, a two-line lede, the Give once / Give monthly toggle, a row of five inked amount frames with $100 chosen, the large Give $100 swatch, and one small line of 501(c)(3) status.
FORM: Photograph appeal, rank 7 of 7 on the ranked list, seed key 79b72d87.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
