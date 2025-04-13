# MVP Technical Implementation

This document provides detailed technical specifications for implementing the Rollercoaster.dev MVP, focusing on the classic Open Badges flow.

## Technology Stack

### Frontend
- **Framework**: Astro with Vue components
- **Styling**: TailwindCSS
- **Form Handling**: Vue + FormKit
- **API Client**: Fetch API with custom wrapper
- **Image Processing**: Browser-based cropping/resizing

### Backend
- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL or SQLite
- **Authentication**: JWT + secure cookies
- **Email**: Nodemailer or similar
- **File Storage**: Local filesystem or S3-compatible

### Badge Server
- **bun-badges**: Custom badge server implementation
- **openbadges-types**: Type definitions for badge data

## Project Setup

### Frontend Setup

```bash
# Create Astro project
npm create astro@latest frontend -- --template minimal

# Add integrations
cd frontend
npx astro add vue
npx astro add tailwind
npx astro add image

# Install dependencies
npm install formkit @vueuse/core
```

### Backend Setup

```bash
# Assuming backend directory exists with Bun/Hono
cd backend

# Install dependencies
bun add pg jsonwebtoken bcrypt nodemailer zod
bun add -d bun-types typescript
```

## API Endpoints

### Authentication

```
POST /api/auth/register       # Register new user
POST /api/auth/login          # User login
POST /api/auth/logout         # User logout
POST /api/auth/refresh        # Refresh JWT token
POST /api/auth/password-reset # Password reset
```

### Badge Management

```
GET    /api/badges            # List badges
POST   /api/badges            # Create badge
GET    /api/badges/:id        # Get badge details
PUT    /api/badges/:id        # Update badge
DELETE /api/badges/:id        # Delete badge
POST   /api/badges/:id/issue  # Issue badge to recipients
POST   /api/badges/:id/revoke # Revoke issued badge
```

### User Management

```
GET    /api/users             # List users (admin)
GET    /api/users/me          # Get current user
PUT    /api/users/me          # Update current user
GET    /api/users/:id         # Get user details
PUT    /api/users/:id         # Update user (admin)
DELETE /api/users/:id         # Delete user (admin)
GET    /api/users/:id/badges  # Get user's badges
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'earner',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Badges Table

```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  criteria TEXT NOT NULL,
  issuer_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Badge Assertions Table

```sql
CREATE TABLE badge_assertions (
  id SERIAL PRIMARY KEY,
  badge_id INTEGER REFERENCES badges(id),
  recipient_id INTEGER REFERENCES users(id),
  issuer_id INTEGER REFERENCES users(id),
  issued_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  evidence TEXT,
  verification_hash VARCHAR(255) NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revocation_reason TEXT
);
```

## Authentication Flow

1. **Registration**:
   ```
   Client → POST /api/auth/register → Server validates → Create user → Return JWT
   ```

2. **Login**:
   ```
   Client → POST /api/auth/login → Server validates → Check credentials → Return JWT
   ```

3. **Authentication**:
   ```
   Client includes JWT in Authorization header → Server validates token → Grant access
   ```

4. **Refresh**:
   ```
   Client → POST /api/auth/refresh with refresh token → Server validates → Issue new JWT
   ```

## Badge Creation Flow

1. **Form Submission**:
   ```
   User fills form → Client validates → POST /api/badges → Server validates → Create badge
   ```

2. **Image Processing**:
   ```
   User uploads image → Client-side cropping → Convert to appropriate format → Upload with form
   ```

3. **Badge Storage**:
   ```
   Server receives data → Save to database → Generate badge URL → Return badge details
   ```

## Badge Issuance Flow

1. **Recipient Selection**:
   ```
   Issuer selects badge → Selects recipients → Adds evidence (optional) → Submits form
   ```

2. **Assertion Creation**:
   ```
   Server receives request → Validates permissions → Creates assertions → Generates verification
   ```

3. **Notification**:
   ```
   Server creates assertions → Sends email notifications → Returns success status
   ```

## Frontend Components

### Badge Components

```
components/badges/
├── BadgeCard.vue           # Badge display card
├── BadgeForm.vue           # Badge creation/edit form
├── BadgeList.vue           # List of badges
├── BadgeDetail.vue         # Detailed badge view
├── BadgeImageUpload.vue    # Image upload with preview
├── BadgeIssuanceForm.vue   # Form for issuing badges
└── BadgeVerification.vue   # Badge verification display
```

### User Components

```
components/users/
├── UserProfile.vue         # User profile display
├── UserSettings.vue        # User settings form
├── UserBadgeCollection.vue # Display of earned badges
└── UserAvatar.vue          # User avatar display
```

### UI Components

```
components/ui/
├── Button.vue              # Reusable button
├── Card.vue                # Card container
├── Form.vue                # Form wrapper
├── Input.vue               # Form input
├── Select.vue              # Dropdown select
├── Modal.vue               # Modal dialog
└── Notification.vue        # Toast notifications
```

## Page Structure

### Main Pages

```
pages/
├── index.astro             # Landing page
├── badges/
│   ├── index.astro         # Badge explorer
│   ├── create.astro        # Badge creation
│   ├── [id].astro          # Badge details
│   └── issue.astro         # Badge issuance
├── profile/
│   ├── index.astro         # User profile
│   └── settings.astro      # User settings
└── auth/
    ├── login.astro         # Login page
    ├── register.astro      # Registration page
    └── reset-password.astro # Password reset
```

## Error Handling

### Frontend Error Handling

- Form validation with clear error messages
- API error handling with user-friendly notifications
- Fallback UI for failed data loading
- Offline detection and handling

### Backend Error Handling

- Structured error responses with status codes
- Validation error details
- Logging of errors with appropriate detail
- Rate limiting for security

## Testing Strategy

### Frontend Testing

- Component testing with Vitest
- End-to-end testing with Playwright
- Accessibility testing with axe-core
- Visual regression testing

### Backend Testing

- Unit testing with Bun test
- API endpoint testing
- Integration testing with database
- Performance testing

## Deployment Configuration

### Frontend Deployment

```yaml
# Example Netlify configuration
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://api.rollercoaster.dev/:splat"
  status = 200
```

### Backend Deployment

```dockerfile
# Example Dockerfile for backend
FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]
```

## Performance Considerations

### Frontend Optimization

- Code splitting for faster initial load
- Image optimization with responsive sizes
- Critical CSS extraction
- Caching strategies
- Lazy loading of non-critical components

### Backend Optimization

- Database query optimization
- Response caching where appropriate
- Rate limiting to prevent abuse
- Efficient file handling
- Connection pooling

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus management
- Alternative text for images

## Security Measures

- HTTPS for all communications
- CSRF protection
- XSS prevention
- Input validation
- Rate limiting
- Secure authentication practices
- Data encryption where necessary
- Regular security audits

## Monitoring and Analytics

- Error tracking with appropriate tool
- Performance monitoring
- User behavior analytics
- Feature usage tracking
- Server health monitoring

## Documentation

- API documentation with OpenAPI/Swagger
- Component documentation
- Setup and deployment guides
- User guides for key features
- Contribution guidelines
