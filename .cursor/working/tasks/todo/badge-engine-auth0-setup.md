# Badge-engine Auth0 Setup

## Current Issue
Badge-engine requires Auth0 configuration but is missing required environment variables:
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET
- AUTH0_ISSUER

## Steps to Resolve

### 1. Create Auth0 Application (15-20 mins)
1. Log into Auth0 Dashboard
2. Create a new Regular Web Application
   ```
   Name: Badge Engine Dev
   Type: Regular Web Application
   ```
3. Configure application settings:
   - Allowed Callback URLs: `http://localhost:3001/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3001`
   - Allowed Web Origins: `http://localhost:3001`

### 2. Configure Environment Variables (5-10 mins)
1. Copy `.env.example` to `.env` in badge-engine directory
2. Add Auth0 configuration:
   ```env
   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret
   AUTH0_ISSUER=https://your-tenant.auth0.com
   ```

### 3. Update Auth0 Rules (if needed) (10-15 mins)
1. Check if any custom rules are needed for badge-engine
2. Configure user metadata handling
3. Set up any required scopes

### 4. Test Authentication Flow (10-15 mins)
1. Start badge-engine service
2. Attempt to log in
3. Verify callback handling
4. Test protected routes

## Success Criteria
- [ ] Badge-engine starts without Auth0 errors
- [ ] Authentication flow works
- [ ] Protected routes are accessible
- [ ] User information is properly populated

## Notes
- Keep Auth0 credentials secure
- Consider using Auth0 Management API for user management
- Document any custom configuration for team reference

## Resources
- [Auth0 Regular Web App Setup](https://auth0.com/docs/get-started/auth0-overview/create-applications/regular-web-apps)
- [Auth0 Environment Setup](https://auth0.com/docs/get-started/auth0-overview/create-tenants)
- [NextAuth.js Auth0 Provider](https://next-auth.js.org/providers/auth0) 