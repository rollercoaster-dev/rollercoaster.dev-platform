import { Hono } from 'hono';

export const router = new Hono();

// Add routes here
router.get('/', (c) => c.text('Hello from atBadges API!')); 