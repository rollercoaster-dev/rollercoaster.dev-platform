# Hybrid Monorepo: PNPM Workspaces with Bun Runtime for Backend

## Research Summary

It is indeed possible to create a PNPM-managed monorepo while still using Bun as the runtime for the backend. This approach gives us the best of both worlds:

1. PNPM's efficient workspace management for package sharing and monorepo features
2. Bun's superior performance for backend runtime execution

## Key Implementation Approaches

### Option 1: PNPM + Bun Runtime (Simple Approach)

1. **Setup PNPM Workspaces**:
   - Use PNPM's workspace configuration in root package.json
   - Manage all dependencies through PNPM

2. **Run Backend with Bun**:
   - Use package.json scripts that explicitly call Bun
   - Example: `"dev:backend": "cd backend && bun run --watch index.ts"`

3. **Implementation Specifics**:
   ```json
   // Root package.json
   {
     "name": "atbadges",
     "private": true,
     "workspaces": [
       "frontend",
       "backend",
       "shared"
     ],
     "scripts": {
       "dev:frontend": "cd frontend && pnpm run dev",
       "dev:backend": "cd backend && bun run --watch index.ts",
       "dev": "concurrently \"pnpm run dev:frontend\" \"pnpm run dev:backend\""
     }
   }
   ```

### Option 2: PNPM + Turborepo + Bun Runtime (Advanced Approach)

Several developers have successfully created setups with:
- PNPM for package management
- Turborepo for monorepo orchestration
- Bun for running backend services

As detailed in the article "Running both nodejs and bun apps in turborepo", this requires:

1. **Dual Workspace Configuration**:
   - PNPM workspaces configuration for PNPM management
   - Workspaces in root package.json for Bun compatibility

2. **Helper Scripts**:
   - May need helper scripts to register workspaces with Bun
   - Package linking between workspaces

3. **Special Considerations**:
   - Bun doesn't fully support all workspace protocols, but it works with `workspace:*`
   - May need special handling for inter-package dependencies

## Known Issues & Workarounds

1. **Workspace Recognition**:
   - Some users report that Bun may fail to recognize workspaces
   - Workaround: Delete `bun.lockb` and re-run `bun install`

2. **Directory Structure Requirements**:
   - Bun seems to prefer packages under a `packages/` directory
   - Precise naming and structure can be important for compatibility

3. **Package Naming Conventions**:
   - Avoid using `@` in package names for best compatibility
   - Follow NPM naming guidelines: lowercase, one word, may contain hyphens/underscores

## Recommended Approach for Our Project

Based on the research, the simplest approach would be:

1. **Keep the current separate project structure**
2. **Implement better shared code management** via:
   - Create proper shared packages
   - Establish clear versioning for shared code

3. **Improve development workflow**:
   - Enhance development scripts to run both services with a single command
   - Use concurrently or similar tools to run both services

## Next Steps for Exploration

If we want to move forward with a hybrid PNPM+Bun monorepo:

1. Create a test branch to try the simplest PNPM workspace + Bun runtime approach
2. Test interoperability of shared packages between frontend and backend 
3. Evaluate any performance impact on development workflow
4. Create a more detailed implementation plan if the approach proves viable

## References

1. [Running both nodejs and bun apps in turborepo](https://dev.to/0xahmad/running-both-nodejs-and-bun-apps-in-turborepo-33id)
2. [Bun issue #5413: Workspaces recognition](https://github.com/oven-sh/bun/issues/5413)
3. [Bun workspace documentation](https://bun.sh/guides/install/workspaces)
4. [PNPM workspace documentation](https://pnpm.io/workspaces) 