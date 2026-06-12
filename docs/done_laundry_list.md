# done laundry list

completed items, archived. never deleted — only moved from `docs/laundry_list.md`.

---

| date | item | notes |
|------|------|-------|
| 2026-06-11 | [Medium] fruit-stacker missing Google Fonts link | Added preconnect + stylesheet link matching number-garden pattern |
| 2026-06-11 | [Medium] fruit-stacker fallbackSpriteUrl points to PNG | Changed all 10 tiers to `.svg` per Image Family Policy |
| 2026-06-11 | [Low] number-garden hint overwrite | Removed incorrect `hintEl.textContent` assignment in game.ts:555 |
| 2026-06-11 | [Low] number-garden unused import | Removed `updateGameAction` from import in main.ts:10 |
| 2026-06-11 | [Minor] ES `skillLogic` accent | `"logica"` → `"lógica"` in dictionaries.ts and es/common.json |
| 2026-06-11 | [Minor] ES `highScoreLabel` | `"puntaje max"` → `"puntaje máximo"` in dictionaries.ts and es/common.json |
| 2026-06-11 | [Minor] ES `statsHighScoreTooltip` | `"puntaje max"` → `"puntaje máximo"` in dictionaries.ts and es/common.json |
| 2026-06-11 | [Trivial] ES `badgesModalSub` | Added missing `"geniales"` to match English "cool badges" |
| 2026-06-11 | [Low-Med] XSS via innerHTML on game manifest data | Added `escapeHtml` helper; wrapped `game.title` and `game.description` in `renderCards`. Note: same pattern exists in badge modal data (lines 312,313,317) — not scoped. |
| 2026-06-12 | [Medium] Hardcoded English aria-label on badges close button | Replaced with i18n `closeModal` key (en: "close modal", es: "cerrar modal") across dictionaries.ts, type, locale JSONs, and main.ts |
