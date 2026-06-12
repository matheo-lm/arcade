# state
> last updated: 2026-06-12

## current goal
Extract Fruit Stacker pure game-logic functions and add 26 unit tests for top-line breach detection, pumpkin touch detection, world bounds, and clamp — done. 11 items remain (one partially complete).

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
- [x] Fruit Stacker unit tests: extracted `clamp`, `resolveWorldBounds`, `hasImmediateTopLineBreach`, `hasPumpkinTouch` as exported pure functions; 26 tests covering top-line, pumpkin, world bounds

## findings
- **Fruit Stacker testability**: Extracted 4 pure functions from the 1049-line closure. 26 tests now cover `hasImmediateTopLineBreach`, `hasPumpkinTouch`, `resolveWorldBounds`, and `clamp`. Remaining untested: merge logic (`tryMerge`) and collision resolution (`resolveCollision`) — these need side-effect separation.
- **Laundry list**: 1 item partially completed (Fruit Stacker unit tests — top-line, pumpkin, world bounds now covered; merge/collision remain). 10 items remain.
- **Test coverage**: 120 total tests (11 files). Fruit Stacker now has 26 game-logic tests + 4 config tests.

