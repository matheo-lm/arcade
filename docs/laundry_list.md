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
- [ ] **[Medium]** Hardcoded English `aria-label="Close modal"` in badges modal (src/platform/main.ts:333)
- [ ] **[Medium]** `GameFilter.locale` is defined in interface but never consumed — dead parameter in `filterGames` (src/platform/gameRegistry.ts:27)
- [ ] **[Low-Med]** Game manifest data (`title`, `description`) rendered via `innerHTML` without escaping (src/platform/main.ts:107-129)
- [ ] **[Low]** Speculative config in placeholder manifests — `dropCooldownMs`, `goalScore`, `maxObjectsHint` are fruit-stacker/number-garden-specific (content/games/*.json)
- [ ] **[Low]** Placeholder `x's` in product name — 14 occurrences across index.html, 9 game HTML files, manifest.webmanifest, i18n, locale files

## testing & coverage
- [ ] **[Critical]** Fruit Stacker `game.ts` (1049 lines) — zero unit tests. No coverage for merge logic, collision, top-line, pumpkin detection
- [ ] **[Critical]** Number Garden `game.ts` (566 lines) — zero unit tests. No coverage for round logic, flower gen, correct/wrong handling
- [ ] **[High]** Launcher `main.ts` (492 lines) — zero unit tests (only indirect E2E)
- [ ] **[High]** Shared UI components — `settingsMenu.ts` (255 lines), `gameHeader.ts` (94 lines), `theme.ts` (39 lines) — zero unit tests
- [ ] **[High]** Number Garden — no E2E smoke test whatsoever
- [ ] **[Med]** i18n `createI18n` runtime — `t()`, `setLocale()`, fallback chain never tested
- [ ] **[Med]** No vitest config file (`vitest.config.ts`)
- [ ] **[Low]** `validateManifest` positive case (valid manifest → no errors) not tested

## localization
- [ ] **[Med]** No i18n dictionary-vs-locale-file sync test (65 keys never cross-checked)

## polish
- [ ] Add loading states between game transitions
- [ ] Improve mobile touch feedback on game cards
- [ ] Add keyboard navigation to launcher
- [ ] **[Low]** Misleading test name `"uses kiwi + pumpkin chain order"` — tests full 10-fruit chain (tests/unit/fruitStackerConfig.test.ts:5)

## config & infra
- [ ] **[Med]** No lint script or ESLint dep, but `AGENTS.md` references `npm run lint`
- [ ] **[Med]** PWA: no service worker registered, `display: standalone` without installability
- [ ] **[Med]** Evaluate third-party Google Fonts against "no third-party analytics" baseline — consider self-hosting or system fonts
- [ ] **[Med]** No security headers in `vercel.json` (CSP, X-Frame-Options)
- [ ] **[Low]** Playwright config uses port 4173 (preview default) with `npm run dev` — confusion between dev/preview

- [ ] **[Low]** Missing `categories` and `screenshots` in manifest.webmanifest

---

## stats
| area | count |
|------|-------|
| bugs | 0 |
| gameplay | 2 |
| code quality | 5 |
| testing & coverage | 8 |
| localization | 1 |
| polish | 4 |
| config & infra | 6 |
| **total** | **26** |
