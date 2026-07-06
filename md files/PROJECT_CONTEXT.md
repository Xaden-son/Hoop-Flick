# PROJECT_CONTEXT.md

# Hoop Flick — Project Context for Codex

This file is intended to be pasted or attached at the beginning of new Codex chats so Codex can understand the current project without re-learning the whole history.

## 1. Project Summary

Hoop Flick is a web-based HTML5 Canvas basketball arcade game inspired by Dunk Shot. The player drags a ball from the current hoop, releases it toward the next hoop, and tries to keep climbing while scoring through hoops. The game is mobile-first and is intended for YouTube Playables, so performance, fast boot, pause/resume behavior, cloud save, audio state, and bundle size matter.

The project is not a new prototype anymore. Treat it as an ongoing production-style browser game. Do not rewrite the game from scratch, do not migrate it to Phaser/Pixi/another engine, and avoid broad architecture changes unless explicitly requested.

## 2. Current File Structure

Main files currently used by the project:

- `index.html`: Main document, canvas, overlays, menus, HUD, YouTube Playables SDK loading order.
- `style.css`: CSS variables, light/dark UI theme, overlay panels, HUD, customize UI, ball preview styling.
- `game.js`: Main Canvas game, physics, rendering, hoop spawning, scoring, localization, audio, UI state, Playables integration calls.
- `playablesBridge.js`: Isolated wrapper around YouTube Playables SDK with safe local fallback.
- `README.md`: Local run instructions and Playables test reminder.
- `default-ball.svg`: Current external/default basketball asset candidate.

## 3. Runtime and Platform

Run locally with a static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

If changes do not appear, use cache busting or hard refresh because the project intentionally uses dev query strings on `style.css`, `playablesBridge.js`, and `game.js`.

## 4. HTML / UI Structure

`index.html` currently loads the YouTube Playables SDK before game code. Keep that ordering.

Important DOM elements:

- `gameCanvas`
- `mainMenuOverlay`
- `settingsOverlay`
- `customizeOverlay`
- `pauseOverlay`
- `gameOverOverlay`
- `retryOverlay`
- `hud`
- `startButton`
- `customizeButton`
- `settingsButton`
- `settingsSoundButton`
- `settingsDarkModeButton`
- `languageButton`
- `settingsBackButton`
- `customizeBackButton`
- `pauseMainMenuButton`
- `pauseSettingsButton`
- `restartButton`
- `gameOverMenuButton`
- `retryButton`
- `retryMenuButton`
- `menuButton`
- `soundButton`
- `scoreValue`
- `bestValue`
- `finalScore`

The main menu currently has Play, Customize Ball, and Settings. The old main-menu Dark Mode button should not be used anymore; dark mode belongs in Settings only.

Important note: current uploaded `index.html` includes `pauseOverlay`, but the uploaded `game.js` may still be behind this UI state and may still query `menuDarkModeButton`. Before making UI changes, reconcile `game.js` with the current HTML.

## 5. CSS / Visual Structure

`style.css` uses CSS variables for UI colors:

- `:root` for light UI.
- `body.dark-mode` for dark UI.
- `#gameShell` background gradients for light/dark.
- `.overlay`, `.panel`, `.menuOverlay`, `.pauseOverlay`, `.retryOverlay`.
- `.hud`, `.scoreBlock`, `.iconButton`.
- `.customizePanel`, `.customizeBallPreview`, `.ballSkinList`, `.ballSkinOption`.

Ball preview CSS currently supports a vector-like preview through:

- `.ballPreviewGraphic`
- `.ballPreviewGraphic.large`
- `.ballPreviewGraphic.hasAsset`
- `.ballPreviewImage`
- `.ballSeam.horizontal`
- `.ballSeam.vertical`
- `.ballSeam.leftArc`
- `.ballSeam.rightArc`

When adding new ball skins, keep the customize preview and in-game canvas rendering visually consistent.

## 6. `game.js` Core Architecture

`game.js` is an IIFE using `"use strict"` and a single Canvas 2D context.

Important constants and tuning points:

