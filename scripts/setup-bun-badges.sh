#!/bin/bash

# Make the dev script executable
chmod +x ./scripts/dev-with-bun-badges.sh

# Remove the old badge-engine service file
if [ -f "./backend/src/services/badgeEngineService.ts" ]; then
  echo "Removing old badgeEngineService.ts file..."
  rm ./backend/src/services/badgeEngineService.ts
fi

# Create a symlink for badgesApiService
if [ ! -d "../bun-badges" ]; then
  echo "Warning: bun-badges directory not found at ../bun-badges"
  echo "Please clone the bun-badges repository to the parent directory."
  echo "git clone https://github.com/your-organization/bun-badges.git ../bun-badges"
fi

echo "Setup complete! You can now run the development environment with:"
echo "./scripts/dev-with-bun-badges.sh"