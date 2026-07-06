# DECISIONS.md

# Hoop Flick — Technical Decisions and Conventions

This file documents decisions that Codex should preserve across new chats.

## 1. Architecture

The game is an HTML/CSS/JavaScript Canvas game. Keep the current architecture.

Decision:

- Use HTML5 Canvas 2D for gameplay rendering.
- Use DOM/CSS for menus, overlays, HUD, settings, customize UI.
- Keep the current IIFE style in `game.js`.
- Do not migrate to Phaser, PixiJS, React, or another framework unless explicitly requested.

Rationale:

- The project is already working as a lightweight browser game.
- YouTube Playables favors fast boot and small bundles.
- Rewrites increase risk and slow iteration.

## 2. YouTube Playables

Decision:

- Load the YouTube Playables SDK in `index.html` before `playablesBridge.js` and `game.js`.
- Keep raw SDK calls isolated inside `playablesBridge.js`.
- `game.js` should use `window.PlayablesBridge`, not raw `ytgame`.
- Keep local fallback safe when outside Playables.

Lifecycle expectations:

- Render first visible frame, then call `firstFrameReady()`.
- After UI/game is interactive, call `gameReady()`.
- Use integer high scores with `sendScore(value)`.
- Load cloud save before saving.
- Respect platform audio enabled/disabled state.
- Use platform pause/resume callbacks.

## 3. State and UI

Decision:

- `state` drives gameplay/menu/render behavior.
- Main menu is for starting the game, opening customize, and opening settings.
- Gameplay HUD menu should open a pause overlay, not reset the run.
- Returning to the main menu from gameplay must be an explicit user choice.
- Customize should be accessible from the real main menu, not from pause.
- Dark mode toggle should live only in Settings.

Important current snapshot warning:

- `index.html` and `style.css` appear ahead of `game.js` for pause UI.
- Reconcile DOM references before adding more UI work.

## 4. Localization

Decision:

- UI strings are stored in `TRANSLATIONS`.
- Supported languages are `tr` and `en`.
- Use `data-i18n` for static DOM text.
- Use `t(key)` for dynamic text in `game.js`.
- Save language preference locally and in cloud save where applicable.
- If YouTube locale is available and no explicit saved language exists, infer initial language from it.

When adding UI text or ball names, update both `tr` and `en`.

## 5. Dark Mode and Themes

Decision:

- DOM UI dark mode is controlled with `body.dark-mode` CSS variables.
- Canvas colors come from `getCanvasTheme()`.
- Canvas theme properties must stay stable; render functions should not break if the theme changes.
- Dynamic background/theme changes can be score-based, but every theme object must include the same keys.

Do not hardcode random colors inside render functions when a theme key already exists.

## 6. Gameplay Tuning

Decision:

- Keep shot tuning constants centralized near the top of `game.js`.
- Important values:
  - `LAUNCH_POWER_SCALE`
  - `TRAJECTORY_POWER_SCALE`
  - `PULL_CURVE_EXPONENT`
  - `MAX_PULL`
  - `MIN_SHOT_PULL`
  - `MAX_POWER_BOOST`
- If shot feel changes, preserve these constants and comment what they do.

Trajectory preview philosophy:

- It should show direction and limited wall-bounce reflection.
- It should not fully reveal the exact landing path.
- It should remain short enough to keep skill in the game.

## 7. Hoop Design and Spawn Logic

Decision:

- Hoop size should remain stable/minimal, not shrink with score.
- Difficulty should come from spawn placement, movement, tilt, and mechanics rather than tiny hoop size.
- New hoop spawn should be relative to the current hoop.
- Spawn must avoid impossible/high-score-breaking layouts.
- Moving hoops may move horizontally or vertically.
- Moving hoops should show a subtle motion path indicator.
- Tilted hoops should not be randomly angled; if tilted, they should face meaningfully toward the current/top position.
- Not every hoop should be tilted after a threshold. Keep a mix of straight and tilted hoops.

Collision/scoring expectations:

- A ball leaving the current hoop should not immediately collide with its own rim.
- If the ball later returns to an old hoop after bouncing elsewhere, normal collision can apply.
- Top should settle inside the net, not above the rim.
- Net settle animation should not block the next shot.

## 8. Scoring

Decision:

- Perfect means a clean/deliksiz basket.
- Bounce means the ball touched a wall or eligible bounce surface before scoring.
- Feedback should show Perfect and/or Bounce clearly.
- Perfect streak scoring should follow the current implemented or requested scoring model and be adjusted only when explicitly asked.
- Keep score/high score integer-safe.
- Send score to Playables only for meaningful high score updates, not every frame.

## 9. Ball Skins

Decision:

- `BALL_SKINS` is the central source of truth for ball options.
- Each skin should have:
  - `id`
  - `nameKey`
  - `descriptionKey`
  - `effectPreset`
  - `assetPath`
  - `colors`
  - optional `noSeams`
- Canvas-rendered skins should use `assetPath: ""`.
- `noSeams: true` means the seam/path lines should not be drawn.
- Invalid saved skin IDs should fall back to `classic`.
- Preview in Customize should match the in-game Canvas style as closely as practical.

Canvas ball rendering:

- Use skin gradient colors.
- Keep outline/highlight readable.
- Keep basketball seams symmetrical for seamed balls.
- Preserve rotation animation.
- Avoid hardcoded pixel-only seam positions; use `ball.r`.

## 10. Ball Effects and Particles

Decision:

- Ball trail effects are chosen through `effectPreset`.
- Particle presets should support:
  - `trailColors`
  - `comboThreshold`
  - `trailInterval`
  - optional `gravityModifier`
  - optional `shrinkRate`
- Particle physics should use per-particle gravity/shrink values when available.
- Avoid spawning too many particles or DOM elements.
- Keep particle effects Canvas-based and lightweight.

## 11. Drawing Safety

Decision:

- Always keep `ctx.save()` / `ctx.restore()` balanced.
- Avoid changing collision geometry when adding purely visual effects.
- Visual hoop deformation/release pull/net sway should not corrupt scoring/collision.
- If adding new render states, keep them short-lived and reset them cleanly.
- Respect dark mode and future dynamic themes.

## 12. Persistence

Decision:

- Local fallback uses localStorage for:
  - best score
  - dark mode
  - muted state
  - language
  - selected ball skin
- YouTube Playables cloud save should remain compact, JSON string, and versioned.
- Cloud save should not contain large assets, debug data, or replays.
- Save only small user preferences and high score.

## 13. Coding Style

Decision:

- Prefer small targeted changes.
- Keep constants at the top.
- Use existing helper functions before adding new ones.
- Do not duplicate logic for score, save, language, or UI state.
- Guard optional DOM elements if HTML may have changed.
- After any Codex task, summarize:
  - files changed
  - functions changed
  - tests performed
  - any manual tuning constants affected
