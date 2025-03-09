# Development Plan: Neurodivergent Learning Platform with VS Code-Inspired UI

## Overview

This plan details the development of a VS Code-inspired learning platform specifically designed for neurodivergent users with ADHD and bipolar disorder. The platform will feature badge management, AI assistance, and focus-friendly features to support effective learning.

## Badge Types and Data Model

Based on the backend implementation, our badge data model includes:

```typescript
enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  content?: string;
  progress: number;
  status: BadgeStatus;
  requirements: BadgeRequirement[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  targetDate?: string;
  externalId?: string;
  externalSource?: string;
}

interface CreateBadgeDto {
  name: string;
  description: string;
  content?: string;
  progress: number;
  status: BadgeStatus;
  requirements: BadgeRequirement[];
  startDate?: string;
  targetDate?: string;
}

interface UpdateBadgeProgressDto {
  progress: number;
  requirements: { id: string; completed: boolean }[];
}
```

## Phase 1: Foundation & Component Structure (Week 1)

### Step 1: Project Setup & Architecture (1-2 days)
1. **Review and organize existing code**
   - Analyze current `editor.vue` prototype
   - Document components to extract and refactor
   - Define folder structure for organized components

2. **Setup Component Library Structure** (4 hours)
   - Organize UI components following shadcn patterns
   - Set up appropriate folder structure
   - Implement basic color tokens based on accessibility guidelines

### Step 2: Core UI Components Development (2-3 days)
1. **Layout Components** (1 day)
   - Create `MainLayout.vue` for 3-panel structure
   - Implement resizable panels with focus mode toggle
   - Add theme support for light/dark preferences

2. **File Explorer Components** (1 day)
   - Develop `FilesystemTree.vue` for badge navigation
   - Create `ProjectItem.vue` for folder/badge representation
   - Implement recursive folder structure with expand/collapse

3. **Editor Components** (1 day)
   - Create `EditorView.vue` for badge content display
   - Implement `FileTabs.vue` for open badge management
   - Add support for markdown content rendering

## Phase 2: Badge Management (Week 2)

### Step 1: Badge CRUD Operations (2 days)
1. **Badge Display Components** (1 day)
   - Create `BadgeCard.vue` for displaying badge overview
   - Implement `BadgeDetails.vue` for full badge information
   - Add `BadgeProgressIndicator.vue` for visual progress

2. **Badge Editing Components** (1 day)
   - Create `BadgeForm.vue` for creating/editing badges
   - Implement `RequirementsList.vue` for managing requirements
   - Add `BadgeTimeline.vue` for start/target date management

### Step 2: Progress Tracking (1-2 days)
1. **Progress Visualization** (1 day)
   - Develop `ProgressBar.vue` with customized appearance
   - Create `BadgeProgressPanel.vue` for detailed progress tracking
   - Implement `RequirementCheckbox.vue` with visual feedback

2. **State Management Integration** (1 day)
   - Connect badge components to API services
   - Implement proper state management for real-time updates
   - Add persistent storage for offline capabilities

## Phase 3: AI Assistant Integration (Week 3)

### Step 1: AI Chat Interface (2 days)
1. **Chat Components** (1 day)
   - Create `AIAssistantPanel.vue` for the right sidebar
   - Implement `ChatHistory.vue` for message display
   - Develop `ChatInput.vue` for user interaction

2. **AI Integration** (1 day)
   - Connect to badge-engine API for AI responses
   - Implement context-aware badge suggestions
   - Add progress guidance functionality

### Step 2: Accessibility & UX Enhancements (2 days)
1. **Accessibility Improvements** (1 day)
   - Implement keyboard shortcuts for common actions
   - Add focus management for neurodivergent users
   - Ensure proper ARIA attributes throughout

2. **Neurodivergent-Specific Features** (1 day)
   - Add focus mode to minimize distractions
   - Implement customizable UI density options
   - Create visual timing aids for ADHD users

## Phase 4: Polish & Documentation (Week 4)

