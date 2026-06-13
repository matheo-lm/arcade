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
| 2026-06-12 | [Medium] `GameFilter.locale` dead parameter | Removed `locale` field from `GameFilter` interface in gameRegistry.ts (commit b560cd4) |
| 2026-06-12 | [Low] Placeholder `x's` in product name | Replaced with "arcade" in all 14 locations across HTML, manifest, i18n files (commit ae10bbc) |
| 2026-06-12 | [High] Shared UI settingsMenu.ts unit tests | Added 27 unit tests covering render, toggle, XSS, localization, dark mode (commit a003727) |
| 2026-06-12 | [High] Shared UI theme.ts unit tests | Added 11 unit tests covering resolve, apply, watch, system preference (commit 3b38751) |
| 2026-06-12 | [High] Number Garden E2E smoke test | Added E2E spec covering game shell rendering, navigation, win/game-over flow (commit on main) |
| 2026-06-12 | [Low] `validateManifest` positive case test | Added positive case test in gameRegistry.test.ts (commit 00f714d) |
| 2026-06-12 | [Med] i18n dictionary-vs-locale-file sync test | Added sync test comparing dictionary keys/values against en/es/common.json (commit 90ebeed) |
| 2026-06-12 | [ ] Add keyboard navigation to launcher | Added tabindex, focus-visible, Enter/Space handling for game cards (commit 514e47f) |
| 2026-06-12 | [Med] No lint script or ESLint dep | Added eslint.config.js, lint script in package.json (commit 75cf59d) |
| 2026-06-12 | [Med] Security headers in vercel.json (CSP, Permissions-Policy) | Added Content-Security-Policy (locked to self + Google Fonts) and Permissions-Policy (disabled unused capabilities); X-Content-Type-Options, X-Frame-Options, Referrer-Policy were already present |
| 2026-06-13 | [Critical] Fruit Stacker merge/collision tests | Extracted `mergeFruits` (pure decision) and `resolveCollisionPair` (with mergeFn callback) at module level; local `tryMerge` delegates decision to `mergeFruits`; local `resolveCollision` delegates to `resolveCollisionPair`. 13 new tests: 7 mergeFruits (same/different/terminal types, distance threshold, midpoint, velocity, purity) + 6 resolveCollisionPair (far apart, early return on merge, zero distance, push apart, impulse, integration). 39 total Fruit Stacker game-logic tests. |
| 2026-06-13 | [Med] i18n createI18n runtime tests | Added 12 tests for createI18n: t() fallback chain, setLocale(), locale resolution, interface contract. 145 total tests. (PR #31) |
| 2026-06-13 | [Med] Improve mobile touch feedback on game cards | Added -webkit-tap-highlight-color, user-select, -webkit-touch-callout; wrapped hover in @media (hover: hover) to prevent sticky hover on touch devices (PR #32) |
| 2026-06-13 | [Critical] Number Garden game.ts round-logic tests | Extracted `evaluateGuess` pure function from closure-bound `handleNumberClick`; 11 unit tests covering blocked (3 flags), wrong, correct, win, and prioritization. 156 total tests, 23 Number Garden. (PR #37) |
| 2026-06-13 | [High] Launcher main.ts unit tests | Extracted `isLocalAssetPath`, `resolveGameIcon`, `iconMarkup`, `buildCardHtml` as exported pure functions; 17 unit tests covering path validation, icon resolution, playable/placeholder card rendering, XSS escaping. 173 total tests, 17 launcher. (PR #38) |
| 2026-06-13 | [Low] Stale README text (`x's arcade` → `berries arcade`, game statuses) | Replaced remaining 2 stale references; marked number-garden and shape-builder as playable (PR #39) |
| 2026-06-13 | [Low] Stale SW cache name (`xs-arcade-shell-v3` → `berries-arcade-shell-v1`) | Changed cache name to match project name (PR #39) |
| 2026-06-13 | [Low] Speculative config in placeholder manifests | Removed `dropCooldownMs`/`goalScore`/`maxObjectsHint` from 6 placeholder manifests — only meaningful for playable games (PR #39) |
