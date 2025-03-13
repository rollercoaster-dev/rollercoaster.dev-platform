import { Hono } from 'hono';
import { errorHandler } from './middleware/error';
import badgeRoutes from './routes/badges';
import health from './routes/health';

export const router = new Hono();

// Add middleware
router.use('*', errorHandler);

// Add routes
router.get('/', (c) => c.text('Hello from atBadges API!'));
router.route('/api/health', health);
router.route('/api/badges', badgeRoutes); 