### Step 1: Storybook Documentation (2 days)
1. **Component Documentation** (1 day)
   - Document all components with props and usage examples
   - Add accessibility information for each component
   - Create sample integration stories

2. **User Guide Documentation** (1 day)
   - Create usage guides for the platform
   - Document keyboard shortcuts and focus features
   - Add neurodivergent-specific usage recommendations

### Step 2: Testing & Refinement (2 days)
1. **Component Testing** (1 day)
   - Write unit tests for key components
   - Perform integration testing for main workflows
   - Address bugs and edge cases

2. **User Experience Testing** (1 day)
   - Conduct usability testing with neurodivergent users
   - Gather feedback on cognitive load and focus features
   - Make final adjustments based on feedback

## Component Structure

```
frontend/
  ├── components/
  │   ├── ui/               # Base UI components (shadcn)
  │   │   ├── button/
  │   │   ├── card/
  │   │   ├── dialog/
  │   │   └── ...
  │   ├── layout/           # Layout components
  │   │   ├── MainLayout.vue
  │   │   ├── FilesystemSidebar.vue
  │   │   ├── EditorPanel.vue
  │   │   └── AIPanel.vue
  │   ├── filesystem/       # File explorer components
  │   │   ├── FilesystemTree.vue
  │   │   ├── FolderItem.vue
  │   │   └── BadgeItem.vue
  │   ├── editor/           # Editor components
  │   │   ├── FileTabs.vue
  │   │   ├── EditorView.vue
  │   │   └── MarkdownRenderer.vue
  │   ├── badge/            # Badge-specific components
  │   │   ├── BadgeCard.vue
  │   │   ├── BadgeDetails.vue
  │   │   ├── BadgeForm.vue
  │   │   ├── BadgeProgressPanel.vue
  │   │   └── RequirementsList.vue
  │   └── ai/               # AI assistant components
  │       ├── AIAssistantPanel.vue
  │       ├── ChatHistory.vue
  │       ├── ChatMessage.vue
  │       └── ChatInput.vue
  ├── pages/
  │   └── editor.vue        # Main editor page
  ├── services/
  │   ├── badgeService.ts   # Badge API service
  │   └── aiService.ts      # AI assistant service
  ├── types/
  │   └── badge.ts          # Badge type definitions
  └── assets/
      └── styles/
          ├── colors.css    # Color tokens
          └── editor-theme.css # VS Code-inspired theming
```

## Implementation Plan (Week 1 Detailed)

### Day 1: Project Setup & Initial Components
1. Define Badge data model with TypeScript interfaces
2. Create basic MainLayout component with 3-panel structure
3. Implement theme switching functionality
4. Extract existing code from editor.vue into component structure

### Day 2: File Explorer Components
1. Create FilesystemTree component for navigation
2. Implement recursive folder structure with expand/collapse
3. Add badge item display with status indicators
4. Implement badge filtering and search

### Day 3: Editor Panel Components
1. Create EditorView component for badge content
2. Implement FileTabs for managing open badges
3. Add badge content rendering with formatting
4. Create badge details form component

### Day 4: Badge Management
1. Implement badge creation functionality
2. Create badge editing components
3. Add requirement management with checkboxes
4. Implement progress calculation logic

### Day 5: Progress Visualization
1. Create BadgeProgressPanel component
2. Implement progress bar visualization
3. Add timeline visualization for badges
4. Connect badge components to API services

## Neurodivergent-Specific UX Considerations

1. **ADHD-Friendly Features:**
   - High-contrast mode option
   - Focus mode to hide non-essential UI elements
   - Visual progress indicators
   - Task breakdown with clear completion steps
   - Timer integration for time management
   - Notification management with reduced distractions

2. **Cognitive Load Reduction:**
   - Consistent UI patterns throughout
   - Clear visual hierarchy
   - Reduced animation effects (optional)
   - Keyboard shortcuts with visible hints
   - Context-aware help
   - Progressive disclosure of complex features

3. **Emotional Regulation Support:**
   - Positive reinforcement for completed tasks
   - Non-punitive progress tracking
   - Adjustable energy level settings for tasks
   - Mood tracking integration (optional)
   - Adaptive difficulty based on current capacity

