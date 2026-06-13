# laundry list

the living memory of what needs love in this project. gaps, debts, and broken windows
we know about. nothing here gets deleted — only moved to done when fixed.

**read this before any session.** pick one item, fix it, mark it done.

---

## bugs
(none open)

## gameplay
- [ ] Implement gameplay for remaining 8 game slots (placeholder → playable)
- [ ] Add more game-over/win screen polish (animations, particle effects)

## code quality

- [ ] **[Low]** Speculative config in placeholder manifests — `dropCooldownMs`, `goalScore`, `maxObjectsHint` are fruit-stacker/number-garden-specific (content/games/*.json)

## testing & coverage
- [ ] **[Critical]** Number Garden `game.ts` (572 lines) — round logic still untested (closure-bound, needs state reducer); `easeOutBack` + `calculateStars` extracted (12 tests)
- [ ] **[High]** Launcher `main.ts` (509 lines) — zero unit tests (only indirect E2E)
- [x] **[High]** `gameHeader.ts` (94 lines) — unit tests added (13 tests covering render, update, XSS, edge cases)
- [ ] **[Med]** i18n `createI18n` runtime — `t()`, `setLocale()`, fallback chain never tested

## localization
*(none open)*

## polish
- [x] Add loading states between game transitions — spinner overlay shown on card action click before navigation
- [ ] Improve mobile touch feedback on game cards

## config & infra
- [ ] **[Low]** Playwright config uses port 4173 (preview default) with `npm run dev` — confusion between dev/preview
- [ ] **[Low]** Missing `screenshots` in manifest.webmanifest (`categories` already added)

---

## stats
| area | count |
|------|-------|
| bugs | 0 |
| gameplay | 2 |
| code quality | 1 |
| testing & coverage | 3 |
| localization | 0 |
| polish | 2 |
| config & infra | 2 |
| **total** | **10** |
