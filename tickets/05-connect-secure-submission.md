# 05 Connect submissions to the secure service
Model: Sonnet 5.5, high. Skills: `angular-developer`, `mattpocock-skills:tdd`.
Blocked until: 01 recommendation is chosen, 04 is merged, and the owner has a signed BAA (O-1).

Do: replace the demo "discard" submit with a real post to the chosen service via an injectable submission service (interface plus implementation, so tests use a fake). Handle loading, success, failure with retry, and no PHI in the URL, console, analytics or local storage. Remove the demo notice strings.
Test first: submission service fake, success and failure paths, no fields leak into logs.
Verify: `ng test`, `ng build`, one test submission end to end in the service's sandbox, then the owner's storage and transmission verification checklist from 01.
