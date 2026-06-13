# state
> last updated: 2026-06-13

## current goal
loop-kit doctrine sync complete — surface-verification skill, design skill, Observe at the surface in SESSION.md, missing red flags, Session Ritual, loop-kit version tracking.

## progress
- [x] loop-kit infrastructure setup complete (initial bootstrap)
- [x] loop-kit doctrine sync — added missing skills (design, surface-verification), updated SESSION.md (Observe at the surface, Ship/exit criteria), updated AGENTS.md (red flags, Session Ritual, expanded skill descs, loop-kit version check), created `.loop-kit-version` tracking

## progress
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
- **Loop-kit doctrine sync complete**: Added 2 missing skills (design, surface-verification), updated SESSION.md with Observe at the surface doctrine and loop-kit version check in Phase 1, updated AGENTS.md with missing red flag, Session Ritual, and loop-kit check instruction. Created `.loop-kit-version` tracking file at `fe4f47bf`.
- **Laundry list**: 11 items remain (10 prior + 1 new: loop-kit drift tracking).
- **Test coverage**: 133 total tests (11 files). Fruit Stacker now has 39 game-logic + 4 config tests.

