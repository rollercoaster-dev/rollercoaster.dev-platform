import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createContext } from './server/context';
import { appRouter } from './server/routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}));

// tRPC handler
app.use('/trpc/*', async (c) => {
  const res = await fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
  return res;
});

// Legacy REST endpoints will stay here for now
app.get('/', (c) => c.text('Hello from atBadges API!'));

export default app; 