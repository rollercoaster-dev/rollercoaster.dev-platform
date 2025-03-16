# Badge Engine Startup Issues

## Error Messages
1. Auth0 Configuration:
```
Invalid environment variables: {
  AUTH0_CLIENT_ID: [ 'Required' ],
  AUTH0_CLIENT_SECRET: [ 'Required' ],
  AUTH0_ISSUER: [ 'Required' ]
}
```

2. Prisma Schema Validation:
```
- Composite types are not supported on Postgres
- Native type ObjectId is not supported for postgresql connector
- The current connector does not support the auto() function
- Invalid referential action: NoAction
```

## Recent Changes
- Switched database from MongoDB to PostgreSQL
- Updated DATABASE_URL to use PostgreSQL connection string
- No Auth0 configuration has been set up yet

## Potentially Involved Files
1. `.env` - Contains environment variables
2. `prisma/schema/*.prisma` - Database schema files that need PostgreSQL migration:
   - `types.prisma` - Contains unsupported composite types
   - `achievement.prisma` - Contains MongoDB-specific features
   - `alignment.prisma` - Contains MongoDB-specific features

## Current State
Working:
- PostgreSQL connection string is correctly configured
- Development script starts correctly

Not Working:
- Auth0 authentication
- Prisma schema validation
- Database schema compatibility

## Investigation Plan
1. Auth0 Setup:
   - Create Auth0 application
   - Configure callback URLs
   - Add environment variables
   Estimated time: 15-20 minutes

2. Prisma Schema Migration:
   - Remove composite types
   - Replace ObjectId with UUID or serial
   - Update referential actions
   - Test schema validation
   Estimated time: 30-45 minutes

## Hypothesis
1. Auth0: The application requires authentication but hasn't been configured with Auth0 credentials.
2. Schema: The Prisma schema was originally designed for MongoDB and needs to be adapted for PostgreSQL's feature set.

## Proposed Debug Steps

### Auth0 Setup
1. Create new Auth0 application
2. Configure application settings:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
3. Copy credentials to .env file
4. Test authentication flow

### Schema Migration
1. Modify composite types:
   - Convert to regular models or inline fields
2. Replace MongoDB-specific features:
   - Change `@db.ObjectId` to `@db.Uuid`
   - Replace `auto()` with `uuid()`
3. Update referential actions:
   - Replace `NoAction` with `Restrict`
4. Run schema validation
5. Generate and apply migrations

Success Criteria:
- All environment variables are properly configured
- Prisma schema validates without errors
- Application starts without validation errors
- Database migrations apply successfully 