4. **Visual Considerations:**
   - Color schemes tested for colorblindness
   - Adjustable font sizes and spacing
   - Reduced visual clutter
   - Clear distinctions between interactive and static elements
   - Consistent iconography with text labels

## Component Implementation Status

### Completed Components
- [x] MainLayout.vue (components/layout/MainLayout.vue)
- [x] FilesystemTree.vue (components/filesystem/FilesystemTree.vue)
- [x] FileSystemNode.vue (components/filesystem/FileSystemNode.vue)
- [x] EditorView.vue (components/editor/EditorView.vue)
- [x] AIAssistantPanel.vue (components/ai/AIAssistantPanel.vue)
- [x] BadgeOverview.vue (components/badge/BadgeOverview.vue) - Comprehensive implementation that includes:
  - [x] Badge title and description display
  - [x] Progress bar visualization (partially overlaps with BadgeProgressPanel)
  - [x] Requirements list with completion status (partially overlaps with RequirementsList)
  - [x] Badge timeline with start/target dates
  - [x] Edit and delete actions
  - [x] Badge metadata display
- [x] BadgeService (services/badgeService.ts) - Full CRUD operations for badges
- [x] BadgeForm.vue (for creating/editing badges) - Added in latest implementation
- [x] RequirementsList.vue (components/badge/RequirementsList/index.vue) - Interactive standalone component
- [x] BadgeCard.vue (components/badge/BadgeCard.vue) - For displaying badges in list view
- [x] Badge List component (components/Badge/List/index.vue) - For displaying badge collections
- [x] FileTabs.vue (components/editor/FileTabs.vue) - For VS Code-like navigation between badges
- [x] CreateModal.vue (components/Badge/CreateModal/index.vue) - Modal for badge creation and editing

### Pending Components
- [ ] BadgeDetails.vue (as a standalone component)
- [ ] BadgeProgressPanel.vue (as a standalone component)
- [ ] ChatHistory.vue
- [ ] ChatMessage.vue
- [ ] ChatInput.vue

### In Progress
- [~] Badge type definitions (types/badge.ts) - Good foundation but may need extensions
- [~] Tests for badge components (some tests exist but need more coverage)

### Storybook Documentation
- [x] Created stories for Badge components:
  - [x] BadgeList component
  - [x] CreateModal component
  - [x] RequirementsList component
  - [x] BadgeCard component
- [x] Created stories for Editor components:
  - [x] FileTabs component
- [x] Created stories for Chat components:
  - [x] ChatMessage component
  - [x] ChatInput component
  - [x] ChatHistory component
- [x] Created stories for AI components:
  - [x] AIAssistantPanel component
- [x] Added interactive play tests for all components
  - [x] Form submission tests for BadgeForm/CreateModal
  - [x] Requirement toggling, editing, and deleting tests
  - [x] Badge viewing, editing, and deleting tests
  - [x] Tab navigation and closure tests
  - [x] List interaction tests including error states
  - [x] Chat input and message sending tests
  - [x] Chat suggestion selection tests
  - [x] AI panel collapsing/expanding tests
- [x] Fixed story paths to properly reference components
- [x] Configured Storybook with Tailwind CSS support
- [x] Set up theme support for both light and dark modes
- [x] Consolidated CSS variables in editor-theme.css
- [ ] Document component props and usage examples
- [ ] Add accessibility information

### Next Components to Implement (Priority Order)
1. ✅ **ChatHistory.vue** - For AI assistant conversation display
2. ✅ **ChatMessage.vue** - For displaying AI and user messages
3. ✅ **ChatInput.vue** - For user input in AI assistant
4. **BadgeDetails.vue** - As a standalone component for detailed badge view
5. **BadgeProgressPanel.vue** - For detailed progress tracking view

## Implementation Timeline

### Week 1: Core Badge Components ✅
- **Day 1-2:** Create BadgeForm.vue component for badge creation/editing ✅
  - Design form layout with proper validation ✅
  - Implement requirement management section ✅
  - Add date picker for start/target dates ✅
  - Connect to badgeService for create/update operations ✅

