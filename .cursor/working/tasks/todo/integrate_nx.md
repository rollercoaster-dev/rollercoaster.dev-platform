# Task: Integrate Nx into pnpm Monorepo

**Goal:** Add Nx to the existing pnpm monorepo to improve task running, caching, and potentially Docker build efficiency.

**Status:** To Do

**Estimated Time:** 1-2 Pomodoros (25-50 minutes) - Initial setup & basic task config.

**Steps:**

1.  [ ] **Add Nx Dependency:** Install `nx` as a dev dependency at the workspace root using `pnpm add -D -w nx`.
2.  [ ] **Initialize Nx Workspace:** Run `npx nx init` and follow prompts. Review generated `nx.json` and `project.json` files.
3.  [ ] **Configure `frontend` Tasks:**
    *   Verify/create `frontend/project.json`.
    *   Define `build` target (e.g., using `pnpm --filter=frontend run build`).
    *   Define `serve`/`dev` target (e.g., using `pnpm --filter=frontend run dev`).
    *   Define other relevant targets (e.g., `test`).
4.  [ ] **Configure `backend` Tasks:**
    *   Verify/create `backend/project.json`.
    *   Define `build` target (e.g., using `bun run build` within backend context).
    *   Define `serve`/`start` target (e.g., using `bun run index.ts` or `bun run start`).
    *   Define other relevant targets.
5.  [ ] **Configure `shared` Tasks (if any):** Define any necessary build/test targets for the shared library.
6.  [ ] **(Optional) Configure Docker Tasks:**
    *   Add `docker-build` target to `frontend/project.json` (runs `docker build -f frontend/Dockerfile .`).
    *   Add `docker-build` target to `backend/project.json` (runs `docker build -f backend/Dockerfile .`).
7.  [ ] **Test Nx Commands:** Verify core commands (`nx build frontend`, `nx build backend`, `nx affected --target=build`) work.

**Notes:**
*   Ensure Nx configuration respects the use of pnpm for frontend tasks and Bun for backend tasks.
*   May need to install `@nx/workspace` or `@nx/js` plugins if not added automatically by `nx init`. 