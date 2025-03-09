#!/bin/bash

# Navigate to the project root
cd "$(dirname "$0")/.."

# Check if badge-engine directory exists
if [ ! -d "../badge-engine" ]; then
  echo "❌ badge-engine directory not found at ../badge-engine"
  echo "Please make sure the badge-engine repository is cloned in the parent directory"
  exit 1
fi

# Check if badge-engine has a Dockerfile
if [ ! -f "../badge-engine/Dockerfile" ]; then
  echo "❌ Dockerfile not found in the badge-engine directory"
  echo "Creating a basic Dockerfile for badge-engine..."
  
  cat > "../badge-engine/Dockerfile" << EOL
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy all files
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate

# Create an additional database for badge-engine
RUN touch .env && echo "DATABASE_URL=postgres://postgres:postgres@postgres:5432/badge_engine" > .env

# Expose the port
EXPOSE 3001

# Start development server
CMD ["pnpm", "dev"]
EOL
  
  echo "✅ Created Dockerfile for badge-engine"
fi

# Start all services
echo "🐳 Starting all services..."
docker-compose -f docker-compose-dev.yml up -d

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
attempt=0
max_attempts=30
while [ $attempt -lt $max_attempts ]; do
  if docker-compose -f docker-compose-dev.yml exec postgres pg_isready -U postgres > /dev/null 2>&1; then
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

# Create badge_engine database for badge-engine service
echo "🗄️ Creating badge_engine database..."
docker-compose -f docker-compose-dev.yml exec postgres psql -U postgres -c "CREATE DATABASE badge_engine;" > /dev/null 2>&1 || echo "Database badge_engine already exists"

echo ""
echo "🚀 Development environment is ready!"
echo ""
echo "📊 Services:"
echo "  Backend API: http://localhost:3000"
echo "  Badge Engine API: http://localhost:3001"
echo "  PGAdmin: http://localhost:5050"
echo ""
echo "💻 View logs:"
echo "  docker-compose -f docker-compose-dev.yml logs -f"
echo ""
echo "🛑 Stop all services:"
echo "  docker-compose -f docker-compose-dev.yml down"
echo ""