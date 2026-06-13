# AGENTS.md

> Read `SESSION.md` before starting a session. It is the canonical session protocol and overrides all other instructions.

---

## Operating Principles

These principles govern every agent interaction. Read them first. Apply them always.

### 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
- State your assumptions explicitly before implementing. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask: "Would a senior engineer say this is overcomplicated?"

### 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
Define success criteria. Loop until verified.
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"
- For multi-step tasks, state a brief plan with verification checkpoints:
  ```
  1. [step] → verify: [check]
  2. [step] → verify: [check]
  ```
- Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Loop Engineering: How We Operate

This project uses loop engineering as its operating model. The agent doesn't just respond — it discovers, plans, develops, and iterates autonomously within a designed system.

### The Loop

```
STATE.md → read memory → plan → implement → verify → update STATE.md → loop
```

### The Five Pieces

1. **Memory** — `STATE.md` tracks the current goal and blockers; `docs/laundry_list.md` is the ranked backlog and `docs/done_laundry_list.md` the archive. The agent reads them at session start and writes at session end. The model forgets; the repo doesn't.
2. **Skills** — `skills/<name>/SKILL.md` files codify project knowledge so every agent doesn't re-derive it from zero. Conventions, build steps, rationale — written once, read every run. Each skill carries YAML frontmatter (`name`, `description`) so agent tools can discover it; for Claude Code, symlink skills into `.claude/skills/` (`ln -s ../../skills/<name> .claude/skills/<name>`).
3. **Sub-agents** — Maker and checker are separated. Defined in `.agents/`. The agent that writes is never the sole agent that grades.
4. **Automations** — Scheduled workflows run discovery and triage without human prompting. `.github/workflows/loop-triage.yml` surfaces open laundry-list items as a recurring issue.
5. **Worktrees** — For parallel work, use `git worktree` isolation so concurrent agents don't collide.

### The Two Human Gates

The human engineers the loop, not its per-cycle prompter. Exactly two gates: **Frame** (clarifying questions before code, when ambiguous or on the STOP list) and **Ship** (the PR, with verification evidence). Between them, run to completion — `SESSION.md` defines both gates.

### Session Ritual

Follow the phased operating loop in `SESSION.md` — it is the canonical session protocol.

In summary:
1. **Sync**: `git pull origin <branch>`.
2. **Start**: Read `STATE.md`, `docs/laundry_list.md`, `docs/done_laundry_list.md`. Check `.loop-kit-version` against the latest loop-kit commit/release.
3. **Phase 1-3**: Gather evidence, build candidates, commit to one item (Frame gate).
4. **Phase 4-5**: Implement, verify, review, evaluate.
5. **Bookkeeping**: Update `STATE.md`, move completed items from `docs/laundry_list.md` to `docs/done_laundry_list.md`.
6. **Ship**: Feature branch, conventional commit, PR with verification evidence (Ship gate).
7. **Loop**: If exit criteria not met, return to step 2.

### Red Flags

These thoughts mean stop — you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is too simple to need acceptance criteria" | Simple items with unexamined assumptions are where rework comes from. Two lines is enough. |
| "I'll just fix this adjacent thing while I'm here" | Scope creep breaks surgical changes. Add it to `docs/laundry_list.md` instead. |
| "Tests probably pass" / "this should work now" | Evidence before claims. Run them. |
| "Tests pass, so it works" | Tests prove the code satisfies its own assertions, not that the change is wired to reality. Run the artifact and watch the change happen at its surface (`skills/surface-verification/SKILL.md`). |
| "I'll check with the human if this looks good so far" | Mid-loop permission-seeking re-inserts the human into the cycle. Verify against the criteria and ship. |
| "The status says done, so it's done" | Statuses go stale. Verify against the code. |
| "I'll update the docs in a follow-up" | The follow-up never comes. Same change, same PR. |

### Comprehension Debt

Loop velocity must not outpace understanding. The human reads the diffs; the agent writes PR descriptions that make the diff comprehensible — what changed, why, and what was verified. If a change can't be explained plainly in the PR body, it isn't ready to ship.

