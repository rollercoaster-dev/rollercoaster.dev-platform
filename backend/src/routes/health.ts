import { Hono } from 'hono'

const health = new Hono()

health.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.1'
  })
})

export default health 