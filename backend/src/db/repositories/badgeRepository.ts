import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/db'
import { badges, badgeRequirements } from '@/db/schema'
import type { Badge, BadgeRequirement, CreateBadgeDto, UpdateBadgeProgressDto } from '@/types/badge'
import { BadgeStatus } from '@/types/badge'

/**
 * Repository for badge operations
 * Provides methods to interact with the badge database
 */
export const badgeRepository = {
  /**
   * Get all badges
   */
  async getAllBadges(): Promise<Badge[]> {
    try {
      // Query badges table
      const badgeRows = await db.select().from(badges)
      
      // For each badge, get its requirements
      const result = await Promise.all(
        badgeRows.map(async (badge) => {
          const requirements = await db
            .select()
            .from(badgeRequirements)
            .where(eq(badgeRequirements.badgeId, badge.id))
          
          // Map to Badge type
          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            content: badge.content ?? undefined,
            progress: badge.progress,
            status: badge.status as Badge['status'],
            requirements: requirements.map(req => ({
              id: req.id,
              description: req.description,
              completed: req.completed
            })),
            createdAt: badge.createdAt.toISOString(),
            updatedAt: badge.updatedAt.toISOString(),
            startDate: badge.startDate ?? undefined,
            targetDate: badge.targetDate ?? undefined,
            externalId: badge.externalId ?? undefined,
            externalSource: badge.externalSource ?? undefined
          }
        })
      )
      
      return result
    } catch (error) {
      console.error('Error getting all badges:', error)
      throw new Error('Failed to get badges from database')
    }
  },
  
  /**
   * Get a badge by ID
   */
  async getBadgeById(id: string): Promise<Badge | null> {
    try {
      // Query badge by ID
      const badge = await db
        .select()
        .from(badges)
        .where(eq(badges.id, id))
        .limit(1)
      
      if (badge.length === 0) {
        return null
      }
      
      // Get badge requirements
      const requirements = await db
        .select()
        .from(badgeRequirements)
        .where(eq(badgeRequirements.badgeId, id))
      
      return {
        id: badge[0].id,
        name: badge[0].name,
        description: badge[0].description,
        content: badge[0].content ?? undefined,
        progress: badge[0].progress,
        status: badge[0].status as Badge['status'],
        requirements: requirements.map(req => ({
          id: req.id,
          description: req.description,
          completed: req.completed
        })),
        createdAt: badge[0].createdAt.toISOString(),
        updatedAt: badge[0].updatedAt.toISOString(),
        startDate: badge[0].startDate ?? undefined,
        targetDate: badge[0].targetDate ?? undefined,
        externalId: badge[0].externalId ?? undefined,
        externalSource: badge[0].externalSource ?? undefined
      }
    } catch (error) {
      console.error(`Error getting badge with ID ${id}:`, error)
      throw new Error(`Failed to get badge ${id} from database`)
    }
  },
  
  /**
   * Create a new badge
   */
  async createBadge(badgeData: CreateBadgeDto, externalId?: string, externalSource?: string): Promise<Badge> {
    try {
      const badgeId = uuidv4()
      const now = new Date()
      
      // Create badge in transaction to ensure both badge and requirements are created
      const [newBadge] = await db.transaction(async (tx) => {
        // Insert badge
        const badge = await tx
          .insert(badges)
          .values({
            id: badgeId,
            name: badgeData.name,
            description: badgeData.description,
            content: badgeData.content || null,
            progress: badgeData.progress ?? 0,
            status: badgeData.status?.toString() ?? BadgeStatus.NOT_STARTED.toString(),
            startDate: badgeData.startDate || null,
            targetDate: badgeData.targetDate || null,
            createdAt: now,
            updatedAt: now,
            externalId: externalId || null,
            externalSource: externalSource || null
          })
          .returning()
        
        // Insert requirements
        if (badgeData.requirements && badgeData.requirements.length > 0) {
          await tx
            .insert(badgeRequirements)
            .values(
              badgeData.requirements.map(req => ({
                id: req.id || uuidv4(),
                badgeId: badgeId,
                description: req.description,
                completed: req.completed,
                createdAt: now,
                updatedAt: now
              }))
            )
        }
        
        return badge
      })
      
      // Return the created badge with requirements
      return {
        id: newBadge.id,
        name: newBadge.name,
        description: newBadge.description,
        content: newBadge.content ?? undefined,
        progress: newBadge.progress,
        status: newBadge.status as Badge['status'],
        requirements: badgeData.requirements || [],
        createdAt: newBadge.createdAt.toISOString(),
        updatedAt: newBadge.updatedAt.toISOString(),
        startDate: newBadge.startDate ?? undefined,
        targetDate: newBadge.targetDate ?? undefined,
        externalId: newBadge.externalId ?? undefined,
        externalSource: newBadge.externalSource ?? undefined
      }
    } catch (error) {
      console.error('Error creating badge:', error)
      throw new Error('Failed to create badge in database')
    }
  },
  
  /**
   * Update a badge
   */
  async updateBadge(id: string, badgeData: Partial<Badge>): Promise<Badge | null> {
    try {
      // Check if badge exists
      const existingBadge = await this.getBadgeById(id)
      if (!existingBadge) {
        return null
      }
      
      const now = new Date()
      
      // Update badge in transaction
      await db.transaction(async (tx) => {
        // Update badge
        await tx
          .update(badges)
          .set({
            name: badgeData.name !== undefined ? badgeData.name : undefined,
            description: badgeData.description !== undefined ? badgeData.description : undefined,
            content: badgeData.content !== undefined ? badgeData.content : undefined,
            progress: badgeData.progress !== undefined ? badgeData.progress : undefined,
            status: badgeData.status !== undefined ? badgeData.status : undefined,
            startDate: badgeData.startDate !== undefined ? badgeData.startDate : undefined,
            targetDate: badgeData.targetDate !== undefined ? badgeData.targetDate : undefined,
            updatedAt: now,
            externalId: badgeData.externalId !== undefined ? badgeData.externalId : undefined,
            externalSource: badgeData.externalSource !== undefined ? badgeData.externalSource : undefined
          })
          .where(eq(badges.id, id))
        
        // Update requirements if provided
        if (badgeData.requirements) {
          // First, remove existing requirements
          await tx
            .delete(badgeRequirements)
            .where(eq(badgeRequirements.badgeId, id))
          
          // Then insert new requirements
          if (badgeData.requirements.length > 0) {
            await tx
              .insert(badgeRequirements)
              .values(
                badgeData.requirements.map((req: BadgeRequirement) => ({
                  id: req.id || uuidv4(),
                  badgeId: id,
                  description: req.description,
                  completed: req.completed,
                  createdAt: now,
                  updatedAt: now
                }))
              )
          }
        }
      })
      
      // Get and return the updated badge
      return await this.getBadgeById(id)
    } catch (error) {
      console.error(`Error updating badge with ID ${id}:`, error)
      throw new Error(`Failed to update badge ${id} in database`)
    }
  },
  
  /**
   * Update badge progress
   */
  async updateBadgeProgress(id: string, progressData: UpdateBadgeProgressDto): Promise<Badge | null> {
    try {
      // Check if badge exists
      const existingBadge = await this.getBadgeById(id)
      if (!existingBadge) {
        return null
      }
      
      const now = new Date()
      
      // Determine the badge status based on progress
      let status = existingBadge.status;
      if (progressData.progress >= 100) {
        status = BadgeStatus.COMPLETED;
      } else if (progressData.progress > 0) {
        status = BadgeStatus.IN_PROGRESS;
      } else {
        status = BadgeStatus.NOT_STARTED;
      }
      
      // Update badge in transaction
      await db.transaction(async (tx) => {
        // Update badge progress and status
        await tx
          .update(badges)
          .set({
            progress: progressData.progress,
            status: status,
            updatedAt: now
          })
          .where(eq(badges.id, id))
        
        // Update requirements if provided
        if (progressData.requirements && progressData.requirements.length > 0) {
          for (const req of progressData.requirements) {
            await tx
              .update(badgeRequirements)
              .set({
                completed: req.completed,
                updatedAt: now
              })
              .where(
                and(
                  eq(badgeRequirements.badgeId, id),
                  eq(badgeRequirements.id, req.id)
                )
              )
          }
        }
      })
      
      // Get and return the updated badge
      return await this.getBadgeById(id)
    } catch (error) {
      console.error(`Error updating badge progress for ID ${id}:`, error)
      throw new Error(`Failed to update badge progress for ${id} in database`)
    }
  },
  
  /**
   * Delete a badge
   */
  async deleteBadge(id: string): Promise<boolean> {
    try {
      // Check if badge exists
      const existingBadge = await this.getBadgeById(id)
      if (!existingBadge) {
        return false
      }
      
      // Delete badge (requirements will be deleted by cascade)
      await db
        .delete(badges)
        .where(eq(badges.id, id))
      
      return true
    } catch (error) {
      console.error(`Error deleting badge with ID ${id}:`, error)
      throw new Error(`Failed to delete badge ${id} from database`)
    }
  }
}