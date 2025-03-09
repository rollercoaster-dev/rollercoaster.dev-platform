#!/bin/bash

# Check if badge-engine directory exists
if [ ! -d "../badge-engine" ]; then
  echo "Error: badge-engine directory not found at ../badge-engine"
  echo "Please make sure the badge-engine repository is cloned in the parent directory."
  exit 1
fi

# Start badge-engine service in a separate terminal
echo "Starting badge-engine service..."
( cd ../badge-engine && pnpm dev ) &
BADGE_ENGINE_PID=$!

# Wait for badge-engine to start
echo "Waiting for badge-engine to start (5 seconds)..."
sleep 5

# Start our backend service
echo "Starting backend service..."
cd ../atBadges/backend && bun run index.ts

# Cleanup on exit
function cleanup {
  echo "Shutting down services..."
  kill $BADGE_ENGINE_PID
  exit 0
}

# Setup cleanup on script exit (Ctrl+C)
trap cleanup SIGINT SIGTERM

# Wait for all background processes to complete
wait