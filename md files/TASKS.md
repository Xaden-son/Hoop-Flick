# Hoop Flick — Final Task Tracker

Snapshot date: 2026-07-10

Only implement tasks explicitly selected by the user. Do not treat optional polish ideas as authorization to change the game.

## Current Status

The following older planned work is already present in the current code and must not be repeated:

- User pause overlay and pause-settings flow.
- Platform pause/resume callbacks.
- Separate Customize Theme menu.
- Dark mode only in Settings.
- Scrollable mobile ball/theme lists.
- Expanded Canvas ball skins and advanced particle presets.
- Cloud saving of selected ball skin and selected theme.
- Invalid ball-skin fallback.
- Theme-aware Canvas rendering.
- Removal of `cottonCandy` and `moon` from the current skin collection.

## P0 — User-Requested Final Gameplay/UI Changes

Status: waiting for the user's final change list.

For each requested item:

- Inspect the current implementation first.
- Identify exact files/functions affected.
- Keep changes narrowly scoped.
- Do not combine unrelated cleanup.
- Add/update TR and EN strings for new user-facing text.
- Verify mobile viewport behavior when UI changes.
- Verify collision/scoring behavior when visuals or physics change.

## P0 — Regression Pass After Final Changes

Required before packaging:

- Boot with no console errors through a local HTTP server.
- Main menu buttons open the correct panels.
- Settings open/close from main menu and pause.
- Sound, dark mode and language state persist.
- Ball and theme selections persist and render correctly.
- Small-screen panels remain fully navigable.
- Play starts normally.
- Pointer drag, release and cancel work.
- Trajectory preview and wall reflection work.
- First hoop transition is reachable.
- Hoop spawning does not produce obvious impossible layouts during an extended run.
- Normal, Perfect and Bounce scoring still work.
- Retry/stuck, game-over, restart and main-menu flows work.
- User pause freezes the run and resumes without resetting.
- Platform bridge fallback produces no crash outside YouTube.
- No newly introduced uncaught promise rejection or repeated warning loop.

## P1 — Source and Asset Audit

- Remove development-only HTML comments and accidental test markers.
- Replace development cache-busting query strings with deliberate release versions or remove them if the packaging strategy does not need them.
- Confirm every referenced local asset exists with correct case-sensitive paths.
- Confirm no remote runtime dependency exists except the required Playables SDK.
- Confirm no unused large asset is included in the upload bundle.
- Confirm favicon/default-ball assets are intentionally included or removed.
- Confirm filenames and paths work from a static relative-path package.

## P1 — Playables Integration Audit

- Confirm SDK → bridge → game script ordering.
- Confirm the first visible frame is drawn before `firstFrameReady()`.
- Confirm `gameReady()` occurs after platform initialization and interactive readiness.
- Confirm `loadData()` completes or safely falls back before saving.
- Confirm cloud-save migration/fallback handles missing, old and malformed data.
- Confirm save data stays compact and versioned.
- Confirm score submission accepts only safe non-negative integers.
- Confirm platform audio changes immediately affect playback.
- Confirm platform pause freezes loop/input/audio and flushes pending state where appropriate.
- Confirm platform resume does not create duplicate animation loops.
- Confirm all SDK failures degrade safely instead of blocking the game.
- Recheck current requirements in the YouTube Playables Developer Portal immediately before submission.

## P1 — Release Package Validation

- Build a clean staging directory containing only required release files.
- Ensure the entry point is in the required location and named correctly for the current portal rules.
- Serve the staging directory locally and repeat the smoke test.
- Test at representative portrait phone sizes and at least one desktop viewport.
- Test touch input on a real phone, including Safari and Chrome where available.
- Check initial load, memory use, animation smoothness and audio behavior.
- Create the final ZIP using the exact directory structure required by the current portal.
- Upload to the Developer Portal and resolve every reported error before submission.

## Optional Polish — Do Not Implement Without Request

- Further procedural sound variations.
- New ball skins or themes.
- More aggressive hoop difficulty.
- Architecture refactors.
- Analytics, ads or monetization hooks.
- Additional languages.

