# Task: Refactor frontend/pages/index.vue into Reusable Components

**Objective:** Improve code organization and reusability by extracting logical sections from `frontend/pages/index.vue` into dedicated Vue components, leveraging shadcn-vue components where applicable and following project standards.

**Estimated Time:** 60-90 minutes (broken down below)

**Relevant Rules:**
*   `components_development_rule.mdc` (Structure, Naming, Props, Auto-imports, shadcn Integration)
*   `color_and_accessibility_rule.mdc` (Color Tokens, Accessibility)
*   `commenting_standards_rule.mdc` (Clarity, No JSDoc)
*   `task_management_rule.mdc` (Breakdown, Time Estimates)

**Shadcn Component Usage:**
*   **`ui/Card`:** Will be used as the base for `ContentSectionCard` and for the individual cards within the `CallToActionSection`. This includes `ui/CardHeader`, `ui/CardTitle`, `ui/CardContent` as needed.
*   **`ui/Button`:** Will replace the custom-styled link buttons in the `CallToActionSection`.

**Proposed Components & Plan:**

1.  **`PageHeadline` Component (10-15 mins)**
    *   **Source:** Lines 20-26 (`<section class="text-center space-y-4">...`)
    *   **Location:** `components/page/index/PageHeadline.vue`
    *   **Props:**
        *   `mainText`: String
        *   `gradientText`: String
    *   **Action:** Create component, move template, define props. Ensure `<RDHeadlineGradient>` usage is correct (likely via slot or prop). Use standard Tailwind/theme typography classes.

2.  **`ContentSectionCard` Component (15-20 mins)**
    *   **Source:** Used for "What We're Building" (Lines 29-56) and "Rough Roadmap" (Lines 91-124).
    *   **Location:** `components/content/ContentSectionCard.vue`
    *   **Implementation:** This component will wrap the `ui/Card` component.
    *   **Props:**
        *   `title`: String
        *   `titleClass`: String (Optional, e.g., 'text-primary', passed to `UiCardTitle` or header)
        *   `id`: String (Optional)
    *   **Slots:**
        *   `default`: For the main content placed inside `UiCardContent`.
    *   **Action:** Create the wrapper component using `<UiCard>`, `<UiCardHeader>`, `<UiCardTitle>`, and `<UiCardContent>`. Pass the `title` prop to `UiCardTitle`. Use the default slot for content within `UiCardContent`. Refactor the "What We're Building" and "Rough Roadmap" sections in `index.vue` to use `<ContentSectionCard>`, passing titles and content.

3.  **`VisionSection` Component (10-15 mins)**
    *   **Source:** Lines 59-88 ("Our Vision & Goals")
    *   **Location:** `components/page/index/VisionSection.vue`
    *   **Props:** None initially.
    *   **Action:** Create component, move template section, replace in `index.vue`. Ensure standard Tailwind/theme typography classes are used.

4.  **`CallToActionSection` Component (15-20 mins)**
    *   **Source:** Lines 127-168 ("Get Involved / Stay Updated")
    *   **Location:** `components/page/index/CallToActionSection.vue`
    *   **Implementation:** This component will contain the main heading and the grid. The inner cards will directly use `ui/Card`, and buttons will use `ui/Button`.
    *   **Action:** Create the component. Move the H2 heading and the grid structure. Inside the grid, replace the `div` elements acting as cards with `<UiCard>`, `<UiCardHeader>`, `<UiCardTitle>`, `<UiCardContent>`. Replace the `<a>` tags styled as buttons with `<UiButton as="a" href="...">...</UiButton>`, ensuring correct variants (`variant="default"` for accent, `variant="outline"` for primary outline, etc.) and classes are applied according to the original design and theme. Replace the original section in `index.vue` with `<CallToActionSection>`.

5.  **Final Review & Cleanup (10 mins)**
    *   **Action:** Review `index.vue`. Verify correct usage of `ui/Card` and `ui/Button` in the new components. Check props, slots, accessibility, and color rules. Ensure auto-imports are working correctly.

**Next Steps:**

*   Confirm this updated plan.
*   Proceed with creating the task file `.cursor/working/tasks/refactor-index-page-components.md`.
*   Begin implementing the component extraction step-by-step. 