# Rollercoaster.dev: Full Vision Architecture

This document outlines the complete vision for the Rollercoaster.dev platform, a comprehensive Open Badges-based learning and goal management system designed specifically for neurodivergent users.

## System Overview

Rollercoaster.dev is a platform where users can:
- Create and manage personal learning goals using Open Badges
- Create badges that others can earn
- Visualize learning progress through skill trees
- Engage in positive social interaction and mentoring
- Use an IDE-like interface for badge and learning path management
- Leverage AI assistance for badge creation and learning support

## Architecture Components

```
rollercoaster.dev/
├── platform/                # Main platform
│   ├── frontend/           # Astro + Vue frontend
│   ├── backend/            # Bun/Hono API
│   └── shared/             # Shared code
├── bun-badges/             # Badge server
└── openbadges-types/       # Types package
```

### Frontend (Astro + Vue)

The frontend uses Astro for content-heavy pages with Vue components for interactive elements:

```
frontend/
├── src/
│   ├── pages/              # Astro pages
│   │   ├── workspace/      # IDE-like workspace
│   │   ├── skill-tree/     # Skill tree visualization
│   │   └── community/      # Social features
│   ├── components/
│   │   ├── workspace/      # IDE components
│   │   ├── skill-tree/     # Visualization components
│   │   └── ui/             # Reusable UI components
│   ├── content/            # Astro content collections
│   │   ├── badges/         # Badge templates
│   │   └── paths/          # Learning paths
│   └── lib/                # Utilities and services
└── public/                 # Static assets
```

### Backend (Bun + Hono)

The backend provides API services for the platform:

```
backend/
├── src/
│   ├── routes/             # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── badges/         # Badge management endpoints
│   │   ├── users/          # User management endpoints
│   │   └── social/         # Social feature endpoints
│   ├── services/           # Business logic
│   │   ├── badge/          # Badge-related services
│   │   ├── user/           # User-related services
│   │   └── ai/             # AI integration services
│   ├── middleware/         # Request middleware
│   └── utils/              # Utility functions
└── tests/                  # Backend tests
```

### Badge Server (bun-badges)

A dedicated server for Open Badges operations:

- Badge creation and issuance
- Badge verification
- Badge storage and retrieval
- Open Badges standard compliance

### Shared Types (openbadges-types)

TypeScript definitions for Open Badges data structures:

- Badge class definitions
- Assertion structures
- Issuer information
- Evidence and verification

## Key Features

### 1. VS Code/Obsidian-Style Interface

The workspace interface mimics popular IDE layouts:

- **Left Sidebar**: Badge/path explorer
- **Main Area**: Badge editor with tabs
- **Right Sidebar**: Properties, relationships, metadata
- **Bottom Panel**: Terminal/console for commands or AI assistance

Features include:
- Drag-and-drop organization
- Split views
- Command palette
- Extensible panel system
- Markdown editing for badge descriptions

### 2. Skill Tree Visualization

Interactive visualization of badges and learning paths:

- Hierarchical tree view
- Force-directed graph for relationships
- Timeline view for progression
- Interactive navigation (zoom, pan, expand/collapse)
- Filtering and highlighting

### 3. Social Learning Features

Community features to encourage positive interaction:

- Mentoring connections
- Badge sharing and showcasing
- Learning groups
- Progress celebration
- Feedback and encouragement

### 4. AI Integration

AI assistance throughout the platform:

- Badge creation guidance
- Learning path recommendations
- Difficulty assessment
- Learning assistance
- Progress analysis

## Data Flow

1. **Badge Creation Flow**:
   ```
   User → Frontend Workspace → Backend API → Badge Server → Database
   ```

2. **Badge Issuance Flow**:
   ```
   Issuer → Frontend → Backend API → Badge Server → Recipient Notification
   ```

3. **Skill Tree Visualization Flow**:
   ```
   Database → Backend API → Frontend → D3.js Visualization
   ```

4. **Social Interaction Flow**:
   ```
   User A → Frontend → Backend API → Database → User B
   ```

## Technology Stack

- **Frontend**: Astro, Vue 3, TailwindCSS, D3.js
- **Backend**: Bun, Hono, PostgreSQL/SQLite
- **Badge Server**: Bun, Open Badges standard implementation
- **Authentication**: JWT, secure cookies
- **Real-time Features**: WebSockets, Server-Sent Events
- **AI Integration**: Self-hosted models or EU-based providers

## Privacy and Data Sovereignty

As a non-profit based in Germany, the platform prioritizes:

- Full data sovereignty
- GDPR compliance
- Minimal external dependencies
- Self-hosted services
- Open-source components
- Transparent data handling

## Future Expansion

The architecture supports future expansion:

- Mobile applications
- Offline badge earning
- Integration with learning management systems
- Advanced analytics
- Expanded AI capabilities
- API for third-party integrations
