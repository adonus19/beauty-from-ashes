# 04 Minimal first application (request and refer forms)
Model: Sonnet 5.5, medium. Skills: `angular-developer`, `mattpocock-skills:tdd`, `impeccable`, `humanizer`.

Why: The first application should collect only what is needed to decide whether the ministry may be able to help. Records, photos and detailed medical information come later through a HIPAA-compliant system.

Current `ask-for-help` model collects: date of birth, daily-life impact, how long, photos (required, up to 6), insurance, prayer, notes, and more.
Proposed keep: who it is for, name, guardian details when a child, phone, email, preferred contact method and safe-to-message, language, city/state/zip, care type (category), a short description in the person's words, consent to contact, consent of authority, optional prayer request.
Proposed remove: date of birth, photo upload and its validation, "daily life", "how long", insurance question, "how did you hear" and free notes (list approved by the user 2026-11-02).
Do: update model, validators, template, content strings, error strings, and the same trimming on `refer`. Add copy saying photos and records are requested later, securely, if we move forward. Update privacy copy to match.
Test first: specs that the form submits with only the kept fields, that no photo input exists, and that guardian fields still appear only for a child.
Verify: `ng test`, axe on both forms (the `.impeccable/build/forms-check.mjs` and `axe-check.mjs` scripts), keyboard-only walkthrough, mobile screenshot.

Added by the user (2026-11-02): the `careType` dropdowns on both Ask for Help and Refer must match the new 12-item conditions list on the home/Get Help pages (single source: `home.conditions` content). Add a spec that the dropdown options equal that list plus an "Other / not sure" choice.
