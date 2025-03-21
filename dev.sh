#!/bin/bash

# Master development script for atBadges
# Starts all necessary services: PostgreSQL, PGAdmin, Badge Engine, Backend, and Frontend

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p .logs

# Kill background processes on exit
trap 'echo -e "${YELLOW}Shutting down all services...${NC}"; kill $(jobs -p) 2>/dev/null; docker-compose -f docker-compose-dev.yml down' EXIT

# Print header
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     atBadges Development Environment     ${NC}"
echo -e "${GREEN}========================================${NC}"

# Check badge-engine directory
if [ ! -d "../badge-engine" ]; then
  echo -e "${YELLOW}Warning: badge-engine directory not found at ../badge-engine${NC}"
  echo -e "${YELLOW}Some features requiring badge-engine will not be available${NC}"
  USE_BADGE_ENGINE=false
else
  USE_BADGE_ENGINE=true
  echo -e "${GREEN}✓ Badge Engine repository found${NC}"
fi

# Start Docker services
echo -e "\n${BLUE}Starting Docker services...${NC}"
docker-compose -f docker-compose-dev.yml up -d

# Wait for PostgreSQL to be ready
echo -e "\n${BLUE}Waiting for PostgreSQL to be ready...${NC}"
attempt=0
max_attempts=30
while [ $attempt -lt $max_attempts ]; do
  if docker-compose -f docker-compose-dev.yml exec postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is ready!${NC}"
    break
  fi
  attempt=$((attempt+1))
  echo -e "${YELLOW}⏳ Waiting for PostgreSQL... ($attempt/$max_attempts)${NC}"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo -e "${RED}❌ PostgreSQL failed to start. Exiting.${NC}"
  exit 1
fi

# Create badge_engine database if it doesn't exist
echo -e "\n${BLUE}Ensuring databases are created...${NC}"
docker-compose -f docker-compose-dev.yml exec postgres psql -U postgres -c "CREATE DATABASE badge_engine;" > /dev/null 2>&1 || echo -e "${YELLOW}Note: badge_engine database already exists${NC}"

# Setup backend database if needed
echo -e "\n${BLUE}Setting up backend database...${NC}"
if [ -f "backend/scripts/setup-env.sh" ]; then
  (cd backend && ./scripts/setup-env.sh && bun run db:setup) || echo -e "${YELLOW}Note: Database setup skipped or failed${NC}"
else
  echo -e "${YELLOW}Warning: backend/scripts/setup-env.sh not found. Skipping database setup.${NC}"
fi

# Start frontend (if it exists)
if [ -d "frontend" ]; then
  echo -e "\n${BLUE}Starting Frontend (Vue/Nuxt)...${NC}"
  (cd frontend && pnpm dev) > .logs/frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo -e "${GREEN}✓ Frontend started with PID $FRONTEND_PID (logs in .logs/frontend.log)${NC}"
else
  echo -e "${YELLOW}Warning: frontend directory not found. Skipping frontend startup.${NC}"
fi

# Start backend
if [ -d "backend" ]; then
  echo -e "\n${BLUE}Starting Backend...${NC}"
  (cd backend && bun run dev) > .logs/backend.log 2>&1 &
  BACKEND_PID=$!
  echo -e "${GREEN}✓ Backend started with PID $BACKEND_PID (logs in .logs/backend.log)${NC}"
else
  echo -e "${RED}Error: backend directory not found. Cannot start backend.${NC}"
  exit 1
fi

# Print service information
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}     Development Environment Ready     ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Services:${NC}"
echo -e "  ${GREEN}PostgreSQL:${NC} localhost:5432 (postgres/postgres)"
echo -e "  ${GREEN}PGAdmin:${NC} http://localhost:5050 (admin@atbadges.dev/admin)"
echo -e "  ${GREEN}Backend API:${NC} http://localhost:3000"
if [ "$USE_BADGE_ENGINE" = true ]; then
  echo -e "  ${GREEN}Badge Engine:${NC} http://localhost:3001"
fi
if [ -n "$FRONTEND_PID" ]; then
  echo -e "  ${GREEN}Frontend:${NC} http://localhost:8000 (or as configured in frontend/.env)"
fi

# Log monitoring function
log_monitor() {
  local log_file=$1
  local service_name=$2
  local color=$3
  
  tail -f $log_file | while read -r line; do
    if [[ $line == *"error"* ]] || [[ $line == *"Error"* ]]; then
      echo -e "${RED}[$service_name] $line${NC}"
    else
      echo -e "${color}[$service_name] $line${NC}"
    fi
  done
}

# Start log monitors
echo -e "\n${BLUE}Starting log monitors...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

if [ -n "$FRONTEND_PID" ]; then
  log_monitor .logs/frontend.log "Frontend" $GREEN &
fi

if [ -n "$BACKEND_PID" ]; then
  log_monitor .logs/backend.log "Backend" $BLUE &
fi

# Wait for any process to exit
wait 