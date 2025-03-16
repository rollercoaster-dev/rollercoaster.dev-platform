import { initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { ZodError } from 'zod';

/**
 * Context type for tRPC procedures
 */
export interface CreateContextOptions {
  // Add any context options here
}

/**
 * Creates context for incoming requests
 */
export const createContext = async (opts: CreateContextOptions) => {
  return {
    // Add context properties here
  };
};

/**
 * Initialize tRPC backend
 */
const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Export type for badge-engine client
 */
export type AppRouter = ReturnType<typeof router>; 