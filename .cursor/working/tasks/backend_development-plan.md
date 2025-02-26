# Development Plan for Neurodivergent Badge Platform

## Project Context for Cursor AI
This is a badge-based learning platform designed specifically for neurodivergent users (ADHD, bipolar, etc.). The platform allows users to:
- Create badges that represent learning goals
- Break goals into verifiable steps
- Track progress despite focus/energy fluctuations
- Build skill trees similar to video games
- Verify completion through AI or peer validation

The architecture uses Vue/Nuxt frontend, Bun/Hono backend API, and will integrate with an existing Open Badges v3 server (in Python) rather than reimplementing the badge standard.

## Development Phases

### Phase 1: Core Badge Creation (2-3 weeks)
**Focus**: Building the minimal components needed to create and save a badge

1. **Set up Hono API with Bun (Days 1-3)**
   - Create basic project structure with TypeScript
   - Set up database connection (PostgreSQL)
   - Implement simple health check endpoint
   - Create Docker setup for local development

2. **Design Badge Data Model (Days 4-7)**
   - Define Badge schema (title, description, steps, owner, etc.)
   - Create database migrations
   - Implement basic CRUD operations in API
   - Add validation for badge data

3. **Connect Nuxt Frontend to API (Days 8-14)**
   - Create badge creation form component
   - Implement form validation
   - Set up API client in Nuxt
   - Add badge listing page
   - Implement basic styling for MVP

4. **Add Simple Authentication (Days 15-21)**
   - Set up user model in database
   - Implement simple JWT authentication
   - Create login/signup pages
   - Add protected routes

### Phase 2: Badge Server Integration (2-3 weeks)
**Focus**: Connecting to an existing Open Badges server

1. **Research and Select Badge Server (Days 1-3)**
   - Evaluate existing Open Badges v3 servers
   - Document API endpoints needed
   - Create test instances

2. **Create Badge Server Adapter (Days 4-10)**
   - Implement adapter pattern to abstract badge server interactions
   - Create service layer for translating between your app and badge server
   - Implement error handling for badge server outages

3. **Extend Frontend for Badge Standards (Days 11-21)**
   - Add Open Badges metadata to creation form
   - Create badge visualization component
   - Implement export functionality

### Phase 3: Neurodivergent-Specific Features (3-4 weeks)
**Focus**: Adding features that specifically help neurodivergent users

1. **Progress Tracking (Days 1-7)**
   - Implement step completion tracking
   - Create progress visualization
   - Add "resume where you left off" feature

2. **Skill Trees (Days 8-14)**
   - Design skill tree data model
   - Create visual skill tree editor
   - Implement prerequisite logic

3. **Verification System (Days 15-28)**
   - Implement peer verification requests
   - Create AI verification option for objective criteria
   - Add verification history

## Development Notes for Cursor AI

### Code Structure Guidelines
- Keep files small and focused (<200 lines when possible)
- Group related functionality in directories
- Use TypeScript interfaces for all data models
- Document public APIs with JSDoc comments

### ADHD-Friendly Implementation Tips
- Prioritize completing one feature before starting another
- Add extensive comments at decision points
- Create clear visual separation between components
- Implement automated tests for critical paths

### Database Design
```sql
-- Core tables sketch
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id INTEGER REFERENCES users(id),
  badge_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE badge_steps (
  id SERIAL PRIMARY KEY,
  badge_id INTEGER REFERENCES badges(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  verification_type VARCHAR(50) -- 'ai', 'peer', 'self'
);

CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  badge_id INTEGER REFERENCES badges(id),
  step_id INTEGER REFERENCES badge_steps(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  verification_evidence TEXT
);
```

## First Steps for Implementation

1. Start with the Hono API setup and database connection
2. Create database migrations for users and badges tables
3. Implement badge creation API endpoints
4. Connect your existing Nuxt frontend to the API

After completing these steps, we'll evaluate the best Open Badges server to integrate with based on your specific requirements.
