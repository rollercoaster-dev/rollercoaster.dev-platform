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
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development servers...${NC}"

# Start backend
echo -e "${BLUE}Starting Backend (Bun + Hono)...${NC}"
cd backend && bun run --watch index.ts &

# Wait a moment to ensure backend starts first
sleep 2

# Start frontend
echo -e "${BLUE}Starting Frontend (Nuxt)...${NC}"
cd frontend && npm run dev &

# Wait for any process to exit
wait 