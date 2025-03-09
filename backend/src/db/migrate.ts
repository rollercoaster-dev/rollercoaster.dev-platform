import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import 'dotenv/config'

/**
 * This script applies database migrations from the migrations folder
 * to keep the database schema in sync with the application
 */
async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined in environment variables')
    process.exit(1)
  }

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 })
  
  console.log('🔄 Running database migrations...')
  
  try {
    // Create a separate Drizzle instance for migrations
    const db = drizzle(migrationClient)
    
    // Run migrations from the specified directory
    await migrate(db, { migrationsFolder: './src/db/migrations' })
    
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Error running database migrations:', error)
    process.exit(1)
  } finally {
    // Close the database connection
    await migrationClient.end()
  }
}

// Run the migration script
runMigrations()