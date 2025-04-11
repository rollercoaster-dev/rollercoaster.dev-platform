# Task: Add Storybook to Nuxt Project

## Overview
This task involves adding Storybook to our Nuxt project to develop, test, and document UI components in isolation. Storybook will help us build and showcase the components identified in our component extraction task.

## Estimated Time
- Total: 2-3 hours
- Installation and configuration: 1 hour
- Initial story creation: 1-2 hours

## Steps

### 1. Install Storybook

The recommended way to add Storybook to a Nuxt project is using the official Nuxt module:

```bash
# Add the Storybook module to the project
pnpm dlx nuxi@latest module add storybook

# Alternatively, install it manually
# pnpm add -D @nuxtjs/storybook
```

### 2. Configure Nuxt for Storybook

Update the `nuxt.config.ts` file to include the Storybook module:

```typescript
export default defineNuxtConfig({
  modules: [
    // ... other modules
    '@nuxtjs/storybook'
  ],
  storybook: {
    // Storybook options
    url: 'http://localhost:6006',
    port: 6006
  }
})
```

### 3. Create Storybook Configuration Files

Create the necessary Storybook configuration files:

```bash
# Initialize Storybook configuration
npx storybook-nuxt init
```

This will create:
- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Preview configuration
- Initial story examples

### 4. Customize Storybook Configuration

Update `.storybook/main.ts` to include our component directories:

```typescript
import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook-vue/nuxt",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
```

### 5. Configure Tailwind CSS for Storybook

Create `.storybook/preview.ts` to include Tailwind CSS:

```typescript
import type { Preview } from "@storybook/vue3";
import '../assets/css/tailwind.css'; // Adjust path if needed

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

### 6. Create Stories for Components

Create a story for one of our components as an example:

```typescript
// components/rd/base/ExternalLink/ExternalLink.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import RDExternalLink from './index.vue';

const meta: Meta<typeof RDExternalLink> = {
  title: 'RD/Base/ExternalLink',
  component: RDExternalLink,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    text: { control: 'text' },
    variant: { 
      control: 'select', 
      options: ['primary', 'secondary', 'outline', 'accent', 'text'] 
    },
    icon: { 
      control: 'select', 
      options: ['arrow-right', 'arrow-up', 'arrow-down', 'none'] 
    },
    target: { control: 'text' },
    rel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RDExternalLink>;

export const Primary: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'primary',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const Secondary: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'secondary',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const TextOnly: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'text',
    icon: 'none',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};
```

### 7. Run Storybook

Start Storybook to view and interact with your components:

```bash
# Run Storybook
pnpm storybook

# Or if you want to run both Nuxt and Storybook
pnpm dev
```

### 8. Create a Storybook Script

Add a script to package.json for running Storybook:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## Best Practices for Stories

1. **Component Organization**:
   - Create stories alongside components or in a dedicated stories directory
   - Follow the same directory structure as your components

2. **Story Structure**:
   - Use the Component Story Format (CSF)
   - Include multiple variants of each component
   - Document props and usage

3. **Documentation**:
   - Use JSDoc comments to document props
   - Include usage examples
   - Document any special considerations

4. **Testing**:
   - Use Storybook for visual testing
   - Consider adding interaction tests

## Troubleshooting

If you encounter issues:

1. **Module Resolution Issues**:
   - Make sure Nuxt and Storybook versions are compatible
   - Check for path aliases in your Nuxt config

2. **Styling Issues**:
   - Ensure Tailwind CSS is properly imported in preview.ts
   - Check for global styles that might be missing

3. **Component Rendering Issues**:
   - Make sure components don't rely on Nuxt-specific features in Storybook
   - Use mocks for any server-side or API dependencies

## Resources

- [Official Nuxt Storybook Module](https://storybook.nuxtjs.org/)
- [Storybook Documentation](https://storybook.js.org/docs/vue/get-started/introduction)
- [Component Story Format](https://storybook.js.org/docs/vue/api/csf)
