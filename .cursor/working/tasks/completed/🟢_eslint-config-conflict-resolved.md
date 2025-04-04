# ESLint Config Conflict - NX Plugin Error

## Error Messages
- NX Error: `Failed to process project graph.`
- Plugin Error: `An error occurred while processing files for the @nx/eslint/plugin plugin`
- Specific Error: `frontend/.eslintrc.json: Failed to load config "plugin:vue/vue3-recommended" to extend from.`
- Reference: `Referenced from: /Users/joeczarnecki/Code/rollercoaster.dev/platform/frontend/.eslintrc.json`

## Recent Changes
- Consolidated ESLint configuration from `frontend/.eslintrc.json` into the root `eslint.config.mjs`.
- Attempted to delete `frontend/.eslintrc.json` multiple times using various methods (`delete_file` tool, `rm` command).
- Installed ESLint Vue/TS plugins at the root level.
- Updated root `eslint.config.mjs` to include Vue-specific parsing and rules.
- Updated `nuxt.config.ts` manifest link from `/site.webmanifest` to `/manifest`.

## Potentially Involved Files
- `eslint.config.mjs` (Root ESLint config)
- `frontend/.eslintrc.json` (Conflicting legacy config - should be gone)
- `nx.json` (NX configuration, specifically the ESLint plugin section)
- `package.json` (Root dependencies)
- `frontend/package.json` (Frontend dependencies)
- Potentially NX cache directories (`.nx/cache` or `node_modules/.cache/nx`)

## Current State
- The root `eslint.config.mjs` is correctly configured for Vue+TS.
- The `frontend/.eslintrc.json` *should* be deleted, but the NX plugin still references it when running `pnpm dev` from within `frontend`.
- Running the root `pnpm dev` script (which uses `./scripts/dev.sh`) *appears* to succeed in starting the frontend *sometimes* (based on recent logs), but the underlying `pnpm nx run frontend:serve` still fails when run directly or potentially intermittently.
- The `/site.webmanifest` warning was addressed by changing the link in `nuxt.config.ts` to `/manifest`.

## Investigation Plan
1.  **Forcefully Verify File Deletion:** Use a robust terminal command to ensure `frontend/.eslintrc.json` does not exist, checking hidden files.
2.  **Clear NX Cache:** Remove any potentially stale cache data that might be causing NX to remember the old configuration.
3.  **Inspect `nx.json`:** Review the ESLint plugin configuration in `nx.json` to ensure it's not explicitly targeting the deleted file.
4.  **Re-run `pnpm install`:** Ensure all dependencies are correctly linked after config changes.
5.  **Attempt `pnpm nx run frontend:serve` directly:** Test if clearing the cache and verifying deletion resolved the specific NX command failure.

## Hypothesis
The primary hypothesis is that either:
A) The `frontend/.eslintrc.json` file is somehow persisting or being recreated, despite delete attempts.
B) NX's caching mechanism is holding onto outdated project graph information that still references the deleted file.

## Proposed Debug Steps
See Investigation Plan.

## Investigation Log
- **Sequence:** 1
- **Action:** Verified `frontend/.eslintrc.json` does not exist using `ls -la frontend | grep -i eslintrc`.
- **Result:** Command exited with code 1, confirming file absence.
- **Sequence:** 2
- **Action:** Cleared NX cache using `rm -rf .nx/cache node_modules/.cache/nx`.
- **Result:** Cache directories removed.
- **Sequence:** 3
- **Action:** Inspected `nx.json`.
- **Result:** ESLint plugin config looks correct, no explicit path to old file.
- **Sequence:** 4
- **Action:** Ran `pnpm install`.
- **Result:** Completed successfully.
- **Sequence:** 5
- **Action:** Ran `pnpm nx run frontend:serve` directly.
- **Result:** Command started successfully in the background without the previous NX graph processing error. **ESLint/NX Conflict Resolved.**
- **Sequence:** 6
- **Observation:** New warnings appeared during `nuxt dev` startup:
    - `WARN [nuxt] Failed to stringify dev server logs... DevalueError: Cannot stringify a function.`
    - `WARN [Vue Router warn]: No match found for location with path "/manifest"`
- **Next Step:** Focus on resolving the `/manifest` routing warning.
- **Sequence:** 7
- **Action:** Cleared Nuxt cache (`rm -rf frontend/.nuxt`).
- **Result:** Directory removed.
- **Sequence:** 8
- **Action:** Attempted to clear Vite cache (`rm -rf node_modules/.vite`).
- **Result:** Command executed (directory may or may not have existed).
- **Sequence:** 9
- **Action:** Restarted frontend server (`pnpm nx run frontend:serve`).
- **Result:** Server restarted. **`/manifest` warning resolved.**

---
**Status:** RESOLVED 