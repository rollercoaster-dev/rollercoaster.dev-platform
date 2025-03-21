/**
 * tRPC client for frontend
 * Provides type-safe API communication with the backend
 */
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../backend/src/server/routers';
import { useRuntimeConfig } from 'nuxt/app';

// Function to get the backend URL - defaults to local backend
const getBaseUrl = () => {
  try {
    const config = useRuntimeConfig();
    return config.public.backendUrl || 'http://localhost:3000';
  } catch (e) {
    return 'http://localhost:3000';
  }
};

// Create tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

// Export a hook for Nuxt compatibility
export const useTrpc = () => {
  return trpc;
};
