# 07 Plain-language conditions and respectful wording
Model: Sonnet 5.5, medium. Skills: `humanizer`, `impeccable`.

Do:
- Extend the conditions list (`getHelp` and `home` conditions) to cover the owner's terms in both everyday and medical language: scar repair or revision; facial deformity or reconstruction; birth defect or congenital difference; cleft lip and cleft-related surgery; injury and trauma reconstruction; burn scars; skin lesions or growths that affect appearance or function; breast reconstruction or deformity; abdominal wall and body changes after major weight loss, trauma or surgery; revision after previous surgery; children with congenital or acquired differences.
- Work searchable phrases into headings, FAQ and `index.html` meta: charitable plastic surgery, pro bono reconstructive surgery, help for someone who cannot afford plastic surgery, reconstructive plastic surgeon in Fort Mill or Charlotte. Avoid keyword stuffing.
- Audit all copy for "fix/repair a person" language. Prefer restoring form or function, addressing the effects of trauma or congenital difference, improving a physical condition, moving toward healing. Keep the mission-card values verbatim.
- Mark all medical descriptions as needing owner review (O-5).
Test first: spec that each listed term appears on the Get Help page and that banned phrases ("disfiguring", "fix you") do not appear in `en.json`.
Verify: `ng test`, humanizer pass, screenshot of the conditions section at mobile width.
