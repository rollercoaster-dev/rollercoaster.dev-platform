import { Hono } from 'hono'
import { BadgeStatus } from '@/types/badge'
import { badgesApiService } from '@/services/badgesApiService'
import { badgeRepository } from '@/db/repositories/badgeRepository'
import { checkDatabaseConnection } from '@/db'

const badgeRoutes = new Hono()

// Check if bun-badges is available
const useBadgesApi = async () => {
  try {
    return await badgesApiService.isAvailable()
  } catch (error) {
    console.error('Error checking bun-badges availability:', error)
    return false
  }
}

// Get all badges
badgeRoutes.get('/', async (c) => {
  try {
    // Get badges from database
    const badges = await badgeRepository.getAllBadges()

    // Check if bun-badges is available
    const apiAvailable = await useBadgesApi()

    if (apiAvailable) {
      try {
        // Get badges from bun-badges
        const apiBadges = await badgesApiService.getAllBadges()

        // Merge with local badges
        return c.json(badges.map(localBadge => {
          if (localBadge.externalId) {
            const apiBadge = apiBadges.find(eb => eb.id === localBadge.externalId)
            if (apiBadge) {
              // Update the local badge in the database with the latest data from bun-badges
              // This is an asynchronous operation that we don't await to avoid blocking the response
              badgeRepository.updateBadge(localBadge.id, {
                progress: apiBadge.progress,
                status: apiBadge.status,
                requirements: apiBadge.requirements,
                updatedAt: new Date().toISOString()
              }).catch(err => {
                console.error(`Error syncing badge ${localBadge.id} with bun-badges:`, err)
              })

              // Return merged data for response
              return {
                ...localBadge,
                progress: apiBadge.progress,
                status: apiBadge.status,
                requirements: apiBadge.requirements,
              }
            }
          }
          return localBadge
        }))
      } catch (error) {
        console.error('Error fetching badges from bun-badges:', error)
        // Fall back to database badges if bun-badges is unavailable
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
badgeRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Get badge from database
    const badge = await badgeRepository.getBadgeById(id)

    if (!badge) {
      return c.json({ error: 'Badge not found' }, 404)
    }

    // Check if bun-badges is available and badge has external ID
    const apiAvailable = await useBadgesApi()

    if (apiAvailable && badge.externalId) {
      try {
        // Get badge from bun-badges
        const apiBadge = await badgesApiService.getBadge(badge.externalId)

        // Update local badge in database with latest from bun-badges (async operation)
        badgeRepository.updateBadge(badge.id, {
          progress: apiBadge.progress,
          status: apiBadge.status,
          requirements: apiBadge.requirements,
          updatedAt: new Date().toISOString()
        }).catch(err => {
          console.error(`Error syncing badge ${badge.id} with bun-badges:`, err)
        })

        // Merge data for response
        return c.json({
          ...badge,
          progress: apiBadge.progress,
          status: apiBadge.status,
          requirements: apiBadge.requirements,
        })
      } catch (error) {
        console.error(`Error fetching badge ${id} from bun-badges:`, error)
        // Fall back to database badge if bun-badges is unavailable
      }
    }

    return c.json(badge)
  } catch (error) {
    console.error(`Error getting badge ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to get badge' }, 500)
  }
})

// Create new badge
badgeRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    let externalId: string | undefined = undefined
    let externalSource: string | undefined = undefined

    // Check if bun-badges is available
    const apiAvailable = await useBadgesApi()

    // Create badge in bun-badges if available
    if (apiAvailable) {
      try {
        const apiBadge = await badgesApiService.createBadge(body)
        externalId = apiBadge.id
        externalSource = 'bun-badges'
      } catch (error) {
        console.error('Error creating badge in bun-badges:', error)
        // Continue with local badge creation if bun-badges fails
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
badgeRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)

    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }

    // Check if bun-badges is available and badge has external ID
    const apiAvailable = await useBadgesApi()

    if (apiAvailable && existingBadge.externalId) {
      try {
        // Update badge in bun-badges
        await badgesApiService.updateBadge(existingBadge.externalId, body)
      } catch (error) {
        console.error(`Error updating badge ${id} in bun-badges:`, error)
        // Continue with database update if bun-badges fails
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
badgeRoutes.patch('/:id/progress', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)

    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }

    // Check if bun-badges is available and badge has external ID
    const apiAvailable = await useBadgesApi()

    if (apiAvailable && existingBadge.externalId) {
      try {
        // Update badge progress in bun-badges
        await badgesApiService.updateBadgeProgress(existingBadge.externalId, body)
      } catch (error) {
        console.error(`Error updating badge ${id} progress in bun-badges:`, error)
        // Continue with database update if bun-badges fails
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
badgeRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Get badge from database
    const existingBadge = await badgeRepository.getBadgeById(id)

    if (!existingBadge) {
      return c.json({ error: 'Badge not found' }, 404)
    }

    // Check if bun-badges is available and badge has external ID
    const apiAvailable = await useBadgesApi()

    if (apiAvailable && existingBadge.externalId) {
      try {
        // Delete badge from bun-badges
        await badgesApiService.deleteBadge(existingBadge.externalId)
      } catch (error) {
        console.error(`Error deleting badge ${id} from bun-badges:`, error)
        // Continue with database deletion if bun-badges fails
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
badgeRoutes.use('*', async (c, next) => {
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

export default badgeRoutes;