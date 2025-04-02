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
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

log() {
  echo -e "${GREEN}[$(date +%T)]${NC} $1"
}

# Log prefix functions for each service
log_shared() {
  echo -e "${CYAN}[SHARED]${NC} $1"
}

log_backend() {
  echo -e "${MAGENTA}[BACKEND]${NC} $1"
}

log_frontend() {
  echo -e "${BLUE}[FRONTEND]${NC} $1"
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

# Start shared package in watch mode with tee to show logs in terminal and save to file
log "${BLUE}Starting shared package in watch mode...${NC}"
(cd shared && bun run dev 2>&1 | while read -r line; do
  log_shared "$line"
  echo "$line" >> ../.logs/shared.log
done) &
SHARED_PID=$!

# Start backend with tee to show logs in terminal and save to file
log "${BLUE}Starting Backend (Bun + Hono)...${NC}"
# Bun automatically loads .env in the target directory
(cd backend && bun run --watch index.ts 2>&1 | while read -r line; do
  log_backend "$line"
  echo "$line" >> ../.logs/backend.log
done) &
BACKEND_PID=$!

# Wait a moment to ensure backend starts first
sleep 2

# Start frontend with tee to show logs in terminal and save to file
log "${BLUE}Starting Frontend (Nuxt)...${NC}"
(cd frontend && bun run dev 2>&1 | while read -r line; do
  log_frontend "$line"
  echo "$line" >> ../.logs/frontend.log
done) &
FRONTEND_PID=$!

log "${GREEN}All services started successfully!${NC}"
log "${YELLOW}Logs are available in .logs/ directory${NC}"
log "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for any process to exit
wait