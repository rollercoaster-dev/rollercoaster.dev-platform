# Color System for rollercoaster.dev

## 1. Goal
- **Objective:** Create an energetic, ADHD-friendly color system that reflects the "rollercoaster" theme while maintaining accessibility
- **Energy Level Required:** Medium 🔋
- **Current Status:** 🟡 Planning

## 2. Color Palette Structure

### Base Colors
#### Light Mode
- **Background:**
  - Primary: `bg-white`
  - Secondary: `bg-gray-50`
  - Tertiary: `bg-gray-100`

- **Text:**
  - Primary: `text-gray-900`
  - Secondary: `text-gray-700`
  - Muted: `text-gray-500`

#### Dark Mode
- **Background:**
  - Primary: `bg-gray-950`
  - Secondary: `bg-gray-900`
  - Tertiary: `bg-gray-800`

- **Text:**
  - Primary: `text-gray-50`
  - Secondary: `text-gray-200`
  - Muted: `text-gray-400`

### Accent Colors (Rollercoaster Theme)
- **Primary Action:**
  - Default: `violet-600` (Energetic but calm)
  - Hover: `violet-700`
  - Active: `violet-800`

- **Secondary Action:**
  - Default: `teal-500` (Refreshing, focused)
  - Hover: `teal-600`
  - Active: `teal-700`

- **Attention:**
  - Focus: `amber-400` (Warm, engaging)
  - Success: `emerald-500` (Achievement)
  - Warning: `orange-500` (Gentle alert)
  - Error: `rose-500` (Clear but not harsh)

### State Colors
#### Focus Mode
- **Active:** `indigo-600` (Deep concentration)
- **Background:** `gray-950` (Minimal distraction)
- **Text:** `gray-50` (High contrast)

#### Cognitive Load Indicators
- **Low:** `emerald-400` (Calm, approachable)
- **Medium:** `amber-400` (Moderate engagement)
- **High:** `orange-400` (Increased intensity)

## 3. Implementation Plan

### 1. Base Configuration
```typescript
// tailwind.config.js
{
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        }
      }
    }
  }
}
```

### 2. CSS Variables
```css
/* assets/css/tailwind.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 262 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 172 66% 50.4%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 45 93.4% 47.1%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 262 83.3% 57.8%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 210 40% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 210 40% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 262 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 172 66% 50.4%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 45 93.4% 47.1%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 262 83.3% 57.8%;
  }
}
```

## 4. Usage Guidelines

### Text Hierarchy
- **Headers:** Primary text color
- **Body:** Secondary text color
- **Supporting Text:** Muted text color
- **Links:** Primary action color
- **Emphasis:** Secondary action color

### Interactive Elements
- **Buttons:** Primary/Secondary action colors
- **Hover States:** Darker variants (+100)
- **Focus Rings:** Primary action color
- **Selection:** Accent color with 40% opacity

### Status Indicators
- **Progress:** Primary action color
- **Success:** Success color
- **Warnings:** Warning color
- **Errors:** Error color
- **Information:** Secondary action color

### Accessibility Considerations
- Maintain WCAG 2.1 AA contrast ratios
- Provide high contrast mode option
- Ensure color is not the only indicator
- Test with color blindness simulators
- Support dark mode preferences

## 5. Next Actions
1. Implement base color configuration
2. Set up CSS variables
3. Create color mode toggle
4. Test with accessibility tools
5. Create component-specific color variants 