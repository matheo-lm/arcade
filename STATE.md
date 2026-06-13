# state
> last updated: 2026-06-13

## current goal
Fruit Stacker merge/collision tests complete — `mergeFruits` and `resolveCollisionPair` extracted as pure functions with 13 unit tests (39 total Fruit Stacker game-logic tests). 10 items remain.

## progress
- [x] loop-kit infrastructure setup complete
- [x] Codebase audit complete (36 items)
- [x] Bug 1: fruit-stacker Google Fonts link added
- [x] Bug 2: fruit-stacker fallbackSpriteUrl changed to .svg (10 tiers)
- [x] Bug 3: number-garden hint overwrite removed
- [x] Bug 4: number-garden unused import removed
- [x] ES fix 1: skillLogic "logica" → "lógica"
- [x] ES fix 2: highScoreLabel "puntaje max" → "puntaje máximo"
- [x] ES fix 3: statsHighScoreTooltip "puntaje max" → "puntaje máximo"
- [x] ES fix 4: badgesModalSub added missing "geniales"
- [x] XSS fix: escapeHtml helper + wrapping game title/description in renderCards
- [x] aria-label fix: localized badges close button with closeModal key
- [x] Security headers: CSP + Permissions-Policy added to vercel.json
- [x] Laundry list cleanup: 8 stale items moved to done
- [x] Fruit Stacker unit tests batch 1: extracted `clamp`, `resolveWorldBounds`, `hasImmediateTopLineBreach`, `hasPumpkinTouch` as exported pure functions; 26 tests covering top-line, pumpkin, world bounds
- [x] Fruit Stacker unit tests batch 2: extracted `mergeFruits` (pure decision) and `resolveCollisionPair` (with mergeFn callback); local `tryMerge`/`resolveCollision` delegate to exported versions; 13 new tests covering merge logic, collision physics, zero-distance edge case, impulse

## findings
- **Fruit Stacker testability complete**: All 6 target functions extracted — 39 game-logic tests (4 base + 26 batch 1 + 13 batch 2) + 4 config tests = 43 Fruit Stacker tests. Remaining untested: game-loop integration and rendering (not suitable for unit testing).
- **Laundry list**: 1 Critical testing item fully closed (Fruit Stacker merge/collision). 10 items remain.
- **Test coverage**: 133 total tests (11 files). Fruit Stacker now has 39 game-logic + 4 config tests.

