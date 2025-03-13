# Auth0 Setup for Local Development

## Objective
Set up Auth0 authentication for the badge-engine service in the local development environment.

## Current State
- Backend service running on port 3000
- Prisma Studio running on port 3100
- Badge-engine failing to start due to missing Auth0 credentials

## Required Environment Variables
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET
- AUTH0_ISSUER

## Steps

### 1. Create Auth0 Account
- [ ] Visit auth0.com and sign up for a free account
- [ ] Verify email address
- [ ] Create new tenant (if needed)

### 2. Create Auth0 Application
- [ ] Navigate to Applications > Create Application
- [ ] Name: "Badge Engine Local Dev"
- [ ] Choose "Regular Web Application"
- [ ] Save application settings

### 3. Configure Application Settings
- [ ] Set Allowed Callback URLs: `http://localhost:3000/api/auth/callback/auth0`
- [ ] Set Allowed Logout URLs: `http://localhost:3000`
- [ ] Set Allowed Web Origins: `http://localhost:3000`
- [ ] Save changes

### 4. Gather Credentials
- [ ] Copy Domain (Auth0 Issuer)
- [ ] Copy Client ID
- [ ] Copy Client Secret

### 5. Configure Local Environment
- [ ] Create/update badge-engine/.env file
- [ ] Add Auth0 credentials
- [ ] Verify environment file permissions

### 6. Test Configuration
- [ ] Restart badge-engine service
- [ ] Verify successful startup
- [ ] Test authentication flow

## Success Criteria
- Badge-engine service starts without authentication errors
- Authentication flow works in local development
- All services (backend, badge-engine, Prisma Studio) running correctly

## Notes
- Keep credentials secure and never commit them to version control
- Document any issues or gotchas for team reference
- Consider adding setup instructions to project README

## Time Estimate
30-45 minutes

## Resources
- [Auth0 Next.js Guide](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 Dashboard](https://manage.auth0.com/) 