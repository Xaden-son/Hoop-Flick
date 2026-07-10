# Hoop Flick — YouTube Playables Release Checklist

Use this only after the user's final gameplay and UI requests are complete. Current platform documentation and Developer Portal validation always override this checklist.

## 1. Freeze the Candidate

- Work from a clean, identified commit/branch.
- Record the candidate commit hash.
- Stop adding optional features during release validation.
- Confirm documentation reflects the candidate code.

## 2. Clean the Runtime Package

- Include only files required at runtime.
- Remove test markers, debug-only code, temporary files and unused large assets.
- Check every asset path for case sensitivity.
- Remove or intentionally version development cache-busting strings.
- Confirm all game-owned runtime URLs are relative/local.
- Keep the required Playables SDK loading mechanism consistent with current official documentation.

## 3. Static Checks

- Validate JavaScript syntax.
- Check HTML for missing IDs referenced by `game.js`.
- Check for duplicate DOM IDs.
- Check CSS/HTML asset references.
- Search for `TODO`, `FIXME`, development hostnames and accidental logs.
- Confirm no secrets, tokens or personal paths are included.

## 4. Local Functional Smoke Test

- Load through a static HTTP server with a clean cache.
- Verify first paint and main-menu interaction.
- Verify all menu, settings, customization and back-navigation paths.
- Verify gameplay, scoring, retry, game-over and restart.
- Verify user pause/resume without state loss.
- Verify local persistence after reload.
- Verify safe behavior when the Playables environment is absent.
- Confirm no console error or unhandled rejection.

## 5. Mobile and Responsive Test

- Test representative narrow portrait widths.
- Test a short-height mobile viewport.
- Test safe-area insets where possible.
- Test real touch drag/release/cancel.
- Confirm Customize Ball and Customize Theme can always return to the main menu.
- Test orientation/resize without duplicate loops or broken scaling.
- Check Safari and Chrome on a real phone when available.

## 6. Playables Lifecycle Test

- SDK loads before bridge and game code.
- A visible frame is rendered before `firstFrameReady()`.
- `gameReady()` is sent only after initialization and interactive readiness.
- Cloud load occurs before save.
- Missing/malformed/older save data falls back safely.
- Platform audio disabled/enabled state is authoritative.
- Platform pause stops input, animation and audio.
- Platform resume creates exactly one active animation loop.
- Score submissions are valid non-negative safe integers.
- Bridge errors fail safely and do not block play.

## 7. Performance and Stability

- Check first-load time on a normal mobile connection/device.
- Run an extended scoring session to observe spawn fairness and memory growth.
- Watch particle-heavy combos for frame drops.
- Confirm Canvas/DOM elements are reused rather than leaked per frame.
- Confirm timers and animation frames do not multiply after repeated pause/resume.
- Confirm audio nodes and pending saves do not produce repeated errors.

## 8. Package and Portal

- Create a clean staging directory first.
- Verify the staging directory locally before zipping.
- Follow the current Developer Portal rules for entry point, ZIP root structure and size limits.
- Upload the candidate and run every portal validation.
- Fix reported issues in source, regenerate the staging package and retest; do not patch only the ZIP.
- Perform a final platform-hosted playthrough before submission.

## Release Sign-Off

- Candidate commit:
- Package filename:
- Local smoke test completed:
- Real-device test completed:
- Developer Portal checks passed:
- Platform-hosted playthrough completed:
- Known issues accepted:

