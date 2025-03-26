# Bun Frontend Migration Task

## Current Status
- Created feature branch `feature/bun-frontend`
- Modified `frontend/package.json` to use Bun for all scripts
- Added `nitro: { preset: 'bun' }` to Nuxt config
- Created root `package.json` with workspaces and scripts
- Installed dependencies with Bun
- Removed conflicting vite.config.ts
- Added watcher workarounds for Bun compatibility

## Known Issues & Solutions
- Server giving 503 Service Unavailable
  - Added file watcher polling workaround based on GitHub issue #31289
- Storybook compatibility warnings with version 8.6.10
- TypeScript configuration issues

## Next Steps
- Test with the file watcher workarounds
- If still not working, try downgrading Nuxt to 3.15.4 which has better Bun compatibility
- Create a fallback script to easily switch between Bun and PNPM
- Test individual components (Nuxt core, Storybook, etc.) to isolate issues

## Performance Metrics to Gather
- Startup time: PNPM vs Bun
- Build time: PNPM vs Bun
- Dev server reload times
- Memory usage

## Research Findings
- Nuxt 3.16.0 has known issues with Bun (GitHub issue #31289)
- Workarounds include:
  - Using `watchers: { chokidar: { usePolling: true } }`
  - Using `nitro: { watchOptions: { usePolling: true } }`
  - Possible downgrade to Nuxt 3.15.4 if needed
- Some users have reported success with these workarounds
- May need to consider using PNPM for frontend and Bun for backend if issues persist

## Notes
- Storybook 8.6.10 has compatibility issues with @nuxtjs/storybook@8.3.3
- Need to ensure tsconfig.json is properly configured for Bun 