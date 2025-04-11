import type { Preview } from "@storybook/vue3";
import '../frontend/assets/css/tailwind.css';

// Add global CSS variables for themes
const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      // Apply the selected theme
      const theme = context.globals.theme;
      const bodyClasses = ['font-primary'];

      if (theme === 'dark') {
        bodyClasses.push('dark');
      }

      return {
        template: `
          <div class="${bodyClasses.join(' ')}">
            <story />
          </div>
        `,
        setup() {
          return { theme };
        },
      };
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
