import { router } from '../trpc';
import { healthRouter } from './health';
import { badgeRouter } from './badges';

export const appRouter = router({
  health: healthRouter,
  badges: badgeRouter,
  // We'll add more routers here later
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter; 