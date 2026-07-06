# TASKS.md

# Hoop Flick — Task Tracker for Codex

This file is a working task list for new Codex chats. Keep it updated after each completed task.

## Current Priority Order

### P0 — Reconcile UI State Mismatch Before More UI Work

Current snapshot appears partially updated across files.

`index.html` and `style.css` include a pause overlay, but uploaded `game.js` still uses the older flow where the HUD menu button calls `exitGameplayToMainMenu()` and resets the game. `game.js` also still references `menuDarkModeButton`, even though the current `index.html` main menu no longer has that button.

Before or during the next UI-related task, fix this safely:

- Add DOM references for `pauseOverlay`, `pauseMainMenuButton`, and `pauseSettingsButton` in `game.js`.
- Remove or guard any `menuDarkModeButton` usage.
- Make the HUD `menuButton` open a pause overlay without resetting score/game state.
- Pause gameplay timers/physics/input while pause overlay is active.
- Allow returning to gameplay without resetting.
- Keep “Ana Menüye Dön / Return to Main Menu” as an explicit reset/exit action.
- Keep Customize accessible only from the real main menu.
- Keep Dark Mode toggle only in Settings.

### P1 — Next Planned Cosmetic Refactor

The next prompt/user request is expected to apply a cosmetic refactor to `game.js`. The last requested but not-yet-applied task starts with:

```text
1. REMOVE OUTDATED VISUALS:
```

When applying it, implement the following carefully.

#### 1. Remove outdated visuals

- In `drawBall()`, remove the old ball shadow block that uses:
  - `ctx.fillStyle = "rgba(91, 91, 91, 0.16)"`
  - `ctx.beginPath()`
  - `ctx.ellipse(...)`
  - `ctx.fill()`
- Empty `drawAmbient()` so it draws nothing.

#### 2. Dynamic background themes

Refactor `getCanvasTheme()` so canvas themes change with score:

```js
const themeIndex = Math.floor(score / 15) % 3;
```

Add:

- `lightThemes`: original light, Sunset Orange, Mint Green.
- `darkThemes`: original dark, Deep Midnight Purple, Dark Crimson.

Return the dark or light theme based on `darkMode`.

Important: every theme object must include every property used by render code, including currently used fields such as:

- `ink`
- `ambient`
- `wallFill`
- `wallEdge`
- `trajectory`
- `trajectoryHot`
- `shotRing`
- `hint`
- `hintStrong`
- `hoopShadow`
- `boardShadow`
- `boardFill`
- `boardStroke`
- `netFill`
- `netEdge`
- `netOutline`
- `netLine`
- `netFront`
- `rimInner`
- `rimShadow`
- `rim`
- `rimHighlight`
- `motionPath`

Do not rename theme properties.

#### 3. Advanced particle effects

Expand `BALL_EFFECT_PRESETS` with `gravityModifier` and `shrinkRate`.

Add new presets:

- `gold`
- `toxic`
- `ghost`
- `water`
- `plasma`

When creating particles in `updateBallEffects(dt)`, set:

```js
gravity: preset.gravityModifier !== undefined ? preset.gravityModifier : 90,
shrinkRate: preset.shrinkRate !== undefined ? preset.shrinkRate : 12
```

When updating particles in `update(dt)`, use:

- `p.gravity` instead of a hardcoded particle gravity.
- `p.shrinkRate` instead of hardcoded size shrink.

Expected behavior:

- Toxic/ghost can float upward.
- Water drops fall heavier.
- Plasma shrinks faster.
- Gold appears bright and energetic.

#### 4. Add 12 new ball skins

Keep existing skins. Add:

- `watermelon`
- `gold`
- `ghost`
- `toxic`
- `matrix`
- `cottonCandy`
- `earth`
- `moon`
- `cyberpunk`
- `bloodMoon`
- `zebra`
- `sun`

Every new skin should use `assetPath: ""` and Canvas rendering. Some skins use `noSeams: true`.

Need to preserve or add:

- `id`
- `nameKey`
- `descriptionKey`
- `effectPreset`
- `assetPath`
- `colors`
- optional `noSeams`

#### 5. Update translations

