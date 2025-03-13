#!/bin/bash

# Dev script to run frontend and backend concurrently
# Usage: ./scripts/dev.sh

# Create directory if it doesn't exist
mkdir -p scripts

# Kill background processes on exit
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Print with colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development servers...${NC}"

# Start PostgreSQL database
echo -e "${BLUE}Starting PostgreSQL...${NC}"
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
until docker exec atbadges-postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo -n "."
  sleep 1
done
echo -e "\n${GREEN}PostgreSQL is ready!${NC}"

# Setup database
echo -e "${BLUE}Setting up database...${NC}"
cd backend && bun run db:setup

# Start backend with debug flags
echo -e "${BLUE}Starting Backend (Bun + Hono)...${NC}"
BUN_DEBUG=1 BUN_LOG=debug bun run --watch index.ts 2>&1 | tee backend.log &

# Wait a moment to ensure backend starts first
sleep 2

# Start frontend with debug flags
echo -e "${BLUE}Starting Frontend (Nuxt)...${NC}"
cd ../frontend && NODE_OPTIONS='--trace-warnings' NUXT_APP_DEBUG=true NITRO_DEBUG=true pnpm dev --trace-warnings --verbose 2>&1 | tee frontend.log &

# Function to check logs for errors
check_logs() {
  if grep -q "Error:" frontend.log 2>/dev/null; then
    echo -e "${RED}Frontend Errors found:${NC}"
    grep -A 5 "Error:" frontend.log
  fi
  if grep -q "Error:" backend.log 2>/dev/null; then
    echo -e "${RED}Backend Errors found:${NC}"
    grep -A 5 "Error:" backend.log
  fi
}

# Check logs every 5 seconds
while true; do
  check_logs
  sleep 5
done &

# Wait for any process to exit
wait -n

# Cleanup on exit
echo -e "${BLUE}Cleaning up...${NC}"
docker compose down postgres 