# Backend API for Badge Management

A Hono-based API server for managing badges, with integration to the badge-engine service and PostgreSQL database.

## Setup

To install dependencies:

```bash
bun install
```

## Configuration

The easiest way to configure your environment is to use the setup script:

```bash
# Make the script executable
chmod +x scripts/setup-env.sh

# Run the setup script
./scripts/setup-env.sh
```

The script will create a `.env` file and prompt you for your PostgreSQL database URL.

Alternatively, you can manually create a `.env` file based on the `.env.example`:

```bash
cp .env.example .env
```

Then update the configuration values:
- `BADGE_ENGINE_URL`: URL of the badge-engine API (default: http://localhost:3001/api)
- `PORT`: Port for this API server to listen on (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string (e.g., postgres://username:password@localhost:5432/atbadges)

## Database Setup

After configuring your `.env` file with a valid PostgreSQL database URL, you need to set up the database:

```bash
# Generate and run migrations
bun run db:setup
```

This will:
1. Generate SQL migration files based on your schema
2. Apply these migrations to your database
3. Create the necessary tables for badges and requirements

## Running the Server

To start the development server:

```bash
bun run dev
```

## Badge-Engine Integration

This API integrates with the badge-engine service to store, retrieve, and manage badges. The integration provides:

1. Automatic fallback to local storage when badge-engine is unavailable
2. Synchronization of badge data between systems
3. External ID references to connect local badges with badge-engine badges

### Using Badge-Engine

To run badge-engine alongside this API:

1. Clone the badge-engine repository if you haven't already
2. Set up and start the badge-engine service (usually on port 3001)
3. Make sure the `BADGE_ENGINE_URL` in your `.env` file points to the correct URL

The API will automatically detect and use badge-engine when available.

## API Endpoints

- `GET /api/badges` - Get all badges
- `GET /api/badges/:id` - Get a single badge
- `POST /api/badges` - Create a new badge
- `PUT /api/badges/:id` - Update a badge
- `PATCH /api/badges/:id/progress` - Update badge progress
- `DELETE /api/badges/:id` - Delete a badge

## Technologies

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Hono](https://hono.dev) - Fast, lightweight web framework
- [badge-engine](https://github.com/yourusername/badge-engine) - External badge management service

## Path Aliases

The project uses TypeScript path aliases to simplify imports. Available aliases:

- `@/*` - Base alias for the src directory
  ```ts
  import { router } from '@/index';
  ```

- `@routes/*` - Route handlers
  ```ts
  import { badgeRoutes } from '@routes/badges';
  ```

- `@models/*` - Data models
  ```ts
  import { Badge } from '@models/badge';
  ```

- `@utils/*` - Utility functions
  ```ts
  import { validateBadge } from '@utils/validation';
  ```

- `@tests/*` - Test utilities and fixtures
  ```ts
  import { createTestBadge } from '@tests/fixtures/badges';
  ```

- `@config/*` - Configuration files
  ```ts
  import { dbConfig } from '@config/database';
  ```

## Development

### Setup
1. Install dependencies: `bun install`
2. Start development server: `bun dev`
3. Run tests: `bun test`

### Project Structure
```
backend/
├── src/
│   ├── routes/      # API route handlers
│   ├── models/      # Data models
│   ├── utils/       # Utility functions
│   └── config/      # Configuration files
└── tests/
    ├── unit/        # Unit tests
    ├── integration/ # Integration tests
    └── fixtures/    # Test data and helpers
```
