import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

// Get a clean connection string for Docker
const connectionString = 'postgres://postgres:postgres@localhost:5432/atbadges';

async function testDockerPostgres() {
  console.log('Testing PostgreSQL connection in Docker...');
  
  // Create a clean PostgreSQL client
  const sql = postgres(connectionString, {
    max: 10,
    idle_timeout: 30,
  });
  
  try {
    // Run a simple query to verify connection
    const result = await sql`SELECT 1 AS connected`;
    
    if (result[0]?.connected === 1) {
      console.log('✅ Database connection successful!');
      
      // Create a test table
      console.log('Creating test table...');
      await sql`CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
      
      // Insert a test record
      console.log('Inserting test record...');
      const insertResult = await sql`
        INSERT INTO test_table (name)
        VALUES ('Test Record')
        RETURNING *
      `;
      
      console.log('Inserted record:', insertResult[0]);
      
      // Query all records
      console.log('Querying all records...');
      const allRecords = await sql`SELECT * FROM test_table`;
      
      console.log('All records:', allRecords);
      
      // Clean up
      console.log('Cleaning up...');
      await sql`DROP TABLE test_table`;
      
      console.log('✅ All tests passed!');
    } else {
      console.error('❌ Database connection verification failed');
    }
  } catch (error) {
    console.error('❌ Error testing database:', error);
  } finally {
    // Close the connection
    await sql.end();
  }
}

// Run the test
testDockerPostgres();