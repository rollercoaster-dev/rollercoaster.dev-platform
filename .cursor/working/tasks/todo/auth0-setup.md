# 🏃 Auth0 Setup for Badge Engine

## Quick Wins (5-10 mins each)
1. [x] Create Auth0 account (if needed)
2. [⏳] Create new application in Auth0 dashboard (in progress)
3. [ ] Copy initial credentials to badge-engine/.env

## Task Details
- **ID**: TASK-002
- **Priority**: ⚡ High
- **Time Estimate**: ⏲️ 30-60 mins
- **Energy Level**: 🔋🔋 Medium (configuration work)

## Step-by-Step Plan

### 1. Auth0 Application Setup
- [x] Go to Auth0 Dashboard
- [⏳] Create Regular Web Application
  - Important: Choose "Regular Web Application" not "SPA" because:
    1. Next.js uses Server-Side Rendering
    2. Auth0 callback is handled server-side
    3. Next.js Auth0 provider expects Regular Web App flow
- [ ] Name it "Badge Engine"
- [ ] Select "Next.js" as the technology

### 2. Configure Application URLs
For the badge-engine application:
- [ ] Set Allowed Callback URLs:
  ```
  http://localhost:3001/api/auth/callback/auth0
  ```
- [ ] Set Allowed Logout URLs:
  ```
  http://localhost:3001
  ```
- [ ] Set Allowed Web Origins:
  ```
  http://localhost:3001
  ```

### 3. Configure Environment Variables
- [ ] Copy Auth0 credentials to ../badge-engine/.env:
  ```
  AUTH0_CLIENT_ID="your_client_id"
  AUTH0_CLIENT_SECRET="your_client_secret"
  AUTH0_ISSUER="https://your-tenant.region.auth0.com"
  ```

### 4. Test Configuration
- [ ] Navigate to ../badge-engine
- [ ] Start badge-engine service with `pnpm dev`
- [ ] Verify no Auth0 configuration errors
- [ ] Test login flow (if UI is available)

## Success Criteria
- [ ] No Auth0 configuration errors on startup
- [ ] Environment variables properly set
- [ ] Application URLs configured correctly

## Context Resume Point
Last working on: Creating Auth0 application - filling out initial application form
Next action when returning: Complete application creation form by:
1. Selecting "Regular Web Application"
2. Naming it "Badge Engine"
3. Clicking Create
4. Then we'll configure the URLs and settings

## Energy Level Note 🔋
Pausing for rest - this is a good stopping point as we haven't made any critical changes yet.
When returning, we'll need fresh energy for careful configuration of credentials and URLs.

## Notes
- Keep credentials secure
- Don't commit .env file
- Document any issues encountered
- Badge engine is a separate service in ../badge-engine
- Our frontend will communicate with badge-engine, but doesn't need direct Auth0 config

## Celebration Points 🎉
- [ ] Auth0 app created
- [ ] Credentials configured
- [ ] Badge engine starts without auth errors 