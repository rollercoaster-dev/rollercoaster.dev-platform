#!/bin/bash

# Check if bun-badges directory exists
if [ ! -d "../bun-badges" ]; then
  echo "Error: bun-badges directory not found at ../bun-badges"
  echo "Please make sure the bun-badges repository is cloned in the parent directory."
  exit 1
fi

# Store current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Start bun-badges service in a separate terminal
echo "Starting bun-badges service..."
( cd ../bun-badges && bun run dev ) &
BUN_BADGES_PID=$!

# Wait for bun-badges to start
echo "Waiting for bun-badges to start (5 seconds)..."
sleep 5

# Start our backend service with appropriate environment variables
echo "Starting backend service..."
cd "$ROOT_DIR/backend" && BADGES_API_URL=http://localhost:7777 bun run --watch index.ts &
BACKEND_PID=$!

# Wait a moment to ensure backend starts
sleep 2

# Start frontend
echo "Starting frontend..."
cd "$ROOT_DIR/frontend" && NUXT_PUBLIC_API_URL=http://localhost:7777 pnpm dev &
FRONTEND_PID=$!

# Cleanup on exit
function cleanup {
  echo "Shutting down services..."
  kill $BUN_BADGES_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Setup cleanup on script exit (Ctrl+C)
trap cleanup SIGINT SIGTERM

echo "All services started. Press Ctrl+C to stop."

# Wait for any process to exit
wait -n

# Execute cleanup if any process exits
cleanup