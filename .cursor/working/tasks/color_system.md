# Color System for rollercoaster.dev

## 1. Goal
- **Objective:** Create an energetic, ADHD-friendly color system that reflects the "Rollercoaster of Attention" concept
- **Energy Level Required:** Medium 🔋
- **Current Status:** 🟡 Implementing

## 2. Design Philosophy
Our color system balances engagement with focus, providing both energetic and calming elements through the "Rollercoaster of Attention" concept:
- Energetic elements for engagement (violet, amber accents)
- Calming elements for focus (teal, deep blues)
- Clear cognitive load indicators
- Smooth transitions between states

## 3. Color Palette Structure

### Base Theme
```css
/* Light Mode */
--background: 0 0% 100%
--foreground: 240 10% 3.9%

/* Dark Mode */
--background: 240 10% 3.9%
--foreground: 210 40% 98%
```

### Primary Colors
```css
--primary: 262 83.3% 57.8%    /* Violet - Energetic but calm */
--secondary: 172 66% 50.4%    /* Teal - Refreshing, focused */
--accent: 45 93.4% 47.1%      /* Amber - Warm, engaging */
```

### Focus Modes
```css
/* Light Focus */
--focus: 230 91% 39%         /* Deep blue for concentration */

/* Dark Focus */
--focus: 230 50% 20%         /* Darker variant for night work */
```

### Cognitive Load
```css
--load-low: 151 55% 41.5%    /* Calming green */
--load-medium: 45 93% 47.1%  /* Warm amber */
--load-high: 24 95% 53.1%    /* Energetic orange */
```

## 4. Page-Specific Applications

### Global Elements
#### Header & Navigation
- Clean white/dark background
- Mode toggles with clear states
- Smooth transitions
- High contrast for accessibility

#### Content Areas
- Subtle backgrounds
- Clear text hierarchy
- Consistent spacing
- Focus-friendly contrast

### Home Page
#### Hero Section
- Gradient combining primary colors
- Clear CTA using primary color
- Engaging but not overwhelming
- Smooth transitions on interaction

#### Feature Blocks
- Card-based layout
- Load indicators where relevant
- Hover effects for engagement
- Clear visual hierarchy

### Blog System
#### Index Page
- Card-based post preview
- Clear typography
- Load indicators for post complexity
- Smooth hover transitions

#### Post Page
- High contrast text
- Clear headings hierarchy
- Code block styling
- Focus mode integration

### Contact Form
- Clean input styling
- Clear validation states
- Accessible contrast
- Loading state indicators

## 5. Component Color Applications

### Interactive Elements
```css
/* Buttons */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

/* Cards */
.card-default {
  @apply bg-card text-card-foreground shadow-sm hover:shadow-md transition-all;
}

/* Load Indicators */
.load-indicator {
  @apply text-white font-medium transition-all;
  
  &-low { @apply bg-load-low; }
  &-medium { @apply bg-load-medium; }
  &-high { @apply bg-load-high; }
}
```

### Focus States
```css
/* Focus Mode */
.focus-mode {
  @apply bg-focus text-focus-foreground transition-all duration-500;
}
```

## 6. Implementation Guidelines

### Best Practices
1. Use CSS variables for consistency
2. Implement smooth transitions
3. Maintain accessibility contrast
4. Test in all color modes
5. Consider color blindness

### Color Mode Transitions
- Use `transition-all duration-500`
- Apply to both background and text
- Consider reduced motion preferences
- Maintain readability during transition

## 7. Next Actions
1. Implement global layout colors
2. Create component variants
3. Test accessibility
4. Document usage patterns

## 8. Notes
- Keep transitions smooth but not distracting
- Ensure consistent contrast ratios
- Consider color blindness in all states
- Document color usage patterns 