Add Turkish and English translation keys for all new ball names.

Turkish:

- `watermelonBall: "Karpuz"`
- `goldBall: "Saf Altın"`
- `ghostBall: "Hayalet"`
- `toxicBall: "Toksik Atık"`
- `matrixBall: "Matrix"`
- `cottonCandyBall: "Pamuk Şeker"`
- `earthBall: "Dünya"`
- `moonBall: "Ay"`
- `cyberpunkBall: "Siberpunk"`
- `bloodMoonBall: "Kanlı Ay"`
- `zebraBall: "Zebra"`
- `sunBall: "Güneş"`

English:

- `watermelonBall: "Watermelon"`
- `goldBall: "Pure Gold"`
- `ghostBall: "Phantom"`
- `toxicBall: "Toxic Waste"`
- `matrixBall: "Matrix"`
- `cottonCandyBall: "Cotton Candy"`
- `earthBall: "Earth"`
- `moonBall: "Moon"`
- `cyberpunkBall: "Cyberpunk"`
- `bloodMoonBall: "Blood Moon"`
- `zebraBall: "Zebra"`
- `sunBall: "Sun"`

#### 6. Customize panel overflow

Because skin count will grow, check whether `ballSkinList` overflows the customize overlay on mobile. If needed, add a small safe CSS scroll behavior, but do not redesign the whole panel.

### P2 — Ball Skin System Improvements

Potential follow-ups after P1:

- Save selected skin into YouTube Playables cloud save, not only localStorage.
- Add a safe fallback to `classic` when saved skin ID is invalid.
- Make preview rendering match Canvas rendering for `noSeams` skins.
- Ensure `default-ball.svg` usage is intentional: either use it through `assetPath` or rely entirely on Canvas rendering.

### P2 — Spawn Fairness / High Score Flow

Continue improving spawn fairness when issues appear.

Known desired rules:

- New hoop must be generated relative to current hoop.
- Avoid impossible combinations: large distance + bad wall proximity + aggressive tilt + movement.
- Moving hoop difficulty should be balanced by easier distance/angle.
- Tilted hoops should face toward current/top position, not random left/right.
- Not every hoop should become tilted after a score threshold; tilted hoops should be a controlled subset.
- First transition should remain forgiving.

### P2 — Hoop and Ball Feel

Preserve or refine:

- Top should sit inside the net, not float above the rim.
- Net sway on score should be short and non-blocking.
- Release pull animation should visually follow the drag direction in 360 degrees without affecting collision/scoring.
- Shot ring effects should appear behind the ball at release.
- Current-hoop collision should be ignored briefly on launch so the ball does not hit its own rim immediately.

### P3 — Audio and Feedback Polish

Existing procedural audio is functional but can be improved.

Possible future improvements:

- Separate sounds for normal basket, Perfect, Bounce, game start, retry, button, and combo.
- Keep YouTube audio mute state authoritative.
- Do not play sounds if `platformPaused` or platform audio disabled.
- Keep feedback text readable in light/dark and all dynamic themes.

### P3 — YouTube Playables Validation

After any major change, check:

- SDK script loaded before game scripts.
- `firstFrameReady()` before `gameReady()`.
- `gameReady()` only when UI is interactive.
- `sendScore()` only with valid integer high score.
- `loadData()` before any `saveData()`.
- Save JSON remains tiny and versioned.
- Platform audio, pause, and resume callbacks work.
- Initial bundle stays under Playables limits.

## Test Checklist for Every Codex Change

Run through these whenever possible:

- Game boots without console errors.
- Main menu appears.
- Settings open and close.
- Language changes between TR/EN.
- Dark mode toggles from Settings and persists.
- Start game works.
- Drag/release works.
- Trajectory preview appears and remains short enough.
- Wall-bounce trajectory reflection still appears.
- First target hoop is reachable.
- Scoring works.
- Perfect/Bounce feedback appears correctly.
- Retry/stuck flow works.
- Game over flow works.
- Main menu and pause behavior do not accidentally reset unless explicitly intended.
- Customize panel opens and selected ball renders in preview and gameplay.
- Playables bridge does not crash outside YouTube environment.
