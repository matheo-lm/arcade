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
- [x] **[Med]** Shape Builder E2E smoke test created and verified in PR #40 (7/7 E2E tests passed)

## localization
*(none open)*

## polish
- [x] Add loading states between game transitions — spinner overlay shown on card action click before navigation
- [x] Improve mobile touch feedback on game cards
- [ ] Add more game-over/win screen polish (animations, particle effects)

## config & infra
- [ ] **[Low]** Missing `screenshots` in manifest.webmanifest (`categories` already added)
- [x] **[Low]** `loop-kit` drift tracking — no drift (upstream HEAD `fe4f47b` matches `.loop-kit-version` sync point)
- [x] **[Low]** Service worker only precaches 3 files — added all 9 game HTML pages to precache (now 12 files at install)
- [ ] **[Low]** Number Garden has no sound effects (fruit-stacker and shape-builder do)
- [x] **[Low]** No CI badge in README — added badge linking to GitHub Actions workflow

---

## stats
| area | count |
|------|-------|
| bugs | 0 |
| gameplay | 1 |
| code quality | 0 |
| testing & coverage | 0 |
| localization | 0 |
| polish | 1 |
| config & infra | 2 |
| **total** | **4** |

## known issues
*(none open)*
