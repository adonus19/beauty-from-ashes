# 06 Stories: remove samples, consent empty state
Model: Haiku 5.5, low. Skills: `humanizer`, `impeccable`.

Do: remove the "Sample parent/patient" entries and sample treatments from `stories` content so no invented story ships. Replace with an empty state: stories appear here only with each person's written permission; no photos or identifiable stories without written authorization. Keep the structure ready so a consented story is added by content only. Audit home and other pages for sample quotes.
Test first: spec that no content string contains "Sample" and that the empty state renders.
Verify: `ng test`, screenshot, humanizer pass.
