import { Hono } from 'hono'
import { logger } from 'hono/logger'
import health from './src/routes/health'
import badges from './src/routes/badges'
import { errorHandler } from './src/middleware/error'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', errorHandler)

// Routes
app.route('/health', health)
app.route('/api/badges', badges)

// Default route
app.get('/', (c) => c.json({ message: 'Welcome to the Badge API' }))

// Test error handling
app.get('/test-error', () => {
  throw new Error('Test error handling')
})

export default app