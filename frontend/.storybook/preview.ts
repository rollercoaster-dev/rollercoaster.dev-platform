import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import '../assets/css/editor-theme.css'

// Setup any global Vue plugins or components
setup((app) => {
  // Add any global Vue plugins here if needed
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#1e1e1e', // VS Code dark theme background
        },
        {
          name: 'light',
          value: '#f3f3f3', // VS Code light theme background
        },
      ],
    },
    layout: 'fullscreen',
  },
  decorators: [
    (story, context) => ({
      components: { story },
      template: `
        <div :class="['vs-code-theme', { 'dark': isDarkMode }]" style="min-height: 100vh; padding: 1rem;">
          <story />
        </div>
      `,
      setup() {
        return { 
          isDarkMode: context.args.isDarkMode ?? true
        };
      },
    }),
  ],
};

export default preview;