# Neurodivergent Learning Platform (VSCode-like Interface)

## 1. Goal
- **Objective:** Create a VSCode-like learning platform specifically designed for neurodivergent users (ADHD, bipolar) with badge management, AI assistance, and focus-friendly features
- **Energy Level:** High 🔋
- **Status:** 🟡 In Progress

## 2. Resources
- **Existing Tools/Files:**
  - Frontend: Vue.js with Tailwind CSS and shadcn
  - Storybook for component documentation
  - Current prototype in `frontend/pages/editor.vue`
- **Additional Needs:**
  - Component organization structure
  - Badge data structure definition
  - AI integration plan
- **Related Files:**
  - `frontend/pages/editor.vue`

## 3. Ideas & Challenges
- **Approaches:**
  - VSCode-like interface with three main sections:
    - Left: Badge navigation and folder structure
    - Middle: Badge viewing and editing area
    - Right: AI assistant chat interface
  - Color system designed for neurodivergent users (reduce cognitive load)
  - Focus mode to minimize distractions
  - Progress tracking with visual indicators
- **Potential Issues:**
  - Balancing feature richness with cognitive load management
  - Creating intuitive badge creation flow
  - Ensuring accessibility for various neurodivergent needs
- **Decision Log:**
  - Decision: Use VSCode-like interface
    - Reasoning: Familiar developer experience, modular panel structure
    - Alternatives: Custom dashboard layout, app-style interface
  - Decision: Include AI assistant panel
    - Reasoning: Provide guidance, reduce friction in learning process
    - Alternatives: Separate AI interface, on-demand AI access

## 4. Plan
- **Quick Wins:**
  - [ ] Refactor existing editor.vue into component structure (15 mins)
  - [ ] Define badge data model structure (10 mins)
  - [ ] Create storybook setup for components (20 mins)
- **Major Steps:**
  1. Component Structure: Break down the UI into reusable components following shadcn conventions 🎯 (2 hours)
  2. Badge Management: Create core badge creation, editing, and progress tracking functionality 🎯 (3 hours)
  3. AI Integration: Implement AI assistant panel with chat interface 🎯 (2 hours)
  4. Storybook Documentation: Document all components with stories and usage examples 🎯 (2 hours)

## 5. Execution
- **Progress Updates:**
  - [ ] Component Structure: Initial prototype in place in editor.vue
  - [ ] Badge Management: Basic badge structure defined in editor.vue
  - [ ] AI Integration: Placeholder chat interface created
  - [ ] Storybook Documentation: Not started
- **Context Resume Point:**
  Last working on: Initial prototype in editor.vue
  Next planned action: Refactor into component structure
  Current blockers: None

## 6. Next Actions & Blockers
- **Immediate Next Actions:** 
  - [ ] Create Badge component with proper state management (30 mins)
  - [ ] Extract sidebar navigation component (20 mins)
  - [ ] Define badge progress visualization component (30 mins)
- **Current Blockers:**
  - None at this stage

## 7. Reflections
- **Observations:** The VSCode interface provides a familiar environment that can be adapted for learning management
- **Focus Analysis:** Need to ensure that while maintaining the VSCode aesthetic, we optimize for reducing cognitive load
- **Celebration Notes:** 🎉 Initial prototype shows promising direction for the learning platform 