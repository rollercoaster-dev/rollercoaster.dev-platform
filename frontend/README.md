# Badge Frontend

A Nuxt.js frontend for the badge management application.

## Badge Engine Integration

This frontend connects to our backend API which integrates with the badge-engine service. The integration:

1. Transparently synchronizes badge data with the badge-engine
2. Falls back to local storage when badge-engine is unavailable
3. Provides a consistent API regardless of whether badge-engine is active

### How to Use Badge Engine Features

The frontend service includes a helper method to check if a badge is managed by the badge-engine:

```typescript
// Check if a badge is managed by badge-engine
const isManaged = badgeService.isBadgeEngineManaged(badge);

// This can be used to show special UI or features for badge-engine badges
if (isManaged) {
  // Show badge-engine specific features
}
```

## Development

To start the development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```
NUXT_PUBLIC_API_URL=http://localhost:3000
```