import { z } from 'zod';
import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import { badgeEngineService } from '../../services/badgeEngineService';
import { BadgeStatus } from '../../../../shared/types/badge';

// Zod schema for badge requirements
const badgeRequirementSchema = z.object({
  id: z.string(),
  description: z.string(),
  completed: z.boolean(),
});

// Zod schema for creating a badge
const createBadgeSchema = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  status: z.nativeEnum(BadgeStatus).optional(),
  requirements: z.array(badgeRequirementSchema),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
});

// Zod schema for updating badge progress
const updateBadgeProgressSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  requirements: z.array(z.object({
    id: z.string(),
    completed: z.boolean(),
  })).optional(),
});

// Zod schema for updating badge details
const updateBadgeSchema = createBadgeSchema.partial();

export const badgeRouter = router({
  // Get all badges
  getAll: publicProcedure
    .query(async () => {
      return badgeEngineService.getAllBadges();
    }),

  // Get a single badge by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return badgeEngineService.getBadge(input.id);
    }),

  // Create a new badge
  create: publicProcedure
    .input(createBadgeSchema)
    .mutation(async ({ input }) => {
      return badgeEngineService.createBadge(input);
    }),

  // Update an existing badge
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: updateBadgeSchema,
    }))
    .mutation(async ({ input }) => {
      return badgeEngineService.updateBadge(input.id, input.data);
    }),

  // Update badge progress
  updateProgress: publicProcedure
    .input(z.object({
      id: z.string(),
      data: updateBadgeProgressSchema,
    }))
    .mutation(async ({ input }) => {
      return badgeEngineService.updateBadgeProgress(input.id, input.data);
    }),

  // Delete a badge
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return badgeEngineService.deleteBadge(input.id);
    }),

  // Check badge-engine availability
  checkAvailability: publicProcedure
    .query(async () => {
      return badgeEngineService.isAvailable();
    }),
}); 