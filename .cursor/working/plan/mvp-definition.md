# MVP Definition: Classic Open Badges Flow

This document defines the Minimum Viable Product (MVP) for Rollercoaster.dev, focusing on implementing the core Open Badges flow while laying the foundation for future expansion.

## MVP Goals

The MVP aims to:

1. Implement the fundamental Open Badges standard functionality
2. Provide a clean, accessible user interface
3. Establish the technical foundation for future features
4. Deliver immediate value to early users
5. Validate core assumptions about user needs

## MVP Scope

### 1. Badge Creation

- Create badge classes with required metadata
- Upload and crop badge images
- Define criteria for earning badges
- Set up badge categories and tags
- Create badge templates

### 2. Badge Issuance

- Issue badges to recipients
- Generate verifiable badge assertions
- Email notifications to recipients
- Batch issuance capabilities
- Revocation functionality

### 3. Badge Display

- User profile with earned badges
- Badge details view with metadata
- Verification of badge authenticity
- Basic badge sharing options
- Simple badge collection view

### 4. User Management

- User registration and authentication
- Profile management
- Role-based permissions:
  - Admin: Full system access
  - Issuer: Can create and issue badges
  - Earner: Can receive and display badges

## Out of MVP Scope

The following features are planned for future releases:

- VS Code/Obsidian-style workspace interface
- Skill tree visualization
- AI assistance features
- Advanced social and community features
- Complex learning paths
- Mobile applications

## User Stories

### Badge Creators/Issuers

1. As an issuer, I want to create a badge with appropriate metadata so that I can recognize specific achievements.
2. As an issuer, I want to upload and crop a badge image so that my badges have visual appeal.
3. As an issuer, I want to define clear criteria for a badge so that earners understand how to achieve it.
4. As an issuer, I want to issue badges to individuals so that I can recognize their achievements.
5. As an issuer, I want to issue badges to multiple people at once so that I can efficiently recognize group achievements.
6. As an issuer, I want to view analytics on my issued badges so that I can understand engagement patterns.

### Badge Earners

1. As an earner, I want to view badges available to me so that I can set learning goals.
2. As an earner, I want to receive notifications when I earn a badge so that I'm aware of my achievements.
3. As an earner, I want to display my earned badges on my profile so that others can see my accomplishments.
4. As an earner, I want to verify the authenticity of my badges so that I can trust their validity.
5. As an earner, I want to share specific badges on social media so that I can showcase my achievements.

### Administrators

1. As an admin, I want to manage user accounts so that I can ensure proper system access.
2. As an admin, I want to review and approve badge issuers so that badge quality is maintained.
3. As an admin, I want to monitor system usage so that I can plan for scaling and improvements.

## Technical Components

### Frontend (Astro + Vue)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro             # Landing page
│   │   ├── badges/
│   │   │   ├── index.astro         # Badge explorer
│   │   │   ├── create.astro        # Badge creation
│   │   │   ├── [id].astro          # Badge details
│   │   │   └── issue.astro         # Badge issuance
│   │   ├── profile/
│   │   │   ├── index.astro         # User profile
│   │   │   └── settings.astro      # User settings
│   │   └── auth/                   # Authentication pages
│   ├── components/
│   │   ├── badges/                 # Badge-related components
│   │   ├── auth/                   # Authentication components
│   │   └── ui/                     # Reusable UI components
│   ├── layouts/                    # Page layouts
│   └── lib/                        # Utilities and services
└── public/                         # Static assets
```

### Backend (Bun + Hono)

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts                 # Authentication endpoints
│   │   ├── badges.ts               # Badge management endpoints
│   │   └── users.ts                # User management endpoints
│   ├── services/
│   │   ├── badge.ts                # Badge-related services
│   │   └── user.ts                 # User-related services
│   ├── middleware/                 # Request middleware
│   └── utils/                      # Utility functions
└── tests/                          # Backend tests
```

### Integration with Existing Components

- **bun-badges**: Core badge server integration
- **openbadges-types**: Type definitions for badge data

## Data Models

### Core Models (from openbadges-types)

- **Badge Class**: Template for a badge type
- **Badge Assertion**: Instance of a badge issued to a recipient
- **Issuer**: Entity creating and awarding badges
- **Recipient**: Person receiving a badge
- **Evidence**: Proof of achievement for a badge
- **Criteria**: Requirements for earning a badge

### Additional MVP Models

- **User**: Platform user information
- **Profile**: User profile data
- **Role**: User permission roles
- **Category**: Badge categorization

## User Interface Design

### Design Principles

- Clean, accessible interface
- Mobile-responsive layouts
- Clear information hierarchy
- Consistent visual language
- Accessibility compliance

### Key Screens

1. **Badge Explorer**: Browse available badges
2. **Badge Creation Form**: Create new badge classes
3. **Badge Detail View**: View badge information
4. **Badge Issuance Form**: Issue badges to recipients
5. **User Profile**: Display earned badges
6. **Authentication Screens**: Login, registration, password reset

## Implementation Plan

### Phase 1: Project Setup (Week 1)

- Set up Astro project with Vue integration
- Configure communication with Bun/Hono backend
- Implement basic layouts and navigation
- Set up authentication foundation

### Phase 2: Badge Management (Weeks 2-3)

- Implement badge class creation
- Build badge image upload and processing
- Create badge listing and filtering
- Develop badge detail views

### Phase 3: Badge Issuance (Weeks 4-5)

- Implement badge issuance workflow
- Create recipient notification system
- Build badge verification
- Develop batch issuance functionality

### Phase 4: User Profiles (Week 6)

- Implement user profiles
- Create badge collection display
- Build badge sharing functionality
- Develop user settings

### Phase 5: Testing & Refinement (Weeks 7-8)

- End-to-end testing of badge workflows
- Performance optimization
- Accessibility testing and improvements
- Bug fixes and refinements

## Deployment Strategy

- Development environment for ongoing work
- Staging environment for testing
- Production environment for public access
- Automated deployment pipeline
- Backup and recovery procedures

## Success Metrics

- Number of badges created
- Number of badges issued
- User registration and retention
- System performance metrics
- User satisfaction feedback

## Future Roadmap

After MVP completion, development will focus on:

1. **Phase 1 Extension**: Enhanced badge features and improved UX
2. **VS Code Interface**: Implementation of the IDE-like workspace
3. **Skill Tree**: Development of visualization features
4. **Social Features**: Community and collaboration tools
5. **AI Integration**: Intelligent assistance features
