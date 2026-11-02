# 03 Contact, organization identity, board
Model: Sonnet 5.5, low. Skills: `humanizer`, `impeccable` (layout only), `angular-developer`.

Do:
- `site.contact` in `en.json`: phone 980-237-6958 (`tel:+19802376958`), address "Beauty From Ashes Surgical Ministry, c/o WDF Aesthetic Plastic Surgery, 1366 Broadcloth Street, Suite 101, Fort Mill, SC 29715".
- Email: do not display any address (footer, contact page, document pages currently render `mailto:`). Make the email render conditional on a value being set, so adding a dedicated address later is a one-line content change.
- Form placeholder phone examples "(704) 555-0100" become a neutral example format.
- EIN: hide the "EIN: to come." line until a value exists. Same conditional approach. Legal name stays "Beauty From Ashes Surgical Ministry" and is marked for owner verification (O-2).
- About page: Board of Directors lists Dr. W. Dale Franks, Jr. (Founder and Medical Director, confirm display name in O-3), Jessica Kennedy, Jay Kennedy, with no titles. Add a separate short "Volunteers" group described in general terms, with no names and no staff section.
- Remove `placeholder` flags and `PlaceholderTag` use where the content is now real.
Test first: component specs that the footer/contact render phone and address, do not render a mailto or EIN when unset, and render them when set.
Verify: `ng test`, `ng build`, screenshots of footer, contact, about at 375px and 1280px.
