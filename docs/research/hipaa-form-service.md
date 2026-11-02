# HIPAA-compliant form service for Beauty From Ashes

Researched 2026-11-02 for ticket 01. Sources are vendor pages and HHS.gov only. Anything I could not confirm on a primary page is marked **UNVERIFIED**. Prices change; re-check before buying.

## Context
- The site is a static Angular app on GitHub Pages, so a third-party service must receive the submissions.
- The first application collects only: name, phone/email, contact preference, city/state/zip, care category, short description, consents. No photos or records.
- That is still PHI, so a Business Associate Agreement (BAA) is required. HHS says a cloud provider that maintains ePHI for a covered entity is a business associate even if it cannot view the data, and that using one without a BAA is a violation ([HHS cloud computing guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)). I could only read the HHS text through search summaries; direct fetches returned 403, so re-read the page. **Whether the ministry is itself a covered entity or business associate is a legal question I did not research (UNVERIFIED; owner/counsel to confirm, see checklist).**

## Comparison

| | Paubox Forms | Jotform (Gold) | Formstack | Google Workspace (Forms) |
|---|---|---|---|---|
| Signs a BAA | Yes, "every plan includes" one at no extra cost ([pricing](https://www.paubox.com/pricing.md)) | Yes, for eligible customers with HIPAA features enabled ([HIPAA page](https://www.jotform.com/hipaa/), [FAQ](https://www.jotform.com/hipaa/faq/)) | Standard BAA offered, custom BAAs evaluated ([Formstack HIPAA page](https://www.formstack.com/features/hipaa-compliance)) | Yes, accepted electronically in the Admin console ([Google](https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity)) |
| Plan needed | Forms is "included free with every paid plan" (Email Suite Standard/Plus/Premium, Email API Pro, Marketing Pro); "not sold separately" ([pricing](https://www.paubox.com/pricing.md)) | Gold ([FAQ](https://www.jotform.com/hipaa/faq/): "available only with Gold plan"); the HIPAA page says "Gold or Enterprise" | Formstack's help center points to a "Formstack for Healthcare" plan (seen only in a search snippet; the help page itself returned 403). Plan and price **UNVERIFIED** | Google lists Forms under Drive as included functionality ([Google HIPAA list](https://docs.cloud.google.com/security/compliance/hipaa)). Which Workspace plans qualify **UNVERIFIED** |
| Price | Email Suite 1-5 senders: Standard $32/mo annual ($42 monthly); Plus $65; Premium $75 ([pricing](https://www.paubox.com/pricing.md)) | Gold $129/mo or $1,188/yr; $99/mo effective when billed yearly ([pricing](https://www.jotform.com/pricing/)) | **UNVERIFIED** | **UNVERIFIED** (pricing page not read) |
| Nonprofit discount | None listed; contact sales ([pricing](https://www.paubox.com/pricing.md)) | 50% off Bronze/Silver/Gold per pricing page ([pricing](https://www.jotform.com/pricing/)); eligibility rules **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** |
| Encryption in transit / at rest | Says form, answers and attachments "are all protected" ([Forms page](https://www.paubox.com/products/paubox-forms)); no technical detail. **UNVERIFIED** | At rest: "stored in encrypted databases" ([FAQ](https://www.jotform.com/hipaa/faq/)). Transit: only "SSL-compliant" wording ([HIPAA page](https://www.jotform.com/hipaa/)). Details **UNVERIFIED** | Mentions "data encryption" only ([page](https://www.formstack.com/features/hipaa-compliance)). **UNVERIFIED** | **UNVERIFIED** (not on pages read) |
| Data location | **UNVERIFIED** | Not stated; mentions "local data residency centers" ([FAQ](https://www.jotform.com/hipaa/faq/)). **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** |
| Retention / deletion | No period stated; responses "stored in your Paubox Forms account," exportable ([API docs](https://docs.paubox.com/forms)). **UNVERIFIED** | Not addressed on FAQ. **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** |
| Static-site posting | Documented public API (below) | Not confirmed from primary docs. Embed/endpoint method **UNVERIFIED** | **UNVERIFIED** | Forms are normally embedded or linked; no documented custom-POST path read. **UNVERIFIED** |
| Spam protection | Not documented. **UNVERIFIED** | CAPTCHA not mentioned on HIPAA page. **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** |
| Caveats | Bundled with an email subscription | Gold is single-user per pricing page | Conflicting tier info; get it in writing | BAA excludes "Third-party applications including add-ons" ([Google](https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity)) |

Formstack and Google were researched less deeply because their primary pages (help center, pricing) were blocked or silent. They are not ruled out; they are simply less verified.

## Recommendation
**Lead candidate: Paubox Forms**, conditional on the owner checks below. Reasons, all from Paubox's own pages:
- A BAA is included at no extra cost, and Forms is included with any paid plan ([pricing](https://www.paubox.com/pricing.md)).
- It has a documented public API built for custom front ends: `GET https://api.paubox.com/v1/forms/public/form_data/{form_id}` to render and `POST .../api/forms/{form_id}/submissions` to submit, with no API key on the public endpoints ([API docs](https://docs.paubox.com/forms)). That fits an Angular app that owns its own accessible form UI.
- Cost is predictable and the owner may already want secure email, which comes with the same subscription.

**Fallback: Jotform Gold**, if Paubox cannot answer the CORS, spam and retention questions. It has an explicit BAA and a published nonprofit discount, but I could not confirm from Jotform's own pages how a static site posts to it.

Open risk for Paubox: the public submit endpoint is gated only by the form UUID ("The form's UUID acts as access control", [API docs](https://docs.paubox.com/forms)). Spam, CORS and domain allow-listing are not documented, so the owner/vendor must confirm them before ticket 05.

## Estimated annual cost for a small nonprofit
Estimates only; arithmetic is mine from the vendor prices above.
- **Paubox:** Email Suite Standard, annual billing, $32/mo = **$384/yr** for 1 sender. The pricing page says both "1-5 senders" and "5-sender minimum", so whether one sender is allowed or 5 senders are billed is **UNVERIFIED**. Monthly billing is about 30% more. Nonprofit pricing: ask sales.
- **Jotform Gold:** $99/mo billed yearly = **$1,188/yr**; with the listed 50% nonprofit discount about **$594/yr** if the ministry qualifies (**UNVERIFIED**).
- **Formstack, Google Workspace:** not estimated; prices not verified.

## How a static site posts to the service (Paubox)
1. The Angular form is built and styled in the app (full control over accessibility and bilingual copy).
2. On submit, the browser calls `POST https://api.paubox.com/v1/forms/api/forms/{form_id}/submissions` with the field values (attachments, if ever added, go as base64 `attachments` objects; 250 MB cap). Exact path and body shape come from [docs.paubox.com/forms](https://docs.paubox.com/forms); confirm against the live docs when building ticket 05.
3. A form created through the API is inactive until activated; the public endpoint returns 404 until then ([API docs](https://docs.paubox.com/forms)).
4. No secret key is needed in the browser for public endpoints, so none should be shipped in the bundle. Management keys (Bearer, `forms` scope) must never go in the site.
5. **UNVERIFIED:** CORS from the production origin, rate limits, CAPTCHA/honeypot options, and the response/error format. Without browser CORS support, a small server-side proxy would be needed, and GitHub Pages cannot host one.
6. The GitHub Pages demo must not send real submissions (PRODUCT.md); keep the demo pointed at a stub.

## Owner verification checklist (O-1)
Get answers in writing from the chosen vendor, and keep the signed BAA on file.
- [ ] Signed BAA executed, naming the ministry and covering the specific product and plan being purchased (not only the email product).
- [ ] Confirm with counsel or HHS guidance whether the ministry is a covered entity or business associate, and who signs on whose behalf.
- [ ] Encryption in transit (TLS version) and at rest, stated by the vendor.
- [ ] Data location (country/region) and subprocessors.
- [ ] Retention period, how to delete a submission, and what happens on cancellation.
- [ ] Who at the ministry can view submissions; per-user logins, MFA, audit log of access.
- [ ] Notification route for new submissions: it must not put PHI in a normal email; confirm notifications are secure or contain no PHI.
- [ ] CORS allows the production domain; domain allow-listing if available.
- [ ] Spam/bot protection that works without tracking cookies or ad pixels.
- [ ] Nonprofit discount: ask sales for the written price.
- [ ] Test submission from the live site, then confirm it appears only in the vendor portal and nowhere else (no analytics, no console/network logging of field values).
- [ ] Breach-notification terms in the BAA and a named vendor contact.
- [ ] Re-check this document's UNVERIFIED items against the live vendor pages.

## Sources read
- [Paubox pricing](https://www.paubox.com/pricing.md), [Paubox Forms](https://www.paubox.com/products/paubox-forms), [Paubox Forms API](https://docs.paubox.com/forms)
- [Jotform HIPAA](https://www.jotform.com/hipaa/), [Jotform HIPAA FAQ](https://www.jotform.com/hipaa/faq/), [Jotform pricing](https://www.jotform.com/pricing/)
- [Formstack HIPAA page](https://www.formstack.com/features/hipaa-compliance)
- [Google HIPAA included functionality](https://docs.cloud.google.com/security/compliance/hipaa), [Google Workspace HIPAA article](https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity)
- [HHS cloud computing guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) (fetch blocked; read via search summary)
