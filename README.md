# atBadges - Achievement Badge System

A full-stack application for tracking achievements and learning progress through digital badges.

## Technology Stack

- **Frontend**: Vue 3 + Nuxt.js + Tailwind CSS
- **Backend**: Bun + Hono.js
- **Shared**: TypeScript for type definitions
- **Testing**: Bun Test for backend, Vitest for frontend

## Project Structure

```
atBadges/
├── backend/              # Bun + Hono API server
│   ├── src/
│   │   ├── routes/       # API route handlers
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
    └── dev.sh            # Run both frontend and backend servers
```

## Setup

Make sure to install dependencies:

```bash
# Install backend dependencies
cd backend && bun install

# Install frontend dependencies
cd frontend && pnpm install
```

## Development

Run the development servers (both frontend and backend):

```bash
# From the project root
chmod +x scripts/dev.sh
./scripts/dev.sh
```

This script:
- Starts the backend Hono server at http://localhost:3000
- Starts the frontend Nuxt dev server at http://localhost:3001
- Enables hot reloading for both

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

## License

[MIT](LICENSE)
