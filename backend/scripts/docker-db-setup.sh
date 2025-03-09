#!/bin/bash

# Navigate to the project root (where docker-compose.yml is located)
cd ../../

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start the PostgreSQL container
echo "🐳 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
attempt=0
max_attempts=30
while [ $attempt -lt $max_attempts ]; do
  if docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  attempt=$((attempt+1))
  echo "⏳ Waiting for PostgreSQL to start... ($attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ PostgreSQL failed to start within the expected time."
  exit 1
fi

# Create a .env file with the correct DATABASE_URL
echo "📝 Creating .env file..."
cat > ../backend/.env << EOL
# Badge Engine API Configuration
BADGE_ENGINE_URL=http://localhost:3001/api

# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/atbadges
EOL

echo "✅ Created .env file with PostgreSQL connection string."
echo ""
echo "🚀 Database is ready! You can now run the following commands:"
echo "  cd backend"
echo "  bun run db:setup    # Generate and run database migrations"
echo "  bun run dev         # Start the development server"
echo ""
echo "📊 PGAdmin is available at http://localhost:5050"
echo "  Email: admin@atbadges.dev"
echo "  Password: admin"
echo "  Host: postgres"
echo "  Port: 5432"
echo "  Username: postgres"
echo "  Password: postgres"
echo "  Database: atbadges"