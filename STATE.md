# state
> last updated: 2026-06-12

## current goal
Add CSP and Permissions-Policy security headers to `vercel.json` — done. 11 items remain.

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
- [x] Laundry list cleanup: 8 stale items moved to done (GameFilter.locale, placeholder x's, settingsMenu tests, theme tests, Number Garden E2E, validateManifest test, i18n sync test, keyboard navigation, ESLint/lint)

## findings
- **Security headers**: `vercel.json` now has `Content-Security-Policy` (default-src/script-src/style-src/font-src/img-src/connect-src all locked to 'self' plus Google Fonts CDN; object-src/base-uri/frame-ancestors/form-action locked down) and `Permissions-Policy` (camera, microphone, geolocation, payment, usb, interest-cohort, display-capture all disabled). Pre-existing: X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
- **Laundry list**: 10 items completed this session (1 new + 9 stale items verified and archived). 11 items remain.
- **Test coverage**: ~85% of source code uncovered. Fruit Stacker (1049 lines) and Number Garden (572 lines) game engines have zero unit tests. Number Garden now has E2E smoke test.
- **Code quality**: No dead parameters remain. No placeholder product names remain. ESLint with flat config is active.
- **Config**: `.env.local` is gitignored and not tracked. No service worker for PWA.

## blockers
None.

## next actions
1. Pick next highest-impact item from docs/laundry_list.md (11 remain)
