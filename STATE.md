# state
> last updated: 2026-06-11

## current goal
Fix 4 ES localization bugs — done. 28 items remain in docs/laundry_list.md.

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
- [x] typecheck + tests pass (22/22)

## findings
- **Loop-kit infra**: AGENTS.md merged with loop-kit framework; all 5 pieces created (memory, skills, sub-agents, automations, worktrees).
- **Asset catalog**: 38 files on disk, all cataloged in pixel-art.json. Catalog is complete and consistent. Family consistency tests pass.
- **Game manifests**: All 9 manifests have required fields. 2 playable (fruit-stacker, number-garden), 7 placeholder.
- **Localization**: 65/65 keys present in both EN/ES. All ES strings now have correct accents and match English semantics. Dictionaries match JSON files exactly.
- **Test coverage**: ~85% of source code uncovered. Fruit Stacker (1049 lines) and Number Garden (566 lines) game engines have zero unit tests. 1 E2E spec for launcher only — no Number Garden E2E.
- **Code quality**: Generally clean — no `any`, no `console.log`, no `@ts-ignore`. 1 dead parameter (filterGames locale), 1 missing aria-label localization, 1 XSS surface (innerHTML without escape on manifest data).
- **Config**: `.env.local` is gitignored and not tracked. Placeholder `"x's"` product name in 14 locations. No service worker for PWA. No ESLint/lint script. No security headers in vercel.json.
- **Audit yielded 36 laundry items** across bugs, code quality, testing, localization, polish, and config/infra.

## blockers
None.

## next actions
1. Pick next highest-impact item from docs/laundry_list.md (28 remain)
