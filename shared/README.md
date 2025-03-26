# @atbadges/shared

Shared code and type definitions for the atBadges project.

## Overview

This package contains shared code, utilities, and type definitions used across both the frontend and backend applications. Centralizing these shared components ensures consistency and reduces duplication.

## Usage

### Installation

The package is referenced by both the frontend and backend applications. No additional installation is required.

### Import Types

```typescript
// Import all types
import { Badge, BadgeStatus } from '@atbadges/shared';

// Or import specific types
import { Badge } from '@atbadges/shared/types';
```

## Development

### Building

```bash
# Build the package
cd shared
pnpm build

# Watch mode for development
pnpm dev
```

### Adding New Types

1. Create a new file in the `types` directory or add to existing files
2. Export the types from the appropriate index.ts file
3. Rebuild the package

## Versioning

This package follows semantic versioning (semver):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes 