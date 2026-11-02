# Owner-feedback tickets

Source: the owner's responses (income/insurance, testimonials, patient counts, HIPAA, response time, legal name/EIN, board, contact, languages, condition wording, ECFA/Candid, theme).

Rules for every ticket: copy goes through `humanizer`; UI through `impeccable`; logic/components through `angular-developer`; behavior changes are test-first (`mattpocock-skills:tdd`); each ticket ends with its own verification (below). Do not assume. If a fact is missing, stop and ask.

| # | Ticket | Model / effort | Depends on |
|---|--------|----------------|------------|
| 01 | Research HIPAA-compliant form service | Sonnet 5.5 / medium | none |
| 02 | Response time + income/insurance copy | Haiku 5.5 / low | none |
| 03 | Contact, organization identity, board | Sonnet 5.5 / low | none |
| 04 | Minimal first application (request + refer forms) | Sonnet 5.5 / medium | none |
| 05 | Connect form submissions to the secure service | Sonnet 5.5 / high | 01, 04, O-1 |
| 06 | Stories: remove samples, consent empty state | Haiku 5.5 / low | none |
| 07 | Plain-language conditions + respectful wording | Sonnet 5.5 / medium | none |
| 08 | Full Spanish translation | Sonnet 5.5 / medium, one page per pass | 02, 03, 04, 06, 07 |
| 09 | Final verification, both languages | Sonnet 5.5 / low | all |
| O | Owner pre-launch checklist (no code) | n/a | n/a |

Order: 01, 02, 03, 04, 06, 07 can run in parallel. Then 05 and 08. Then 09.

Model rationale: Haiku for mechanical string swaps with a clear spec. Sonnet for anything touching form logic, tone, or translation. No ticket needs Opus. High effort is used only for 05 because it handles PHI and a third-party integration.

Out of scope by owner decision: the six "We ___" values stay as on the mission card; no patient count; no past-care claims; no ECFA/Candid; no testimonials or photos before written consent.