- **Day 3-4:** Create BadgeCard.vue for list view display ✅
  - Design compact card layout with progress indicator ✅
  - Implement status indicators and action buttons ✅
  - Add hover interactions and accessibility features ✅

- **Day 5:** Develop RequirementsList.vue as a standalone component ✅
  - Create interactive checklist with add/edit/delete capabilities ✅
  - Implement progress calculation and synchronization ✅
  - Add keyboard navigation for accessibility ✅

### Week 2: VS Code UI Components & Storybook (In Progress)
- **Day 1-2:** Extract FileTabs.vue from editor.vue ✅
  - Implement tabbed navigation with close buttons ✅
  - Add tab context menu functionality ✅
  - Support badge drag-and-drop to reorder (Pending for future enhancement)

- **Day 3-5:** Create Storybook documentation for all components ✅
  - Documentation for BadgeList, CreateModal, RequirementsList ✅
  - Interactive play tests for user interactions ✅
  - Stories for BadgeCard and FileTabs components ✅
  - Additional test cases for error states and edge conditions ✅
  - Pending: Add accessibility guidelines and keyboard support documentation

### Week 3: AI Integration & Neurodivergent Features (In Progress)
- **Day 1-3:** Develop AI Chat components ✅
  - ✅ Implement ChatHistory, ChatMessage, and ChatInput components
  - ✅ Design context-aware badge suggestions
  - ✅ Add progress guidance functionality with typing indicators

- **Day 4-5:** Enhance neurodivergent-specific features
  - Add focus mode to minimize distractions
  - Implement customizable UI density options
  - Create visual timing aids for ADHD users

## Updated Action Plan

1. **Implementation Tasks (Completed)** ✅
   - Extracted BadgeForm component with form validation ✅
   - Created BadgeCard component for list view display ✅
   - Implemented standalone RequirementsList component ✅
   - Extracted FileTabs component from editor.vue ✅
   - Created CreateModal component for badge creation and editing ✅
   - Implemented Badge List component for displaying collections ✅
   - Developed AI Chat components (History, Message, Input) ✅
   - Added proper component namespacing for Nuxt auto-imports ✅

2. **Critical Components Done** ✅
   - FilesystemTree.vue component for badge navigation ✅
   - Badge component with state management ✅ (BadgeOverview.vue)
   - VS Code-inspired layout and styling ✅ (MainLayout.vue)
   - Color tokens for neurodivergent users ✅ (in editor.vue CSS)
   - Form components for badge creation/editing ✅ (BadgeForm.vue, CreateModal.vue)
   - List components for badge display ✅ (BadgeCard.vue, List.vue)
   - Requirements management ✅ (RequirementsList.vue)
   - VS Code-like tab navigation ✅ (FileTabs.vue)
   - AI Assistant UI components ✅ (ChatHistory, ChatMessage, ChatInput)

3. **Next Implementation Tasks**
   - Implement standalone BadgeDetails.vue component
   - Create BadgeProgressPanel.vue for detailed progress tracking
   - Develop neurodivergent-friendly features:
     - Focus mode toggle for minimal UI
     - Customizable UI density options
     - Visual timing aids for ADHD users
   - Complete Storybook documentation for all components
   - Add accessibility guidelines and keyboard support

4. **Final Steps**
   - Integrate all components with the main editor.vue page
   - Implement remaining components:
     - BadgeDetails.vue
     - BadgeProgressPanel.vue
   - Add neurodivergent-friendly features:
     - Focus mode toggle
     - UI density options
     - Visual timing aids
   - Complete testing of all components and interactions

5. **Technical Focus Areas (In Progress) ✅**
   - ✅ Component separation and reusability
   - ✅ Vue 3 Composition API implementation
   - ✅ TypeScript type safety throughout components
   - ✅ Nuxt auto-imports for clean component usage
   - ✅ Smooth transitions and state changes for neurodivergent users
   - ⏳ Keyboard accessibility and navigation
   - ⏳ Cognitive load reduction with clear visual cues