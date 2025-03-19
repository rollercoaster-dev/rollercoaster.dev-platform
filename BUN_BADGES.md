# Using bun-badges with atBadges

This document provides instructions for setting up and using the bun-badges backend with the atBadges application.

## Overview

The atBadges application has been configured to work with the bun-badges service, which provides a badge management system compatible with Open Badges 2.0 and 3.0 specifications. The application can operate in different modes:

1. **Standalone Mode** - Using the built-in badge management
2. **Integrated Mode** - Using bun-badges as the badge provider

## Prerequisites

- Bun >= 1.0.0
- Node.js >= 18.0.0
- pnpm (for frontend dependencies)
- The bun-badges repository cloned in the parent directory

## Setup

1. Clone the bun-badges repository to the parent directory of atBadges:

```bash
# From the parent directory of atBadges
git clone https://github.com/your-organization/bun-badges.git
cd bun-badges

# Install dependencies
bun install
```

2. Run the setup script in atBadges:

```bash
cd ../atBadges
chmod +x ./scripts/setup-bun-badges.sh
./scripts/setup-bun-badges.sh
```

## Development

To run the development environment with bun-badges:

```bash
# From the atBadges directory
./scripts/dev-with-bun-badges.sh
```

This script will:
1. Start the bun-badges service on port 7777
2. Start the atBadges backend with proper configuration
3. Start the atBadges frontend with proper configuration

## Configuration

The integration with bun-badges is configured through environment variables:

- `BADGES_API_URL` - The URL of the bun-badges service (backend)
- `NUXT_PUBLIC_API_URL` - The URL of the bun-badges service (frontend)

These are automatically set when using the dev script.

## Implementation Details

The integration with bun-badges is implemented as follows:

1. **Backend** - The `badgesApiService.ts` service provides a client for the bun-badges API.
2. **Frontend** - The `badgeService.ts` service communicates with the bun-badges API directly.
3. **Fallback** - The application gracefully falls back to local badge management if bun-badges is unavailable.

## API Endpoints

The bun-badges service exposes the following main endpoints:

- `GET /badges` - List all badges
- `GET /badges/:id` - Get a specific badge
- `POST /badges` - Create a new badge
- `PUT /badges/:id` - Update a badge
- `DELETE /badges/:id` - Delete a badge
- `GET /health` - Service health check

## Troubleshooting

If you encounter issues with the bun-badges integration:

1. Check that the bun-badges service is running (`http://localhost:7777/health`)
2. Verify that the environment variables are set correctly
3. Check the console for error messages

If bun-badges is unavailable, the application will fall back to local badge management with a warning message.

## More Information

For more information about bun-badges, refer to the documentation in the bun-badges repository.