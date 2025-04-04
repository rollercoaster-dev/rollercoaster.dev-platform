# Typography System

This document outlines the typography guidelines for the Rollercoaster.dev platform, focusing on accessibility, readability, and consistency, especially for neurodivergent users.

## 1. Primary Font

- **Font:** Atkinson Hyperlegible
- **Source:** Locally hosted (`frontend/assets/fonts/atkinson-hyperlegible/`)
- **Weights/Styles:** Regular (400), Bold (700), Italic (400), Bold Italic (700)
- **Reasoning:** Chosen for its excellent character differentiation and legibility, designed by the Braille Institute to improve reading comfort and speed, particularly beneficial for users with low vision and dyslexia.

## 2. Base Settings (CSS Variables)

These core settings are defined in `frontend/assets/css/tailwind.css` and applied globally via the `body` tag:

- `--font-primary: 'Atkinson Hyperlegible', sans-serif;`
  - Sets the default font family.
- `--line-height-normal: 1.6;`
  - Provides comfortable spacing between lines of text.
- `--letter-spacing-normal: 0.01em;`
  - Adds slight spacing between characters to aid readability.

## 3. Usage Guidelines & Hierarchy

Use standard Tailwind utility classes for font sizing and styling to maintain consistency.

### Font Sizes

Use Tailwind's semantic text size utilities. Establish a clear hierarchy:

- `text-xs`, `text-sm`: For captions, labels, less important metadata.
- `text-base`: **Default body text size.** Use for paragraphs, lists, standard content.
- `text-lg`, `text-xl`: For subheadings or important callouts.
- `text-2xl`, `text-3xl`, `text-4xl`, ... : For main page titles and section headings.

**Example:**

```html
<h1 class="text-4xl font-bold mb-4">Page Title</h1>
<h2 class="text-2xl font-bold mt-8 mb-3">Section Heading</h2>
<p class="text-base mb-4">
  This is a standard paragraph using the base text size and default line
  height/letter spacing.
</p>
<span class="text-sm text-muted-foreground">A small note or caption.</span>
```

### Weight & Style

Use standard Tailwind utilities:

- `font-normal`: Default weight (400).
- `font-bold`: Bold weight (700).
- `italic`: Italic style.

**Example:**

```html
<p>
  This is normal text. <strong>This text is bold using `font-bold`.</strong>
  <em>This text is italic using `italic`.</em>
</p>
```

## 4. Accessibility Notes

- **Contrast:** Always ensure sufficient color contrast between text and its background, adhering to WCAG AA guidelines (4.5:1 for normal text, 3:1 for large text). Use tools to check contrast ratios.
- **Line Length:** Aim for comfortable line lengths (typically 45-75 characters) to avoid reading fatigue. Use `max-w-*` utilities on text containers.
- **Avoid:** Justifying text, as it can create uneven spacing ("rivers of white") that hinders readability for some users. Left-align text for optimal reading flow.

## 5. Future Considerations

- **Font Options:** Consider adding user preference controls (Task 5) to allow selection between Atkinson Hyperlegible and potentially other accessible fonts like Lexend.
- **Variable Fonts:** Explore using variable font versions if finer control over weight/style is needed in the future.

---

_This document should be updated as the design system evolves._
