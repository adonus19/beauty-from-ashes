# 01 Research HIPAA-compliant form service
Model: Sonnet 5.5, medium. Skill: `mattpocock-skills:research`.

Why: The owner wants submissions to go to a secure destination, not a normal inbox, and wants storage and transmission verified before launch. The site is statically hosted on GitHub Pages, so a third-party service is needed.

Do: Compare 3–4 services (for example Paubox Forms, Jotform HIPAA, Formstack, Google Workspace with a BAA). For each, from primary sources only: signs a BAA, plan and price required for the BAA, encryption in transit and at rest, data location, retention and deletion, how a static Angular site posts to it, spam protection, whether a nonprofit discount exists.
Output: `docs/research/hipaa-form-service.md` with a recommendation and a launch verification checklist for the owner.
Done when: recommendation is cited; no code changes.
Verify: sources are vendor or HHS pages; every claim has a link.
