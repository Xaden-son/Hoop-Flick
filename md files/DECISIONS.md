# Hoop Flick — Technical Decisions and Guardrails

These decisions remain in force unless the user explicitly overrides them.

## Architecture

- Keep HTML5 Canvas 2D for gameplay rendering.
- Keep DOM/CSS for menus, overlays, HUD, settings and customization.
- Keep the IIFE structure in `game.js`.
- Keep the project dependency-free and build-step-free unless a platform requirement makes a change necessary.
- Do not migrate to Phaser, PixiJS, React or another engine/framework.
- Prefer small targeted edits over broad refactors.

## Source of Truth

- Current local source files outrank Markdown notes.
- Never implement a task solely because an old task file says it is pending; first confirm it is absent from the code.
- Update `PROJECT_CONTEXT.md`, `DECISIONS.md` or `TASKS.md` when a completed change makes them inaccurate.

## State and UI

- `state` remains the main UI/gameplay state controller.
- Main menu contains Play, Customize Ball, Customize Theme and Settings.
- Dark mode belongs only in Settings.
- Ball and theme customization remain separate panels.
- The gameplay menu control pauses the current run; it must not silently reset score or progress.
- Returning from pause to the main menu is an explicit reset/exit action.
- Platform pause and user pause remain separate concepts.
- No gameplay input, physics step or audio playback may continue while platform-paused or user-paused.
- Preserve viewport safe-area handling and short-screen/mobile scroll behavior.

## Gameplay and Physics

- Keep manual shot tuning centralized in named constants.
- Do not change collision geometry as part of a visual-only request.
- Keep the trajectory preview informative but shorter than a full guaranteed landing solution.
- Preserve limited wall-bounce trajectory reflection.
- New hoops must remain reachable and be generated relative to the current hoop.
- Difficulty should come from placement, controlled movement and controlled tilt—not tiny hoops or impossible combinations.
- The first transition stays forgiving.
- A newly launched ball must not immediately collide with its launch hoop; old hoops may collide normally after legitimate return/bounce conditions.
- Keep `ctx.save()` and `ctx.restore()` balanced.

## Scoring and Feedback

- Score and high score remain safe non-negative integers.
- Perfect means a clean basket under the current collision rules.
- Bounce reflects an eligible wall/bounce touch before scoring.
- Score submission occurs for meaningful high-score updates, not every frame.
- Visual/audio feedback must remain readable and usable across every theme.

## Customization

- `BALL_SKINS` is the only source of truth for ball options.
- `BALL_EFFECT_PRESETS` is the only source of truth for trail/perfect effect behavior.
- `THEMES` is the only source of truth for Canvas background/gameplay palettes.
- Every theme color variant must expose the same renderer keys.
- Use `normalizeBallSkinId()` or an equivalent safe fallback to `classic` for invalid saved IDs.
- Use a safe existing-theme fallback for invalid theme IDs.
- A `noSeams` skin must omit seams in both DOM preview and Canvas gameplay rendering.
- Keep customization lists scrollable on small mobile screens.
- Do not re-add removed ball skins (`cottonCandy`, `moon`) without explicit instruction.

## Localization

- Supported languages remain Turkish (`tr`) and English (`en`).
- Static DOM strings use `data-i18n` when practical.
- Dynamic strings use `t(key)`.
- Every new user-facing string must be added in both languages.
- Do not hardcode translated button labels in state-sync logic.

## Audio

- Procedural audio may initialize only after a user interaction where browser policy requires it.
- The YouTube platform audio state is authoritative.
- Muted, platform-paused and user-paused states must block sound playback.
- Audio errors must not block gameplay.

## Persistence and Platform

- Keep raw YouTube Playables SDK access inside `playablesBridge.js`.
- Load the platform SDK before `playablesBridge.js`, and the bridge before `game.js`.
- Render the first visible frame before `firstFrameReady()`.
- Call `gameReady()` only after initialization and interactive UI readiness.
- Finish `loadData()` before any `saveData()` call.
- Keep cloud saves compact, JSON-based and versioned.
- Preserve local fallback when outside YouTube Playables.
- Validate score values before platform submission.
- Do not assume a local browser test proves platform integration; run the current Developer Portal checks before release.

## Completion Report Required from Codex

After each implementation task, report:

- Files changed.
- Functions/sections changed.
- Tests or checks performed.
- Manual tuning constants changed, if any.
- Remaining risks or items requiring real-device/Developer Portal verification.

