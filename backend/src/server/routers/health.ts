import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { checkDatabaseConnection } from '../../db';

export const healthRouter = router({
  check: publicProcedure
    .query(async () => {
      const dbStatus = await checkDatabaseConnection();
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected',
      };
    }),
    
  ping: publicProcedure
    .input(z.object({
      message: z.string().optional(),
    }))
    .query(({ input }) => {
      return {
        message: `pong ${input.message ?? ''}`.trim(),
      };
    }),
}); 