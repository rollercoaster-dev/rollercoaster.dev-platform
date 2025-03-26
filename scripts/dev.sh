#!/bin/bash

# Dev script to run frontend and backend concurrently
# Usage: ./scripts/dev.sh

# Create logs directory if it doesn't exist
mkdir -p .logs

# Kill background processes on exit
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Print with colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
  echo -e "${GREEN}[$(date +%T)]${NC} $1"
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists bun; then
  echo -e "${RED}Error: Bun is required but not installed.${NC}"
  echo "Install bun from https://bun.sh/"
  exit 1
fi

if ! command_exists pnpm; then
  echo -e "${YELLOW}Warning: PNPM is not installed, but recommended for the frontend.${NC}"
fi

log "${GREEN}Starting development servers...${NC}"

# Build shared package
log "${BLUE}Building shared package...${NC}"
(cd shared && bun run build) || {
  echo -e "${RED}Error: Failed to build shared package.${NC}"
  exit 1
}

# Start shared package in watch mode
log "${BLUE}Starting shared package in watch mode...${NC}"
(cd shared && bun run dev) > .logs/shared.log 2>&1 &
SHARED_PID=$!

# Start backend
log "${BLUE}Starting Backend (Bun + Hono)...${NC}"
(cd backend && bun run --watch index.ts) > .logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment to ensure backend starts first
sleep 2

# Start frontend
log "${BLUE}Starting Frontend (Nuxt)...${NC}"
(cd frontend && bun run dev) > .logs/frontend.log 2>&1 &
FRONTEND_PID=$!

log "${GREEN}All services started successfully!${NC}"
log "${YELLOW}Logs are available in .logs/ directory${NC}"
log "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for any process to exit
wait 