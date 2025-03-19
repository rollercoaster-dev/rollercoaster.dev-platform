import { z } from 'zod';
import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import { badgesApiService } from '../../services/badgesApiService';
import { badgeRepository } from '../../db/repositories/badgeRepository';
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

// Check if bun-badges is available
const useBadgesApi = async () => {
  try {
    return await badgesApiService.isAvailable();
  } catch (error) {
    console.error('Error checking bun-badges availability:', error);
    return false;
  }
};

export const badgeRouter = router({
  // Get all badges
  getAll: publicProcedure
    .query(async () => {
      // First try to get badges from local database
      const localBadges = await badgeRepository.getAllBadges();
      
      // Check if bun-badges API is available
      const apiAvailable = await useBadgesApi();
      
      if (apiAvailable) {
        try {
          // Get badges from bun-badges
          const apiBadges = await badgesApiService.getAllBadges();
          
          // Return merged data
          return localBadges.map(localBadge => {
            if (localBadge.externalId) {
              const apiBadge = apiBadges.find(eb => eb.id === localBadge.externalId);
              if (apiBadge) {
                return {
                  ...localBadge,
                  progress: apiBadge.progress,
                  status: apiBadge.status,
                  requirements: apiBadge.requirements,
                };
              }
            }
            return localBadge;
          });
        } catch (error) {
          console.error('Error fetching badges from bun-badges:', error);
          // Fall back to local database badges
          return localBadges;
        }
      }
      
      // Default to local database badges
      return localBadges;
    }),

  // Get a single badge by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Get badge from local database
      const localBadge = await badgeRepository.getBadgeById(input.id);
      
      if (!localBadge) {
        throw new Error(`Badge with ID ${input.id} not found`);
      }
      
      // Check if bun-badges API is available and badge has external ID
      const apiAvailable = await useBadgesApi();
      
      if (apiAvailable && localBadge.externalId) {
        try {
          // Get badge from bun-badges
          const apiBadge = await badgesApiService.getBadge(localBadge.externalId);
          
          // Return merged data
          return {
            ...localBadge,
            progress: apiBadge.progress,
            status: apiBadge.status,
            requirements: apiBadge.requirements,
          };
        } catch (error) {
          console.error(`Error fetching badge ${input.id} from bun-badges:`, error);
          // Fall back to local database badge
        }
      }
      
      return localBadge;
    }),

  // Create a new badge
  create: publicProcedure
    .input(createBadgeSchema)
    .mutation(async ({ input }) => {
      let externalId: string | undefined = undefined;
      let externalSource: string | undefined = undefined;
      
      // Check if bun-badges API is available
      const apiAvailable = await useBadgesApi();
      
      // Create badge in bun-badges if available
      if (apiAvailable) {
        try {
          const apiBadge = await badgesApiService.createBadge(input);
          externalId = apiBadge.id;
          externalSource = 'bun-badges';
        } catch (error) {
          console.error('Error creating badge in bun-badges:', error);
          // Continue with local badge creation if bun-badges fails
        }
      }
      
      // Create badge in local database
      return badgeRepository.createBadge(input, externalId, externalSource);
    }),

  // Update an existing badge
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: updateBadgeSchema,
    }))
    .mutation(async ({ input }) => {
      // Get badge from local database
      const existingBadge = await badgeRepository.getBadgeById(input.id);
      
      if (!existingBadge) {
        throw new Error(`Badge with ID ${input.id} not found`);
      }
      
      // Check if bun-badges API is available and badge has external ID
      const apiAvailable = await useBadgesApi();
      
      if (apiAvailable && existingBadge.externalId) {
        try {
          // Update badge in bun-badges
          await badgesApiService.updateBadge(existingBadge.externalId, input.data);
        } catch (error) {
          console.error(`Error updating badge ${input.id} in bun-badges:`, error);
          // Continue with local database update if bun-badges fails
        }
      }
      
      // Update badge in local database
      const updatedBadge = await badgeRepository.updateBadge(input.id, input.data);
      
      if (!updatedBadge) {
        throw new Error(`Failed to update badge ${input.id}`);
      }
      
      return updatedBadge;
    }),

  // Update badge progress
  updateProgress: publicProcedure
    .input(z.object({
      id: z.string(),
      data: updateBadgeProgressSchema,
    }))
    .mutation(async ({ input }) => {
      // Get badge from local database
      const existingBadge = await badgeRepository.getBadgeById(input.id);
      
      if (!existingBadge) {
        throw new Error(`Badge with ID ${input.id} not found`);
      }
      
      // Check if bun-badges API is available and badge has external ID
      const apiAvailable = await useBadgesApi();
      
      if (apiAvailable && existingBadge.externalId) {
        try {
          // Update badge progress in bun-badges
          await badgesApiService.updateBadgeProgress(existingBadge.externalId, input.data);
        } catch (error) {
          console.error(`Error updating badge ${input.id} progress in bun-badges:`, error);
          // Continue with local database update if bun-badges fails
        }
      }
      
      // Update badge progress in local database
      const updatedBadge = await badgeRepository.updateBadgeProgress(input.id, input.data);
      
      if (!updatedBadge) {
        throw new Error(`Failed to update badge progress for ${input.id}`);
      }
      
      return updatedBadge;
    }),

  // Delete a badge
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Get badge from local database
      const existingBadge = await badgeRepository.getBadgeById(input.id);
      
      if (!existingBadge) {
        throw new Error(`Badge with ID ${input.id} not found`);
      }
      
      // Check if bun-badges API is available and badge has external ID
      const apiAvailable = await useBadgesApi();
      
      if (apiAvailable && existingBadge.externalId) {
        try {
          // Delete badge from bun-badges
          await badgesApiService.deleteBadge(existingBadge.externalId);
        } catch (error) {
          console.error(`Error deleting badge ${input.id} from bun-badges:`, error);
          // Continue with local database deletion if bun-badges fails
        }
      }
      
      // Delete badge from local database
      const success = await badgeRepository.deleteBadge(input.id);
      
      if (!success) {
        throw new Error(`Failed to delete badge ${input.id}`);
      }
      
      return { success: true };
    }),

  // Check bun-badges API availability
  checkApiAvailability: publicProcedure
    .query(async () => {
      return useBadgesApi();
    }),
});