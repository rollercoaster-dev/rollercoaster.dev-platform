import type { inferAsyncReturnType } from '@trpc/server';
import { db } from '../db';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext() {
  return {
    db,
    // We'll add auth and other context here later
  };
}

export type Context = inferAsyncReturnType<typeof createContext>; 