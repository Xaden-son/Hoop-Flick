# Hoop Flick — Current Project Context

Snapshot date: 2026-07-10

This file is the primary context document for new Codex sessions. Treat the source code in the local repository as the final source of truth if this document ever conflicts with it.

## Project Summary

Hoop Flick is a mobile-first HTML5 Canvas basketball arcade game inspired by the drag-and-release loop of games such as Dunk Shot. The player pulls a ball from the current hoop, releases it toward the next hoop, and keeps climbing while earning score bonuses.

The target platform is YouTube Playables. Fast startup, touch controls, responsive layout, safe pause/resume behavior, platform audio state, compact cloud saves, integer score submission, and a small self-contained bundle are important.

This is an existing production-style project. Do not rewrite it, migrate it to an engine/framework, or restructure it broadly unless explicitly requested.

## Current Runtime Structure

- `index.html`: document structure, canvas, overlays, HUD, SDK/script loading order.
- `style.css`: responsive DOM UI, safe-area handling, light/dark UI, customize lists and overlays.
- `game.js`: game state, physics, collisions, spawning, rendering, localization, procedural audio, preferences and Playables-facing calls.
- `playablesBridge.js`: isolated wrapper around the YouTube Playables SDK with a safe local fallback.
- `README.md`: local server and test instructions.

The game runs without a build step. Test through a static HTTP server rather than opening `index.html` directly.

## Current UI and State

The current HTML and JavaScript already contain:

- Main menu: Play, Customize Ball, Customize Theme and Settings.
- Settings: sound, dark mode and TR/EN language.
- Ball customization with a scrollable mobile list and preview.
- Theme customization with a separate scrollable list.
- Gameplay HUD with score, best score, menu/pause and sound controls.
- User pause overlay with resume-through-HUD behavior, Settings access and explicit return to main menu.
- Game-over and stuck/retry overlays.
- Platform pause/resume handling separate from user pause.

Important states currently include:

- `menu`
- `settings`
- `customize`
- `theme`
- `playing`
- `paused`
- `pause-settings`
- `retry`
- `gameover`

The old documentation warning that pause UI is missing from `game.js` is obsolete. Pause DOM references and pause logic are already present.

## Gameplay Architecture

`game.js` is an IIFE using a single Canvas 2D context. The logical world size is `420 × 746`; `resize()` adapts it to the viewport.

Core systems include:

- Drag/release aiming and a short trajectory preview.
- Gravity, air drag, wall collision and hoop/rim/net collision.
- Current/target hoop progression and camera movement.
- Controlled hoop tilt, movement and spawn fairness.
- Perfect, Bounce, combo and score feedback.
- Ball settle, hoop release, net and particle effects.
- First-transition recovery and an airborne stuck/retry flow.

Manual shot tuning is intentionally centralized near the top of `game.js`, including:

- `LAUNCH_POWER_SCALE`
- `TRAJECTORY_POWER_SCALE`
- `PULL_CURVE_EXPONENT`
- `MAX_PULL`
- `MIN_SHOT_PULL`
- `MAX_POWER_BOOST`

Do not scatter replacement numbers through physics code.

## Customization Already Implemented

Current ball skin IDs:

`classic`, `inverted`, `neon`, `magma`, `watermelon`, `gold`, `ghost`, `toxic`, `matrix`, `earth`, `cyberpunk`, `bloodMoon`, `zebra`, `sun`.

`BALL_SKINS` is the source of truth. A skin contains an ID, translation key, effect preset, optional asset path, color set and optional `noSeams` flag. Current skins are Canvas-rendered with empty asset paths.

Current background theme IDs:

`gym`, `sunset`, `neon`, `rooftop`, `minimal`.

`THEMES` is the source of truth. Each theme contains light/dark color variants and the complete set of renderer color keys.

The currently uploaded code does not include the previously planned `cottonCandy` or `moon` ball skins. Do not re-add them unless the user explicitly requests it.

## Persistence and YouTube Playables Integration

Local fallback uses `localStorage` for best score, dark mode, muted state, language, selected ball skin and selected theme.

The current cloud-save schema is version 3 and stores:

- `highScore`
- `settings.language`
- `settings.darkMode`
- `settings.muted`
- `settings.ballSkin`
- `settings.theme`

The current platform integration already provides:

- SDK script ordering before bridge/game code.
- Safe SDK-call isolation in `playablesBridge.js`.
- `firstFrameReady()` and `gameReady()` guards.
- Cloud load before cloud save.
- Versioned JSON save data.
- Safe non-negative integer score submission.
- Platform audio state and audio-change callback.
- Platform pause/resume callbacks.
- Safe behavior outside the Playables environment.

Do not call raw `ytgame` APIs from `game.js`. Use `window.PlayablesBridge`.

## Working Rule

For every requested change:

1. Inspect the current local files before editing.
2. Make the smallest coherent change.
3. Preserve the current architecture and unrelated behavior.
4. Test the affected flow plus one adjacent regression flow.
5. Report files/functions changed, tests run, remaining uncertainty and any tuning constants changed.

