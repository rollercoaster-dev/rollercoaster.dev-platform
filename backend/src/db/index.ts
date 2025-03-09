import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'
import 'dotenv/config'

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL

// Determine which connection client to use
// Use neon for serverless environments, postgres-js for local development
let client
if (process.env.NODE_ENV === 'production' && connectionString?.includes('neon')) {
  client = neon(connectionString)
} else {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  
  // Set up postgres client for development
  client = postgres(connectionString, {
    max: 10, // Maximum number of connections
    idle_timeout: 30, // Maximum time a connection can be idle in seconds
  })
}

// Create drizzle database instance
export const db = drizzle(client, { schema })

/**
 * Utility function to check database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check connection
    const result = await db.execute(sql`SELECT 1 AS connected`)
    return result[0]?.connected === 1
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// Import SQL tag for raw queries
import { sql } from 'drizzle-orm'
export { sql }