import { router } from '@/server/trpc';
import { healthRouter } from '@/server/routers/health';
import { badgeEngineRouter } from '@/server/routers/badgeEngine/router';

export const appRouter = router({
  health: healthRouter,
  badgeEngine: badgeEngineRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter; 