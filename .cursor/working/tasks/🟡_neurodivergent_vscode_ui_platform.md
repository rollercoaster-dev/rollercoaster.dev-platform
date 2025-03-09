# Neurodivergent Learning Platform with VS Code-Inspired UI

## 1. Goal
- **Objective:** Create a VS Code-inspired learning platform specifically designed for neurodivergent users (ADHD, bipolar) with badge management, AI assistance, and focus-friendly features
- **Energy Level:** High 🔋
- **Status:** 🟡 In Progress

## 2. Resources
- **Existing Tools/Files:**
  - Frontend: Vue.js with Tailwind CSS and shadcn
  - Current prototype in `frontend/pages/editor.vue`
  - Storybook for component documentation
  - Color system design rules in `color_and_accessibility_rule.mdc`
  - Component guidelines in `components_development_rule.mdc`
- **Additional Needs:**
  - Component organization structure
  - Badge data structure definition
  - AI integration plan
  - Database connectivity
- **Related Files:**
  - `frontend/pages/editor.vue` (initial mockup)
  - To be created:
    - `components/ui/*` (shadcn components)
    - `components/layout/*` (layout components)
    - `components/Badge/*` (badge-specific components)

## 3. Ideas & Challenges
- **Approaches:**
  - Three-panel VS Code-like interface:
    - Left: Badge navigation and folder structure (filesystem explorer)
    - Middle: Badge viewing and editing area (editor)
    - Right: AI assistant chat interface (assistant panel)
  - Color system designed for neurodivergent users (reduce cognitive load)
  - Focus mode to minimize distractions
  - Progress tracking with visual indicators
  - Use recursive components for file tree
  - Implement drag-and-drop for badge organization
  - Add keyboard shortcuts for common actions
- **Potential Issues:**
  - Balancing feature richness with cognitive load management
  - Creating intuitive badge creation flow
  - Ensuring accessibility for various neurodivergent needs
  - Managing state between components
  - Ensuring smooth transitions for neurodivergent users
  - Maintaining performance with real-time updates
- **Decision Log:**
  - Decision: Use VSCode-like interface
    - Reasoning: Familiar developer experience, modular panel structure
    - Alternatives: Custom dashboard layout, app-style interface
  - Decision: Include AI assistant panel
    - Reasoning: Provide guidance, reduce friction in learning process
    - Alternatives: Separate AI interface, on-demand AI access
  - Decision: Use Vue 3 with TypeScript and script setup
    - Reasoning: Strong type safety and better maintainability
    - Alternatives: React, Svelte

## 4. Plan
- **Quick Wins:**
  - [ ] Refactor existing editor.vue into component structure (15 mins)
  - [ ] Define badge data model structure (10 mins)
  - [ ] Create storybook setup for components (20 mins)
  - [ ] Set up basic project structure (5 mins)
  - [ ] Initialize color tokens (10 mins)
- **Major Steps:**
  1. Component Structure: Break down the UI into reusable components 🎯 (2 hours)
     - FilesystemTree.vue component (badge navigation)
     - ProjectItem.vue component (badge/folder items)
     - EditorView.vue (badge content display)
     - FileTabs.vue (badge tabs)
     - BadgeProgressPanel.vue (progress tracking)
     - AIAssistantPanel.vue (AI chat interface)
     - ChatHistory.vue (message display)
     - ChatInput.vue (user input)
  
  2. Badge Management: Create core badge functionality 🎯 (3 hours)
     - Badge creation, editing, and progress tracking
     - Badge visualization component
     - Requirements management
     - Progress indicators
     - Timeline visualization
  
  3. AI Integration: Implement AI assistant panel 🎯 (2 hours)
     - Chat interface with message history
     - Badge creation assistance
     - Progress guidance
     - Learning recommendations
  
  4. Storybook Documentation: Document all components 🎯 (2 hours)
     - Component props, variants, and usage examples
     - Accessibility considerations
     - Interactive demos
     - Integration examples

## 5. Execution
- **Progress Updates:**
  - [x] Initial prototype created in editor.vue
  - [ ] Component Structure: Initial prototype in place, needs refactoring
  - [ ] Badge Management: Basic badge structure defined
  - [ ] AI Integration: Placeholder chat interface created
  - [ ] Storybook Documentation: Not started
- **Context Resume Point:**
  Last working on: Initial prototype in editor.vue
  Next planned action: Refactor into component structure
  Current blockers: None

## 6. Next Actions & Blockers
- **Immediate Next Actions:** 
  - [ ] Create FilesystemTree.vue component for badge navigation (2 hours)
  - [ ] Extract Badge component with proper state management (30 mins)
  - [ ] Set up basic styling with color tokens (1 hour)
  - [ ] Implement file tree recursion logic (2 hours)
  - [ ] Define badge progress visualization component (30 mins)
- **Current Blockers:**
  - None at this stage

## 7. Reflections
- **Observations:** 
  - The VSCode interface provides a familiar environment that can be adapted for learning management
  - Initial mockup provides good foundation but needs proper component separation
  - Need to ensure accessibility improvements in all components
- **Focus Analysis:** 
  - Need to ensure that while maintaining the VSCode aesthetic, we optimize for reducing cognitive load
  - Breaking down components will help maintain focus during implementation
- **Celebration Notes:** 
  - 🎉 Initial prototype shows promising direction for the learning platform
  - 🎉 Successfully created initial mockup with basic functionality
  - 🎉 Identified all major components needed
  - 🎉 Clear understanding of accessibility requirements 