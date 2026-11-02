# 02 Response time and income/insurance copy
Model: Haiku 5.5, low. Skill: `humanizer`.

Do:
- Replace every "10 business days" in `src/content/en.json` (FAQ, request form "next", refer steps, any other hit) with: "We generally respond to initial requests within 5–7 business days."
- Rewrite the income/insurance FAQ: no rigid income cutoff, no requirement to be uninsured; insurance may be considered; each person is evaluated individually on medical need, financial circumstances, available resources, and our ability to safely provide care. Remove any "unknown/pending" wording.
- Update the `PRODUCT.md` line that lists response time and income as pending.
Test first: a spec that fails if the string "10 business days" appears anywhere in `en.json`, and that the new sentence is present.
Verify: `ng test`; grep shows no leftover; humanizer pass on changed strings.
