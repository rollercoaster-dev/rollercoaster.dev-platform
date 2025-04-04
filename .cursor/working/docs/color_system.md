# Color System for rollercoaster.dev

## 1. Goal
- **Objective:** Create a high-contrast, engaging, ADHD-friendly color system reflecting a "Cyberpunk Rollercoaster Park" theme.
- **Energy Level Required:** Medium 🔋
- **Current Status:** 🟡 Implementing Simplified Theme

## 2. Design Philosophy
Our color system embraces a dark, high-contrast aesthetic inspired by cyberpunk visuals and neon lights. It prioritizes clarity and focus while providing vibrant accents for interaction and engagement.
- **Dark Foundation:** A deep, dark background provides a canvas for neon highlights.
- **Neon Accents:** Vibrant Magenta and Electric Cyan provide primary and secondary interaction cues.
- **High Contrast:** Ensuring excellent readability and accessibility is paramount.
- **Simplicity:** A reduced palette minimizes visual noise and cognitive load.

## 3. Color Palette Structure

### Base Theme (Dark Mode Default)
```css
:root {
  /* Base */
  --background: 240 10% 10%; /* Very Dark Cool Grey/Blue */
  --foreground: 210 20% 95%; /* Very Light Grey (Near White) */

  /* Cards / Elevated Surfaces (Optional - can be same as background or slightly lighter) */
  --card: 240 10% 12%;       /* Slightly lighter than background */
  --card-foreground: var(--foreground);

  /* Primary Neon Interaction */
  --primary: 315 90% 60%;     /* Vibrant Magenta/Pink */
  --primary-foreground: 240 10% 5%; /* Dark color for text *on* primary bg (if needed) */

  /* Accent Neon Interaction */
  --accent: 190 95% 55%;      /* Electric Cyan/Blue */
  --accent-foreground: 240 10% 5%; /* Dark color for text *on* accent bg (if needed) */

  /* Input Fields */
  --input: 240 10% 15%;       /* Darker input background */
  --input-border: 240 10% 25%; /* Subtle border for inputs */

  /* Borders / Dividers */
  --border: 240 10% 20%;      /* Subtle borders */

  /* Focus Rings (Often uses accent or primary) */
  --ring: var(--accent);
}

/* Note: Light mode can be added later if necessary, but focus is dark-first */
```

### Removed Colors (Previously Defined)
- `--secondary` (Old Teal)
- `--focus` (Old Deep Blue)
- `--load-low` (Green)
- `--load-medium` (Amber)
- `--load-high` (Orange)

## 4. Page-Specific Applications (Simplified Examples)

### Global Elements
- **Header/Navigation:** Dark background (`--background` or `--card`), high-contrast text (`--foreground`), potentially using `--primary` or `--accent` for active links or highlights.
- **Content Areas:** Primarily `--background` with `--foreground` text. Headings might use `--primary` or `--accent` sparingly for emphasis.

### Home Page
- **Hero Section:** Could use subtle gradients incorporating `--background` and darker shades, with `--primary` for the main CTA button.
- **Feature Blocks:** Use `--card` background (if different from main `--background`) with clear headings. Interactive elements use `--primary` or `--accent`.

## 5. Component Color Applications (Simplified Examples)

### Interactive Elements
```css
/* Primary Button */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring; /* Ensure text contrast on button */
}

/* Accent Button/Link */
.btn-accent, .link-accent {
  @apply text-accent hover:brightness-110 focus-visible:ring-ring;
}

/* Cards */
.card-default {
  @apply bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-all; /* Add subtle border */
}

/* Input Fields */
.input-field {
  @apply bg-input border border-input-border text-foreground focus-visible:ring-ring;
}
```
### Removed Examples
- `.load-indicator` styles
- `.focus-mode` class (Focus states handled by standard `:focus` / `:focus-visible` and `--ring`)

## 6. Implementation Guidelines

### Best Practices
1.  **Prioritize Dark Mode:** Design and test primarily for the dark theme.
2.  **Use CSS Variables:** Ensure consistency and easier theme management.
3.  **Maximize Contrast:** Rigorously test text (`--foreground`, `--primary-foreground`, etc.) against backgrounds (`--background`, `--card`, `--primary`, `--accent`) using contrast checkers (aim for AA minimum, AAA where possible).
4.  **Subtle Transitions:** Use transitions for hover/focus states, but keep them quick and non-distracting.
5.  **Focus States:** Ensure clear focus indicators (`--ring`) on all interactive elements.
6.  **Limit Neon Use:** Use `--primary` and `--accent` purposefully for interaction and key highlights, not excessively, to maintain their impact.

## 7. Next Actions
1.  Implement these base CSS variables in the global stylesheet.
2.  Apply colors to core components (buttons, inputs, cards).
3.  Perform accessibility contrast checks on key element combinations.
4.  Refine hover/focus states using brightness adjustments or subtle glows (box-shadow).
5.  Gather visual feedback on the feel of the new theme.

## 8. Notes
- This simplified palette focuses on achieving the core "Cyberpunk Rollercoaster Park" feel.
- Advanced features like granular cognitive load indicators or distinct focus modes are parked for now.
- Accessibility is key – double-check all color combinations. 