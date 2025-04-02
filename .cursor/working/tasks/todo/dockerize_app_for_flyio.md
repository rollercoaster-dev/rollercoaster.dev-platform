# Task: Dockerize Application for Fly.io Deployment

**Goal:** Create Dockerfiles for the frontend and backend services to enable deployment on Fly.io.

**Status:** In Progress

**Estimated Time:** 1-2 Pomodoros (25-50 minutes) - *Adjustment: This took longer due to debugging workspace issues.*

**Completed Steps:**

1.  [x] **Create Backend Dockerfile (`backend/Dockerfile`)**
    *   Initial attempts faced issues with Bun workspace resolution (`@atbadges/shared` not found during `bun install` or `bun build`).
    *   **Solution:** Modified Dockerfile to run `bun install` from the workspace root, copy necessary workspace manifests (`package.json` for all workspaces, `bun.lock`), and copy shared source code (`shared/index.ts`, `shared/types`) before the build step. Final production stage copies artifacts and root `node_modules`.
    *   **Status:** Local build successful (`docker build -t atbadges/backend:latest -f backend/Dockerfile .`).

2.  [ ] **Create Frontend Dockerfile (`frontend/Dockerfile`)**
    *   Initial attempts faced issues with build command (`nuxt: not found`) and locating build output (`.output` not found).
    *   Several strategies attempted (running install/build in subdirectory, using `pnpm exec`, using `pnpm --filter run build`).
    *   **Learnings:** Standard pnpm Docker practice involves installing/building from the root context. Isolating production dependencies efficiently is key.
    *   **Revised Strategy:** Adopted `pnpm deploy` best practice. Build stage installs all deps at root, filters build, then uses `pnpm --filter=frontend deploy /app/deploy/frontend --prod` to create a clean deployment package. Production stage copies *only* the contents of `/app/deploy/frontend`.
    *   **Status:** Dockerfile updated with `pnpm deploy` strategy. Local build *not yet tested*.

**Next Steps:**

1.  Test the local build of the revised `frontend/Dockerfile` using `docker build -t atbadges/frontend:latest -f frontend/Dockerfile .`.
2.  Proceed with Fly.io setup (`flyctl launch` etc.) once both images build successfully.

**Learnings Logged:**

*   Dockerizing Bun workspaces requires running `bun install` from the root and ensuring all workspace `package.json` files and the root `bun.lock` are present. Bun's build process might require explicit copying of shared source code into the build context.
*   Dockerizing pnpm workspaces benefits from running install/build from the root. `pnpm deploy` is the recommended practice for isolating production artifacts and dependencies for the final Docker stage, leading to smaller, cleaner images.
*   Debugging Docker builds often involves iterative attempts and examining error messages closely (lockfile mismatches, missing files/commands, workspace resolution issues). Adding temporary `ls` commands can help diagnose file structure issues between stages. 