---

## Product Direction

Berries Arcade is a web arcade platform for kids ages 4-8 with multiple short games under one deployable app.

- Deployment target: Vercel.
- Runtime target: desktop + mobile browsers.
- Privacy baseline: no third-party analytics.
- Data model: local-only profiles, stars, badges, and settings.
- Launch locales: English (`en`) and Spanish (`es`).

## Architecture Rules

- Launcher entry: `/Users/m/Desktop/berries/index.html`.
- Game pages: `/Users/m/Desktop/berries/games/<game-slug>/index.html`.
- Shared platform code: `/Users/m/Desktop/berries/src/shared/`.
- Launcher/app shell code: `/Users/m/Desktop/berries/src/platform/`.
- Game metadata manifests: `/Users/m/Desktop/berries/content/games/*.json`.
- Public static assets/locales: `/Users/m/Desktop/berries/public/`.

When adding a game, keep the slug consistent across:
- `games/<slug>/index.html`
- `content/games/<slug>.json`
- registry references

## Required Manifest Fields

Each file in `/Users/m/Desktop/berries/content/games/*.json` must include:
- `id`
- `slug`
- `path`
- `status` (`playable` or `placeholder`)
- `title.en`, `title.es`
- `description.en`, `description.es`
- `cardIcon`
- `ageBands`
- `skills`
- `learningGoals`
- `difficultyPresets.4-5`
- `difficultyPresets.6-7`
- `difficultyPresets.8`

## Fruit Stacker Gameplay Contract

Canonical merge chain must remain:

`Cherry -> Lemon -> Kiwi -> Orange -> Apple -> Pear -> Peach -> Melon -> Watermelon -> Pumpkin`

Rules:
- Pumpkin is terminal.
- Same-type touching merges into next tier.
- Game over triggers immediately when an eligible stacked fruit crosses above the top line.
- Newly dropped fruits are exempt from top-line loss for a short spawn window.
- Touching pumpkins trigger a win celebration while pumpkin remains terminal.

## Asset Policy

- Runtime image assets must be local-only under `/Users/m/Desktop/berries/public/assets/` (no CDN or remote runtime image URLs).
- Every image used by platform or games must have a catalog record in `/Users/m/Desktop/berries/content/assets/pixel-art.json`.
- Use SVG assets for launcher and shared UI image delivery.
- Fruit Stacker gameplay sprites may use local high-resolution PNGs under `/Users/m/Desktop/berries/public/assets/fruits/` with SVG fallback paths retained in config.
- Consistency is enforced per asset family, not globally across every image.
- Families may use different visual systems, but each family must remain internally consistent.
- Do not add heavyweight asset pipelines unless requested.

## Image Family Policy (Required)

- `content/games/*.json` `cardIcon` values must be local `/assets/...svg` paths.
- Fruit Stacker `spriteUrl` values may be local `/assets/fruits/*.png` or `/assets/fruits/*.svg` paths.
- Fruit Stacker `fallbackSpriteUrl` values must be local `/assets/fruits/*.svg` paths.
- Family-level consistency contracts:
  - `fruit-stacker-fruits-v2`: all 10 fruit tiers share the same outlined playful style profile.
  - `launcher-card-icons-v2`: all launcher game card icons share one custom in-house style profile.
- New image files require:
  - placement in `/Users/m/Desktop/berries/public/assets/` (appropriate subfolder)
  - matching entry in `/Users/m/Desktop/berries/content/assets/pixel-art.json`
  - required catalog metadata: `familyId`, `styleProfile`, `sourceLibrary`, `sourceAssetId`, `sourceLicense`, `sourceUrl`, `normalized`
- Third-party sourced images must be listed in `/Users/m/Desktop/berries/content/assets/THIRD_PARTY_ASSETS.md`.
- Visual spec references for active families live in `/Users/m/Desktop/berries/docs/asset-style-families.md`.

## Localization Policy

