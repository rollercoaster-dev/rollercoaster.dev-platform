import { z } from 'zod';
import { router, publicProcedure } from '@/server/trpc';
import { badgeEngineClient } from './config';
import { BadgeStatus } from '@shared/types/badge';

/**
 * Badge-engine router that proxies requests to the badge-engine service
 */
export const badgeEngineRouter = router({
  // Get all badges
  getAll: publicProcedure
    .query(async () => {
      return badgeEngineClient.badge.getAll.query();
    }),

  // Get a single badge by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return badgeEngineClient.badge.getById.query(input);
    }),

  // Create a new badge
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      content: z.string().optional(),
      progress: z.number().min(0).max(100).optional(),
      status: z.nativeEnum(BadgeStatus).optional(),
      requirements: z.array(z.object({
        id: z.string(),
        description: z.string(),
        completed: z.boolean(),
      })),
      startDate: z.string().optional(),
      targetDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return badgeEngineClient.badge.create.mutate(input);
    }),

  // Update an existing badge
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string(),
        description: z.string(),
        content: z.string(),
        progress: z.number().min(0).max(100),
        status: z.nativeEnum(BadgeStatus),
        requirements: z.array(z.object({
          id: z.string(),
          description: z.string(),
          completed: z.boolean(),
        })),
        startDate: z.string(),
        targetDate: z.string(),
      }).partial(),
    }))
    .mutation(async ({ input }) => {
      return badgeEngineClient.badge.update.mutate(input);
    }),

  // Update badge progress
  updateProgress: publicProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        progress: z.number().min(0).max(100).optional(),
        requirements: z.array(z.object({
          id: z.string(),
          completed: z.boolean(),
        })).optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return badgeEngineClient.badge.updateProgress.mutate(input);
    }),

  // Delete a badge
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return badgeEngineClient.badge.delete.mutate(input);
    }),

  // Check badge-engine availability
  checkAvailability: publicProcedure
    .query(async () => {
      try {
        await badgeEngineClient.health.check.query();
        return true;
      } catch {
        return false;
      }
    }),
}); 