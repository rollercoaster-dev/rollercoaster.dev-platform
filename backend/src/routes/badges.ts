import { Hono } from 'hono'
import { BadgeStatus } from '../../../shared/types/badge'
import { badgeEngineService } from '../services/badgeEngineService'
import { badgeRepository } from '../db/repositories/badgeRepository'
import { checkDatabaseConnection } from '../db'

const badgesRoute = new Hono()

// Check if badge-engine is available
const useBadgeEngine = async () => {
  try {
    return await badgeEngineService.isAvailable()
  } catch (error) {
    console.error('Error checking badge-engine availability:', error)
    return false
  }
}

// Get all badges
badgesRoute.get('/', async (c) => {
  try {
    // Get badges from database
    const badges = await badgeRepository.getAllBadges()
    
    // Check if badge-engine is available
    const engineAvailable = await useBadgeEngine()
    
    if (engineAvailable) {
      try {
        // Get badges from badge-engine
        const engineBadges = await badgeEngineService.getAllBadges()
        
        // Merge with local badges
        return c.json(badges.map(localBadge => {
          if (localBadge.externalId) {
            const engineBadge = engineBadges.find(eb => eb.id === localBadge.externalId)
            if (engineBadge) {
              // Update the local badge in the database with the latest data from badge-engine
              // This is an asynchronous operation that we don't await to avoid blocking the response
              badgeRepository.updateBadge(localBadge.id, {
                progress: engineBadge.progress,
                status: engineBadge.status,
                requirements: engineBadge.requirements,
                updatedAt: new Date().toISOString()
              }).catch(err => {
                console.error(`Error syncing badge ${localBadge.id} with badge-engine:`, err)
              })
              
              // Return merged data for response
              return {
                ...localBadge,
                progress: engineBadge.progress,
                status: engineBadge.status,
                requirements: engineBadge.requirements,
              }
            }
          }
          return localBadge
        }))
      } catch (error) {
        console.error('Error fetching badges from badge-engine:', error)
        // Fall back to database badges if badge-engine is unavailable
        return c.json(badges)
      }
    }
    
    // Default to database badges
    return c.json(badges)
  } catch (error) {
    console.error('Error getting badges:', error)
    return c.json({ error: 'Failed to get badges' }, 500)
  }
})

// Get single badge by ID
badgesRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Get badge from database
    const badge = await badgeRepository.getBadgeById(id)
    
    if (!badge) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Check if badge-engine is available and badge has external ID
    const engineAvailable = await useBadgeEngine()
    
    if (engineAvailable && badge.externalId) {
      try {
        // Get badge from badge-engine
        const engineBadge = await badgeEngineService.getBadge(badge.externalId)
        
        // Update local badge in database with latest from badge-engine (async operation)
        badgeRepository.updateBadge(badge.id, {
          progress: engineBadge.progress,
          status: engineBadge.status,
          requirements: engineBadge.requirements,
          updatedAt: new Date().toISOString()
        }).catch(err => {
          console.error(`Error syncing badge ${badge.id} with badge-engine:`, err)
        })
        
        // Merge data for response
        return c.json({
          ...badge,
          progress: engineBadge.progress,
          status: engineBadge.status,
          requirements: engineBadge.requirements,
        })
      } catch (error) {
        console.error(`Error fetching badge ${id} from badge-engine:`, error)
        // Fall back to database badge if badge-engine is unavailable
      }
    }
    
    return c.json(badge)
  } catch (error) {
    console.error(`Error getting badge ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to get badge' }, 500)
  }
})

// Create new badge
badgesRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    let externalId = null
    let externalSource = null
    
    // Check if badge-engine is available
    const engineAvailable = await useBadgeEngine()
    
    // Create badge in badge-engine if available
    if (engineAvailable) {
      try {
        const engineBadge = await badgeEngineService.createBadge(body)
        externalId = engineBadge.id
        externalSource = 'badge-engine'
      } catch (error) {
        console.error('Error creating badge in badge-engine:', error)
        // Continue with local badge creation if badge-engine fails
      }
    }
    
    // Create badge in database
    const newBadge = await badgeRepository.createBadge(body, externalId, externalSource)
    
    return c.json(newBadge, 201)
  } catch (error) {
    console.error('Error creating badge:', error)
    return c.json({ error: 'Failed to create badge' }, 500)
  }
})

// Update badge
badgesRoute.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)
    
    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Check if badge-engine is available and badge has external ID
    const engineAvailable = await useBadgeEngine()
    
    if (engineAvailable && existingBadge.externalId) {
      try {
        // Update badge in badge-engine
        await badgeEngineService.updateBadge(existingBadge.externalId, body)
      } catch (error) {
        console.error(`Error updating badge ${id} in badge-engine:`, error)
        // Continue with database update if badge-engine fails
      }
    }
    
    // Update badge in database
    const updatedBadge = await badgeRepository.updateBadge(id, body)
    
    if (!updatedBadge) {
      return c.json({ error: 'Failed to update badge' }, 500)
    }
    
    return c.json(updatedBadge)
  } catch (error) {
    console.error(`Error updating badge ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to update badge' }, 500)
  }
})

// Update badge progress
badgesRoute.patch('/:id/progress', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)
    
    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Check if badge-engine is available and badge has external ID
    const engineAvailable = await useBadgeEngine()
    
    if (engineAvailable && existingBadge.externalId) {
      try {
        // Update badge progress in badge-engine
        await badgeEngineService.updateBadgeProgress(existingBadge.externalId, body)
      } catch (error) {
        console.error(`Error updating badge ${id} progress in badge-engine:`, error)
        // Continue with database update if badge-engine fails
      }
    }
    
    // Update badge progress in database
    const updatedBadge = await badgeRepository.updateBadgeProgress(id, body)
    
    if (!updatedBadge) {
      return c.json({ error: 'Failed to update badge progress' }, 500)
    }
    
    return c.json(updatedBadge)
  } catch (error) {
    console.error(`Error updating badge progress ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to update badge progress' }, 500)
  }
})

// Delete badge
badgesRoute.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)
    
    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Check if badge-engine is available and badge has external ID
    const engineAvailable = await useBadgeEngine()
    
    if (engineAvailable && existingBadge.externalId) {
      try {
        // Delete badge from badge-engine
        await badgeEngineService.deleteBadge(existingBadge.externalId)
      } catch (error) {
        console.error(`Error deleting badge ${id} from badge-engine:`, error)
        // Continue with database deletion if badge-engine fails
      }
    }
    
    // Delete badge from database
    const success = await badgeRepository.deleteBadge(id)
    
    if (!success) {
      return c.json({ error: 'Failed to delete badge' }, 500)
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error(`Error deleting badge ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to delete badge' }, 500)
  }
})

// Middleware to check database connection
badgesRoute.use('*', async (c, next) => {
  try {
    const connected = await checkDatabaseConnection()
    if (!connected) {
      return c.json({ error: 'Database connection failed' }, 503)
    }
    await next()
  } catch (error) {
    console.error('Database connection error:', error)
    return c.json({ error: 'Database connection error' }, 503)
  }
})

export default badgesRoute