- All user-facing shared UI copy must be present in both `en` and `es`.
- New translation keys require updates in:
  - `/Users/m/Desktop/berries/src/shared/i18n/dictionaries.ts`
  - `/Users/m/Desktop/berries/public/locales/en/common.json`
  - `/Users/m/Desktop/berries/public/locales/es/common.json`

## Cross-Game UI Consistency

Every game page must look and feel like part of the same arcade. Follow these rules:

### Shared Shell
- Use `<main class="app-shell game-shell">` as the outer wrapper.
- `.game-shell` provides a centred column capped at **1000 px** (defined in `base.css`).
- Mount the header in `<div id="gameHeaderMount"></div>` (first child).

### Game Header
- Always render via `renderGameHeader` from `@shared/ui/gameHeader`.
- Keep it clean: Only Home, Title, Score/Status, and Settings Menu.
- No clutter: Move "Sound", "Restart", and "Immersive/Fullscreen" into the **Settings Menu**.
- No nested boxes: Avoid `.panel` borders on the header. Use `border-bottom` instead.
- Score meta pill is required; high-score pill is optional.

### Hint / Instructions
- Use the shared `.hint` class for the instruction paragraph.
- Place it as the last child of the game shell, after any controls.

### Game-Over / Win Overlay
- Use the shared `.overlay` class (positioned inside the board `<section>`).
- Toggle visibility with `.visible` (`classList.add/remove("visible")`).
- Inner `<div>` gets automatic panel styling.

### Touch Targets & Mobile
- All interactive elements must be at least **44 × 44 px** tap targets.
- Test every game at **375 px width** (iPhone SE) — no horizontal scroll allowed.
- Header must stay single-row; title hides on narrow screens automatically via `gameHeader.css`.

### Responsive Convention
- Game boards should declare a max-width (via `width: min(100%, <px>)`).
- Controls and hint text should fill 100 % up to the shell's max-width.

## Engineering Guidelines

- Read relevant files before editing.
- Keep edits focused and incremental.
- Prefer strict TypeScript-safe APIs for shared modules.
- Do not add heavy frameworks/build systems unless requested.
- Preserve mobile-first interactions and 44x44 touch targets.

## STOP List (Requires Human Gate)

These areas require explicit human approval before any code is written:
- Payments / billing
- Auth / access control
- Data deletion
- Irreversible public behavior
- Parent gate / parental controls

## Validation Checklist (Every Change)

1. Type safety:
   - `npm run typecheck`
2. Unit tests:
   - `npm run test`
   - includes image catalog + family consistency checks (`tests/unit/pixelAssetCatalog.test.ts`, `tests/unit/assetFamilyConsistency.test.ts`)
3. Entry wiring:
   - verify routes/scripts in:
     - `/Users/m/Desktop/berries/index.html`
     - `/Users/m/Desktop/berries/games/fruit-stacker/index.html`
4. Launcher smoke:
   - open launcher and confirm 9 cards render.
   - verify age and skill filters update results.
   - verify EN/ES switching updates labels.
5. Fruit Stacker smoke:
   - mouse/touch/keyboard aiming changes drop lane.
   - merge through `Watermelon -> Pumpkin`.
   - confirm Pumpkin does not merge further.
   - verify restart and game-over overlays.

## Build, Test, and Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests (vitest) |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint |

## Coding Style & Naming Conventions

- TypeScript with strict mode.
- No emoji in product UI text (icons yes, text no).
- CSS uses kebab-case class names.
- Shared modules use named exports.
- Game-specific code is self-contained under `games/<slug>/`.
- Follow existing patterns in the file you're editing.

## Testing Guidelines

- Unit tests via vitest under `tests/unit/`.
- E2E via Playwright under `tests/e2e/`.
- Image catalog + family consistency tests are required checks.
- Tests must be deterministic.

## Commit & Pull Request Guidelines

- Feature branches only — never commit directly to `main`.
- Conventional commit messages: `type(scope): description`.
- PR body must include verification evidence (commands + output).
- PR body must include: what changed, why, and verification results.
