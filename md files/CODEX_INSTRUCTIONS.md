# Hoop Flick — Instructions for Codex

Use this file at the start of a new Codex session together with `PROJECT_CONTEXT.md`, `DECISIONS.md` and `TASKS.md`.

## Your Role

You are modifying an existing local Hoop Flick repository opened in VS Code. You have direct access to the repository files. Inspect them yourself; do not ask the user to paste files already present in the workspace.

The user will provide one or more requested changes. Implement only those requested changes and the smallest necessary supporting fixes.

## Before Editing

1. Read `PROJECT_CONTEXT.md`, `DECISIONS.md` and `TASKS.md`.
2. Inspect the actual relevant source files.
3. Treat current code as the source of truth if documentation is stale.
4. Check `git status` and preserve unrelated user changes.
5. Briefly state which files/functions you expect to touch.

Do not begin with a rewrite proposal. Do not migrate the project to a framework or add dependencies unless explicitly requested and justified by a platform requirement.

## Implementation Rules

- Make targeted edits using existing helpers and patterns.
- Do not silently change game feel while working on visuals or UI.
- Do not alter collision/scoring geometry for cosmetic effects.
- Keep new UI responsive, safe-area-aware and usable on short mobile screens.
- Add both Turkish and English translations for user-facing text.
- Keep raw YouTube Playables SDK access inside `playablesBridge.js`.
- Preserve local fallback behavior.
- Keep animation loop creation guarded against duplicates.
- Preserve platform pause, user pause and audio-authority rules.
- Do not reintroduce removed features or skins because they appear in old notes.
- Avoid drive-by cleanup and formatting of unrelated code.

## Verification Expectations

Run the strongest checks available without inventing results. At minimum:

- Perform syntax/static checks appropriate to the changed JavaScript/CSS/HTML.
- Serve the project locally when browser behavior must be verified.
- Exercise the directly changed flow.
- Exercise at least one adjacent regression flow.
- Check for console errors.
- For responsive UI changes, test representative mobile width and short-height conditions.

If browser automation or the YouTube Developer Portal is unavailable, say exactly what remains for the user to verify manually.

## Response Format After Work

Return a concise report with:

### Implemented

- What changed and why.

### Files Changed

- File names and important functions/sections.

### Verification

- Commands/checks/tests actually run and their outcomes.

### Manual Checks Remaining

- Real-device or Playables portal checks still required.

### Documentation

- Update the Markdown context/task files if the implementation changes their accuracy.

## Reusable Task Template

The user may append a request in this form:

```text
REQUEST:
[Describe the desired behavior.]

ACCEPTANCE CRITERIA:
- [Observable result 1]
- [Observable result 2]

CONSTRAINTS:
- Preserve existing architecture and unrelated gameplay.
- Do not change physics/collision unless explicitly required.
- Keep TR/EN and mobile behavior consistent.

VERIFICATION:
- Test the changed flow.
- Test one adjacent regression flow.
- Report exact files/functions changed.
```

