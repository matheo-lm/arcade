# laundry list

the living memory of what needs love in this project. gaps, debts, and broken windows
we know about. nothing here gets deleted — only moved to done when fixed.

**read this before any session.** pick one item, fix it, mark it done.

---

## bugs
(none open)

## gameplay
- [ ] Implement gameplay for remaining 6 game slots (placeholder → playable): pattern-parade, memory-trails, letter-lanterns, phonics-pop, word-match, color-craft

## code quality
*(none open)*

## testing & coverage
- [x] **[Low]** Fruit Stacker E2E smoke test — 3 tests covering shell rendering, drop mechanics via exposed API, and game-over overlay flow (PR #41)
- [ ] **[Med]** Shape Builder E2E smoke test created but not verified yet (needs Playwright to confirm)

## localization
*(none open)*

## polish
- [x] Add loading states between game transitions — spinner overlay shown on card action click before navigation
- [x] Improve mobile touch feedback on game cards
- [ ] Add more game-over/win screen polish (animations, particle effects)

## config & infra
- [ ] **[Low]** Missing `screenshots` in manifest.webmanifest (`categories` already added)
- [ ] **[Low]** `loop-kit` drift tracking — reconcile new skills/agents/doctrine against upstream at https://github.com/matheo-lm/loop-kit (`.loop-kit-version` tracks current sync point)
- [ ] **[Low]** Service worker only precaches 3 files — no game pages or JS chunks cached (online-first, no app-shell pattern)
- [ ] **[Low]** Number Garden has no sound effects (fruit-stacker and shape-builder do)
- [ ] **[Low]** No CI badge in README

---

## stats
| area | count |
|------|-------|
| bugs | 0 |
| gameplay | 1 |
| code quality | 0 |
| testing & coverage | 1 |
| localization | 0 |
| polish | 1 |
| config & infra | 5 |
| **total** | **8** |

## known issues
*(none open)*
