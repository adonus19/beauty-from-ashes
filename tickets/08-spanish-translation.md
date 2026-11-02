# 08 Full Spanish translation
Model: Sonnet 5.5, medium. Run one page or section per pass to keep context small. Skills: `humanizer` (applied to tone, not English-only idioms), `angular-developer`.
Start only after English tickets 02, 03, 04, 06, 07 are merged.

Why: `src/content/es.json` is 9 lines; Spanish currently falls back to English with a "pending translation" notice. The owner wants English and Spanish both excellent at launch.

Do: translate `en.json` structure fully, reading as natural, warm Spanish for a Spanish-speaking community (not literal), including form labels, errors, FAQ, privacy, accessibility and meta. Keep the mission-card values in their own Spanish rendering, flagged for owner approval. Remove the pending notice and the English fallback once key parity is complete. Set `lang="es"` and Spanish page titles and meta.
Test first: parity spec that `es.json` has every key `en.json` has, and no value equal to its English text except proper nouns.
Verify: `ng test`, axe in `/es`, screenshots for text expansion on buttons and nav at 375px, then native-speaker review (O-6) before launch.
