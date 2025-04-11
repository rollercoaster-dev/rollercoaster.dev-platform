# Task: Extract Components from index.vue

## Overview
This task involves identifying and extracting reusable atomic and molecular patterns from `frontend/pages/index.vue` into dedicated components. These components will improve code organization, maintainability, and reusability across the application.

## Estimated Time
- Total: 6-8 hours
- Component creation: 4-6 hours
- Refactoring index.vue: 1-2 hours
- Testing and adjustments: 1 hour

## Components to Extract

### Atomic Components

1. **ExternalLink Component**
   - **Source**: Lines 62-68, 69-77, 94-102, 432-441, 442-449, 595-603, 634-642, 643-649
   - **Implementation Location**: `components/rd/base/ExternalLink/index.vue`
   - **Props**:
     - `href`: string (required)
     - `text`: string (required)
     - `variant`: 'primary' | 'secondary' | 'outline' | 'accent' | 'text' (default: 'text')
     - `icon`: 'arrow-right' | 'arrow-up' | 'arrow-down' | 'none' (default: 'arrow-right')
     - `target`: string (default: '_blank')
     - `rel`: string (default: 'noopener noreferrer')
   - **Description**: Consistent styling for external links with optional icons and variants

2. **FeatureItem Component**
   - **Source**: Lines 129-132, 133-136, 137-140, etc.
   - **Implementation Location**: `components/rd/base/FeatureItem/index.vue`
   - **Props**:
     - `text`: string (required)
     - `icon`: string (default: '✓')
     - `iconColor`: string (default: 'text-accent')
   - **Description**: Checkmark list items with consistent styling for feature lists

3. **DecorativeBackground Component**
   - **Source**: Lines 36-46
   - **Implementation Location**: `components/rd/base/DecorativeBackground/index.vue`
   - **Props**:
     - `topColor`: string (default: 'bg-primary/5')
     - `bottomColor`: string (default: 'bg-accent/5')
     - `opacity`: number (default: 50)
   - **Description**: Decorative background elements with blurred circles

4. **GradientSectionHeading Component**
   - **Source**: Lines 86-90, 274-277, 394-397, 559-562
   - **Implementation Location**: `components/rd/base/SectionHeading/Gradient.vue`
   - **Props**:
     - `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 2)
     - `text`: string (required)
     - `align`: 'left' | 'center' | 'right' (default: 'center')
   - **Description**: Section headings with gradient text styling

### Molecular Components

1. **FeatureCard Component**
   - **Source**: Lines 109-144, 147-181, 184-219, 222-256
   - **Implementation Location**: `components/rd/base/FeatureCard/index.vue`
   - **Props**:
     - `title`: string (required)
     - `icon`: string (required)
     - `description`: string (required)
     - `features`: string[] (required)
   - **Description**: Cards with consistent header, content, feature list structure

2. **RoadmapItem Component**
   - **Source**: Lines 406-453, 456-481, 484-510, 513-541
   - **Implementation Location**: `components/rd/base/RoadmapItem/index.vue`
   - **Props**:
     - `number`: number (required)
     - `title`: string (required)
     - `badgeText`: string (required)
     - `badgeVariant`: 'default' | 'secondary' | 'outline' (default: 'default')
     - `description`: string (required)
     - `links`: { text: string, href: string }[] (optional)
     - `gradientFrom`: string (default: 'from-primary/5')
   - **Description**: Cards with number, title, badge, and content for roadmap items

3. **SectionHeader Component**
   - **Source**: Lines 85-104, 272-282, 393-402, 557-567
   - **Implementation Location**: `components/rd/base/SectionHeader/index.vue`
   - **Props**:
     - `title`: string (required)
     - `subtitle`: string (required)
     - `align`: 'left' | 'center' | 'right' (default: 'center')
   - **Description**: Section headers with title, subtitle, and consistent styling

4. **ActionCard Component**
   - **Source**: Lines 571-605, 608-651
   - **Implementation Location**: `components/rd/base/ActionCard/index.vue`
   - **Props**:
     - `title`: string (required)
     - `description`: string (required)
     - `features`: string[] (required)
     - `actions`: { text: string, href: string, variant: string }[] (required)
   - **Description**: Cards with title, content, feature list, and CTA buttons

5. **HeroSection Component**
   - **Source**: Lines 34-79
   - **Implementation Location**: `components/rd/base/HeroSection/index.vue`
   - **Props**:
     - `headline`: string (required)
     - `subheadline`: string (required)
     - `actions`: { text: string, href: string, variant: string }[] (required)
   - **Description**: Hero section with headline, subtitle, and CTA buttons

### Section Components

1. **FeaturesSection Component**
   - **Source**: Lines 84-266
   - **Implementation Location**: `components/rd/sections/Features/index.vue`
   - **Props**:
     - `title`: string (required)
     - `subtitle`: string (required)
     - `features`: { title: string, icon: string, description: string, features: string[] }[] (required)
     - `conclusion`: string (optional)
   - **Description**: Section showcasing features with cards

2. **VisionSection Component**
   - **Source**: Lines 271-386
   - **Implementation Location**: `components/rd/sections/Vision/index.vue`
   - **Props**:
     - `title`: string (required)
     - `subtitle`: string (required)
     - `challenge`: string (required)
     - `solution`: string (required)
     - `goals`: { title: string, icon: string, description: string }[] (required)
     - `conclusion`: string (optional)
   - **Description**: Section explaining vision and goals

3. **RoadmapSection Component**
   - **Source**: Lines 391-550
   - **Implementation Location**: `components/rd/sections/Roadmap/index.vue`
   - **Props**:
     - `title`: string (required)
     - `subtitle`: string (required)
     - `items`: RoadmapItem[] (required)
     - `conclusion`: string (optional)
   - **Description**: Section showing roadmap items

4. **GetInvolvedSection Component**
   - **Source**: Lines 554-654
   - **Implementation Location**: `components/rd/sections/GetInvolved/index.vue`
   - **Props**:
     - `title`: string (required)
     - `subtitle`: string (required)
     - `cards`: ActionCard[] (required)
   - **Description**: Section with call to action cards

## Implementation Approach

1. **Start with Atomic Components**:
   - Create the smallest, most reusable components first
   - Test each component in isolation before moving to molecular components

2. **Build Molecular Components**:
   - Use the atomic components as building blocks
   - Ensure proper prop passing and event handling

3. **Create Section Components**:
   - Compose using molecular and atomic components
   - Maintain consistent styling and behavior

4. **Refactor index.vue**:
   - Replace original code with new components
   - Ensure all functionality and styling is preserved

## Benefits

1. **Improved Maintainability**: Changes to component styling or behavior can be made in one place
2. **Consistency**: UI elements will maintain consistent styling and behavior throughout the application
3. **Reduced Code Duplication**: Eliminates repeated markup and styling
4. **Better Developer Experience**: Makes the codebase more modular and easier to understand
5. **Easier Testing**: Components can be tested in isolation
6. **Reusability**: Components can be reused across different pages and sections

## Testing Strategy

1. Visual comparison between original and refactored page
2. Responsive testing across different screen sizes
3. Interaction testing for interactive elements
4. Accessibility testing for all components

## Dependencies

- Existing UI components from shadcn-vue
- RDHeadlineGradient component
- Tailwind CSS utilities
