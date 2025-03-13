# Badge-engine API Client Implementation

## Objective
Create a type-safe, robust API client for interacting with the badge-engine service using tRPC, replacing our current badge system.

## Core Requirements
- Type-safe API calls using tRPC
- Proper error handling and retries
- Authentication management
- Logging and monitoring
- Easy to use interface matching current badge operations

## Implementation Steps

### 1. Setup Client Infrastructure
- [ ] Create `src/server/routers/badgeEngine` directory
- [ ] Set up tRPC client configuration for badge-engine
- [ ] Import and use badge-engine types directly
- [ ] Set up environment variables for badge-engine connection

### 2. Core Client Implementation
```typescript
// Example structure using tRPC
export const badgeEngineRouter = createTRPCRouter({
  achievements: createTRPCRouter({
    list: publicProcedure
      .input(paginationSchema)
      .query(async ({ ctx, input }) => {
        // Badge-engine list logic
      }),
    create: protectedProcedure
      .input(createAchievementSchema)
      .mutation(async ({ ctx, input }) => {
        // Badge-engine create logic
      }),
    // ... other procedures
  }),
  
  awards: createTRPCRouter({
    create: protectedProcedure
      .input(z.object({
        achievementId: z.string(),
        recipientId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Award creation logic
      }),
    // ... other procedures
  }),
});
```

### 3. Error Handling Implementation
- [ ] Create error mapping from badge-engine to our system
- [ ] Implement retry logic for transient failures
- [ ] Add timeout handling
- [ ] Create custom error types if needed

### 4. Authentication
- [ ] Implement auth token management
- [ ] Add token refresh logic
- [ ] Handle auth state changes
- [ ] Add auth headers to requests

### 5. Logging and Monitoring
- [ ] Add request/response logging
- [ ] Implement performance metrics
- [ ] Add error tracking
- [ ] Create health check methods

### 6. Testing Setup
- [ ] Unit tests for procedures
- [ ] Integration tests with badge-engine
- [ ] Error handling tests
- [ ] Authentication flow tests

## Implementation Details

### File Structure
```
src/server/
├── routers/
│   └── badgeEngine/
│       ├── index.ts           # Main router export
│       ├── achievements.ts    # Achievement procedures
│       ├── awards.ts         # Award procedures
│       └── images.ts         # Image procedures
├── utils/
│   ├── badgeEngine/
│   │   ├── auth.ts           # Auth utilities
│   │   ├── logging.ts        # Logging utilities
│   │   └── errors.ts         # Error mapping
└── tests/
    └── badgeEngine/
        ├── achievements.test.ts
        └── integration.test.ts
```

### Example Usage in Frontend
```typescript
// Example of how the client will be used
const BadgeList = () => {
  const { data, isLoading } = trpc.badgeEngine.achievements.list.useQuery({
    page: 1,
    limit: 10,
  });

  const { mutate } = trpc.badgeEngine.achievements.create.useMutation({
    onSuccess: () => {
      // Handle success
    },
  });
};
```

## Success Criteria
1. All badge operations mapped to badge-engine through tRPC
2. Type-safe operations with excellent DX
3. Proper error handling and recovery
4. Comprehensive test coverage
5. Performance monitoring
6. Well-documented API

## Testing Strategy
1. Unit tests for all procedures
2. Integration tests with badge-engine
3. Error handling scenarios
4. Authentication flows
5. Rate limiting and retry logic
6. Edge cases and validation

## Documentation Needs
1. API reference
2. Usage examples
3. Error handling guide
4. Authentication setup
5. Migration guide from old system

## Next Actions
1. Set up tRPC router structure
2. Implement core procedures
3. Add error handling
4. Set up testing infrastructure
5. Create initial documentation

## Time Estimate
- Core implementation: 1 day
- Error handling: 4 hours
- Testing: 4 hours
- Documentation: 2 hours
- Total: ~2 days

## Dependencies
- tRPC setup (from trpc-migration task)
- Badge-engine API access
- Authentication configuration
- Testing environment 