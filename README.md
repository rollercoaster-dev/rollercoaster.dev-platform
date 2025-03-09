# atBadges - Achievement Badge System

A full-stack application for tracking achievements and learning progress through digital badges, with integration support for the badge-engine service.

## Technology Stack

- **Frontend**: Vue 3 + Nuxt.js + Tailwind CSS
- **Backend**: Bun + Hono.js
- **Database**: PostgreSQL with Drizzle ORM
- **Shared**: TypeScript for type definitions
- **Testing**: Bun Test for backend, Vitest for frontend
- **Integration**: External badge-engine service
- **Development**: Docker Compose for development environment

## Project Structure

```
atBadges/
├── backend/              # Bun + Hono API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Service clients (badge-engine integration)
│   │   ├── middleware/   # API middleware (error handling, etc.)
│   │   └── index.ts      # API entry point
│   └── tests/            # Backend tests
│       ├── fixtures/     # Test data
│       └── unit/         # Unit tests
├── frontend/             # Vue 3 + Nuxt frontend
│   ├── components/       # Vue components
│   ├── pages/            # Vue pages/routes
│   └── services/         # API client services
├── shared/               # Shared code between frontend/backend
│   └── types/            # TypeScript type definitions
└── scripts/              # Development and utility scripts
    ├── dev.sh            # Run both frontend and backend servers
    └── dev-with-badge-engine.sh  # Run with badge-engine integration
```

## Setup

Make sure to install dependencies:

```bash
# Install backend dependencies with Bun
cd backend && bun install

# Install frontend dependencies with pnpm
cd frontend && pnpm install
```

## Development

### Using Docker (Recommended)

The easiest way to get started is using Docker Compose, which sets up PostgreSQL, PGAdmin, badge-engine, and the backend API in containers:

```bash
# Make the script executable
chmod +x scripts/docker-dev.sh

# Start the development environment
./scripts/docker-dev.sh
```

This script:
- Starts PostgreSQL container with data persistence
- Sets up PGAdmin for database management at http://localhost:5050
- Creates necessary databases for both apps
- Starts the badge-engine service at http://localhost:3001
- Starts the backend API with hot reloading at http://localhost:3000
- Configures everything to work together automatically

### Running Locally

If you prefer to run the services locally:

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres pgadmin

# Set up the backend with database connection
cd backend
./scripts/setup-env.sh
bun run db:setup
bun run dev
```

For frontend development:

```bash
# From the project root
cd frontend
pnpm dev
```

### Running with Badge-Engine Integration

To run the application with badge-engine integration:

```bash
# From the project root
chmod +x scripts/dev-with-badge-engine.sh
./scripts/dev-with-badge-engine.sh
```

This script:
- Starts the badge-engine service at its default port
- Starts the backend Hono server with badge-engine integration
- Enables seamless synchronization between the systems

## API Endpoints

The backend exposes the following endpoints:

### Badges API

- `GET /badges` - Get all badges
- `GET /badges/:id` - Get a single badge by ID
- `POST /badges` - Create a new badge
- `PUT /badges/:id` - Update a badge
- `PATCH /badges/:id/progress` - Update badge progress
- `DELETE /badges/:id` - Delete a badge

## Frontend Services

The `badgeService.ts` provides a typed API client for interacting with the backend:

```typescript
// Example usage
import { badgeService } from '@/services/badgeService';

// Get all badges
const badges = await badgeService.getBadges();

// Create a new badge
const newBadge = await badgeService.createBadge({
  name: 'New Badge',
  description: 'A new badge',
  // ...other properties
});

// Check if badge is managed by badge-engine
const isEngineManaged = badgeService.isBadgeEngineManaged(badge);
if (isEngineManaged) {
  // Handle badge-engine specific features
}
```

## Testing

### Backend Tests

Run backend tests:

```bash
cd backend && bun test
```

### Frontend Tests

Run frontend tests:

```bash
cd frontend && pnpm test
```

## Development Approach

This project follows an ADHD-friendly Test-Driven Development approach:

1. Write small, focused tests for a specific behavior
2. Implement minimal code to make tests pass
3. Refactor while maintaining passing tests

For more details about our testing strategy, see `.cursor/working/agent/config/testing_strategy_rule.md`.

## Badge-Engine Integration

This project integrates with the badge-engine service to provide enhanced badge management capabilities:

### Integration Components

- **Backend Integration**: The `badgeEngineService.ts` provides API client for communicating with badge-engine
- **Shared Types**: Badge types include `externalId` and `externalSource` fields for badge-engine references
- **Graceful Fallbacks**: System works even when badge-engine is unavailable
- **Development Script**: Run both services together with `dev-with-badge-engine.sh`

### Using Badge-Engine Features

The integration provides seamless synchronization between systems:

1. When badge-engine is available, badges are created/updated in both systems
2. When badge-engine is unavailable, operations continue with local storage
3. Frontend can detect badge-engine managed badges with `isBadgeEngineManaged()`

### Current Status

The badge-engine integration is currently functional with these components:
- ✅ API Client (`badgeEngineService`)
- ✅ Type Definitions (updated shared types)
- ✅ Badge API Routes (with badge-engine integration)
- ✅ Frontend Service Detection
- ✅ Development Scripts
- ✅ Database Integration with PostgreSQL and Drizzle ORM

## Package Managers

This project uses different package managers for different parts:

- **Backend**: Uses [Bun](https://bun.sh/) - a fast all-in-one JavaScript runtime and package manager
- **Frontend**: Uses [pnpm](https://pnpm.io/) - a fast, disk space efficient package manager
- **Badge-Engine**: Uses [pnpm](https://pnpm.io/) - same as the frontend

Always make sure to use the correct package manager for each part of the project.

## License

[MIT](LICENSE)