- `WORLD_W = 420`
- `WORLD_H = 746`
- `START_HOOP_BOTTOM_OFFSET = 180`
- `HOOP_WIDTH = 79`
- `GRAVITY = 1420`
- `AIR_DRAG = 0.998`
- `LAUNCH_POWER_SCALE = 7.55`
- `TRAJECTORY_POWER_SCALE = 0.94`
- `PULL_CURVE_EXPONENT = 1.20`
- `MAX_PULL = 132`
- `MIN_SHOT_PULL = 10`
- `MAX_POWER_BOOST = 1.12`
- `WALL_INSET = 22`
- `HOOP_WALL_CLEARANCE = 94`
- `MIN_HOOP_HORIZONTAL_GAP = 82`
- `MIN_HOOP_VERTICAL_GAP = 158`
- `AIRBORNE_RETRY_DELAY = 7.5`
- `RIM_RADIUS = 8`
- `BALL_RADIUS = 15`
- `NET_REST_Y = 34`
- `BALL_SETTLE_DURATION = 0.24`
- `BALL_SETTLE_INPUT_DELAY = 0.1`
- `NET_ANIMATION_DURATION = 0.56`
- `HOOP_RELEASE_DURATION = 0.34`
- `HOOP_AIM_MAX_OFFSET = 9`
- `SHOT_RING_DURATION = 0.3`
- `SPAWN_ATTEMPTS = 14`
- `MIN_HOOP_TILT`
- `MAX_HOOP_TILT`

Manual shot tuning is intentionally centralized through `LAUNCH_POWER_SCALE`, `TRAJECTORY_POWER_SCALE`, `PULL_CURVE_EXPONENT`, and `MAX_PULL`. Preserve this when changing trajectory or shot feel.

## 7. Important Game State

Important state variables:

- `state`: currently `"menu"`, `"playing"`, `"gameover"`, `"retry"`, `"settings"`, `"customize"` in the uploaded game logic. Pause support may need reconciliation with current HTML.
- `score`, `best`
- `cameraY`, `targetCameraY`
- `comboText`
- `perfectChain`, `swishStreak`
- `lastScoreGain`
- `lastWasPerfect`, `lastWasBounce`
- `activePointer`, `drag`
- `particles`, `shotRings`
- `hoops`
- `currentHoopId`, `targetHoopId`
- `airborneTime`
- `hasReachedSecondHoop`
- `selectedBallSkinId`
- `ballEffects`
- `ball`

Important `ball` properties:

- `x`, `y`, `prevX`, `prevY`
- `vx`, `vy`
- `r`
- `held`
- `touchedHoop`
- `touchedWall`
- `scoredHoopId`
- `rotation`
- `angularVelocity`
- `settle`
- `launchHoopId`

## 8. Main Functions in `game.js`

Gameplay and state:

- `resize()`
- `resetGame(toMenu)`
- `makeStartHoop()`
- `makeFirstTargetHoop(startHoop)`
- `makeHoop(config)`
- `getDirectionalHoopRotation(x, y, fromHoop)`
- `shouldTiltHoop()`
- `placeBallInHoop(hoop)`
- `startGame()`
- `gameOver()`
- `recoverFirstTransition()`
- `updateScore(value)`
- `nextHoop(scoredHoop)`
- `isFairSpawn(candidate, fromHoop, difficulty)`
- `onPointerDown(event)`
- `onPointerMove(event)`
- `onPointerUp(event)`
- `getPullVector()`
- `update(dt)`

Animation and effects:

- `playHoopReleaseAnimation(hoop, pull)`
- `emitShotRings(x, y, pull)`
- `beginBallSettle(hoop)`
- `updateBallSettle(dt)`
- `finishBallSettle()`
- `updateLaunchHoopSafety()`
- `updateBallEffects(dt)`
- `triggerHoopScoreEffect(hoop, isPerfect)`
- `playNetAnimation(hoop, intensity)`
- `triggerSwishEffect(position)`

Collisions and scoring:

- `collideHoops(dt)`
- `collideNet(hoop)`
- `collideSegment(...)`
- `collideCircle(...)`
- `registerWallTouch()`
- `detectHoopState(hoop)`
- `didEnterHoopFromAbove(hoop)`
- `scoreTargetHoop(hoop)`
- `buildScoreFeedback(gain, isPerfect, isBounce)`

Rendering:

- `draw()`
- `drawAmbient()`
- `drawWalls(colors)`
- `drawCurrentScore()`
- `drawShotRings()`
- `drawHoopMotionPath(hoop, colors)`
- `getHoopDeformation(hoop)`
- `getHoopAimDeformation(hoop)`
- `drawHoop(hoop)`
- `drawNetCrossCurve(...)`
- `drawHoopFront(hoop, colors, deformation)`
- `drawBall()`
- `drawTrajectory()`
- `drawParticles()`
- `drawHint()`
- `drawCombo()`
- `getCanvasTheme()`

UI, platform, and persistence:

