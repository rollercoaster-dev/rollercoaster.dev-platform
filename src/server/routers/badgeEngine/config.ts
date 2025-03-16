import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@/server/context';
import { type AppRouter } from '@/server/trpc';
import superjson from 'superjson';

// Default to localhost:3001 for development
const BADGE_ENGINE_URL = process.env.BADGE_ENGINE_URL || 'http://localhost:3001/api/trpc';

/**
 * Configuration for the badge-engine tRPC client
 */
export const badgeEngineClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: BADGE_ENGINE_URL,
      // Optional: configure request headers
      headers() {
        return {
          // Add any required headers (e.g., authorization) here
        };
      },
    }),
  ],
}); 