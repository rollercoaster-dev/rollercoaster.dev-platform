import { Hono } from 'hono'
import { checkDatabaseConnection } from '@/db'
import { badgeEngineService } from '@/services/badgeEngineService'

const health = new Hono()

health.get('/', async (c) => {
  // Check database connection
  let dbStatus = 'unknown'
  try {
    const dbConnected = await checkDatabaseConnection()
    dbStatus = dbConnected ? 'connected' : 'disconnected'
  } catch (error) {
    console.error('Database health check error:', error)
    dbStatus = 'error'
  }

  // Check badge-engine availability
  let badgeEngineStatus = 'unknown'
  try {
    const badgeEngineAvailable = await badgeEngineService.isAvailable()
    badgeEngineStatus = badgeEngineAvailable ? 'available' : 'unavailable'
  } catch (error) {
    console.error('Badge-engine health check error:', error)
    badgeEngineStatus = 'error'
  }

  return c.json({
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.1',
    database: {
      status: dbStatus
    },
    integrations: {
      badgeEngine: badgeEngineStatus
    }
  })
})

export default health 