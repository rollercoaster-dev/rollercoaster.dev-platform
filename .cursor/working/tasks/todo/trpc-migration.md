# tRPC Migration and Implementation

## Priority: HIGH 🚨

## Objective
Migrate our backend API to tRPC to achieve end-to-end type safety and align with badge-engine's architecture.

## Benefits
- End-to-end type safety
- Unified API pattern with badge-engine
- Better developer experience
- Improved performance
- Easier integration with badge-engine

## Implementation Steps

### 1. Initial Setup
- [ ] Install tRPC and dependencies
  ```bash
  bun add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
  ```
- [ ] Create tRPC server configuration
- [ ] Set up context and middleware
- [ ] Configure error handling

### 2. Router Setup
```typescript
// Example structure
src/server/
├── trpc.ts              # tRPC initialization
├── context.ts           # Request context
├── middleware/
│   └── auth.ts          # Auth middleware
└── routers/
    ├── index.ts         # Root router
    ├── badge.ts         # Badge operations
    └── user.ts          # User operations
```

### 3. Convert Existing Routes
- [ ] Map current REST endpoints to procedures:
  ```typescript
  export const badgeRouter = createTRPCRouter({
    list: publicProcedure
      .input(z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        // Existing badge list logic
      }),
    
    create: protectedProcedure
      .input(createBadgeSchema)
      .mutation(async ({ ctx, input }) => {
        // Existing badge creation logic
      }),
    // ... other procedures
  });
  ```

### 4. Database Integration
- [ ] Keep Drizzle for database operations
- [ ] Create type-safe database queries
- [ ] Integrate with tRPC procedures

### 5. Frontend Integration
- [ ] Set up tRPC client
- [ ] Create hooks for API operations
- [ ] Update components to use tRPC queries/mutations

### 6. Badge-engine Integration
- [ ] Create shared types between systems
- [ ] Implement badge-engine procedures
- [ ] Set up error mapping

## Implementation Details

### API Structure
```typescript
// Example of new API structure
export const appRouter = createTRPCRouter({
  badge: badgeRouter,
  badgeEngine: badgeEngineRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
```

### Frontend Usage
```typescript
// Example of frontend usage
const BadgeList = () => {
  const { data, isLoading } = trpc.badge.list.useQuery({
    limit: 10,
    page: 1,
  });

  const { mutate } = trpc.badge.create.useMutation({
    onSuccess: () => {
      // Handle success
    },
  });
};
```

### Error Handling
```typescript
export const errorFormatter = ({
  shape,
  error,
}: ErrorFormatterParams): TRPCError => {
  return {
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError
          ? error.cause.flatten()
          : null,
    },
  };
};
```

## Migration Strategy

### Phase 1: Setup and Infrastructure
1. [ ] Set up tRPC server
2. [ ] Configure middleware
3. [ ] Set up error handling
4. [ ] Create base router structure

### Phase 2: Route Migration
1. [ ] Convert badge routes
2. [ ] Convert user routes
3. [ ] Add badge-engine integration routes
4. [ ] Update tests

### Phase 3: Frontend Updates
1. [ ] Set up tRPC client
2. [ ] Create API hooks
3. [ ] Update components
4. [ ] Add loading states

### Phase 4: Testing and Validation
1. [ ] Unit tests for procedures
2. [ ] Integration tests
3. [ ] Type checking
4. [ ] Performance testing

## Success Criteria
1. All API routes converted to tRPC
2. End-to-end type safety achieved
3. Frontend successfully integrated
4. Tests passing
5. No performance regression
6. Improved developer experience

## Documentation Needs
1. [ ] tRPC setup and configuration
2. [ ] New API patterns and best practices
3. [ ] Frontend integration guide
4. [ ] Error handling documentation
5. [ ] Migration guide for future routes

## Time Estimate
- Initial setup: 4 hours
- Route migration: 1 day
- Frontend integration: 1 day
- Testing and validation: 4 hours
- Documentation: 2 hours
- Total: ~3 days

## Dependencies
- tRPC and related packages
- Existing Drizzle setup
- Frontend build system
- Testing framework

## Notes
- Keep existing REST endpoints during migration
- Gradually migrate routes to avoid disruption
- Add comprehensive type coverage
- Consider adding API versioning strategy 