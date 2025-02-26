import type { Context, MiddlewareHandler } from 'hono'

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const errorHandler: MiddlewareHandler = async (c: Context, next) => {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)

    if (error instanceof APIError) {
      return c.json({
        error: error.message,
        details: error.details,
        status: error.status
      }, error.status)
    }

    // Handle unknown errors
    return c.json({
      error: 'Internal Server Error',
      status: 500
    }, 500)
  }
} 