- `ensureAudio()`
- `playGameSound(name)`
- `readBestScore()`, `writeBestScore(value)`
- `readBooleanPreference(key, fallback)`
- `readLanguagePreference()`
- `t(key)`
- `writeBooleanPreference(key, value)`
- `writeLanguagePreference(value)`
- `makePlatformSaveData()`
- `schedulePlatformSave()`
- `flushPlatformSave()`
- `scheduleScoreSubmission(value)`
- `flushScoreSubmission()`
- `applyPlatformSave(rawData, platformLocale)`
- `applyDarkMode()`
- `applyLanguage()`
- `toggleLanguage()`
- `toggleDarkMode()`
- `toggleSound()`
- `syncControlLabels()`
- `syncUiState()`
- `openMenuPanel(panelName)`
- `returnToMainMenu()`
- `exitGameplayToMainMenu()`
- `handlePlatformAudioChange(enabled)`
- `handlePlatformPause()`
- `handlePlatformResume()`
- `loop(now)`
- `bootGame()`

## 9. Current Gameplay Features

Implemented or partially implemented systems:

- Canvas-based basketball arcade gameplay.
- Drag-and-release input with power curve.
- Short trajectory preview with wall-bounce reflection.
- Current hoop and target hoop flow.
- First target hoop generation from start hoop.
- Fair spawn validation with wall clearance, distance, angle, and movement difficulty checks.
- Horizontal and vertical moving hoops.
- Motion path indicators for moving hoops.
- Some hoops can be tilted; tilt direction should remain meaningful toward the current/top position, not random.
- Hoop net, rim, backboard/side board, net sway, release pull, and shot ring visual effects.
- Ball settling into hoop/net after a score.
- First-transition recovery: if the player fails before reaching the second hoop, recover to the first hoop instead of immediate game over.
- Airborne stuck/retry recovery after roughly `AIRBORNE_RETRY_DELAY`.
- Perfect/Bounce score feedback.
- High score persistence.
- Main menu, settings menu, customize menu, game over overlay, retry overlay.
- Turkish/English localization.
- Dark mode through settings.
- Procedural audio and platform audio mute integration.
- YouTube Playables wrapper and SDK lifecycle calls.

## 10. Ball Skins and Effects — Current State

Current uploaded `game.js` only defines `classic` in `BALL_SKINS`.

Current `BALL_EFFECT_PRESETS` contains:

- `classic`
- `ice`
- `neon`

Earlier planned work includes adding many more skins and effect presets. Do not assume those are already applied unless the code shows them.

Important: `default-ball.svg` exists and is a clean vector basketball asset, but current `game.js` classic skin may still be Canvas-rendered only and may not use `assetPath`.

## 11. YouTube Playables Integration

`index.html` loads:

```html
<script src="https://www.youtube.com/game_api/v1"></script>
<script src="playablesBridge.js?..."></script>
<script src="game.js?..."></script>
```

Keep the SDK script before any game code.

`playablesBridge.js` provides:

- `initialize({ onAudioEnabledChange, onPause, onResume })`
- `firstFrameReady()`
- `gameReady()`
- `sendScore(value)`
- `loadData()`
- `saveData(data)`
- `isAudioEnabled()`
- `getLanguage()`
- `isInPlayablesEnv()`
- `isLoadFinished()`

The bridge safely falls back when not inside YouTube Playables. Keep SDK calls isolated in the bridge; do not scatter raw `ytgame` calls through gameplay code.

Cloud save is limited to below 3 MiB. Save data should be compact and versioned.

## 12. Known Integration Risk in Current Snapshot

The uploaded snapshot appears partially updated:

- `index.html` contains `pauseOverlay` and no longer contains the main-menu dark mode button.
- `style.css` contains `.pauseOverlay` and `.hud.pauseActive`.
- Uploaded `game.js` still queries `menuDarkModeButton`, still wires `menuButton` to `exitGameplayToMainMenu()`, and does not query/wire `pauseOverlay`, `pauseMainMenuButton`, or `pauseSettingsButton`.

Before large work, Codex should reconcile this mismatch so the game does not crash on missing DOM elements and so gameplay pause does not reset the current run.

## 13. Development Rules for Codex

- Do not rewrite the full game.
- Do not introduce a new engine.
- Keep Canvas rendering and existing IIFE structure unless explicitly asked.
- Prefer small, named helper functions over duplicated code.
- Keep manual tuning constants centralized.
- Keep `ctx.save()` / `ctx.restore()` balanced in all drawing code.
- Keep YouTube Playables calls isolated through `playablesBridge.js`.
- Preserve dark mode, localization, cloud save, high score, and audio behavior.
- Test both local browser and Playables assumptions after changes.
- If changing `index.html` IDs, update `game.js` references at the same time.
- If changing `BALL_SKINS`, update customize preview, selected skin persistence, and translations together.
