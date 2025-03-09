import type { Preview } from '@storybook/vue3'
import { computed } from 'vue';
// Import the same CSS files that the app uses
import '../assets/css/tailwind.css';
import '../assets/css/editor-theme.css';
import { useDarkMode } from 'storybook-dark-mode';

// Create a custom theme decorator for reuse
export const withTheme = (storyFn: any) => {
  return {
    template: `
      <div :class="[isDark ? 'dark' : '']" style="padding: 1rem;">
        <story />
      </div>
    `,
    components: { story: storyFn },
    setup() {
      const isDark = useDarkMode();
      return { isDark };
    }
  };
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true, // Disable backgrounds addon as we'll use dark mode addon instead
    },
    darkMode: {
      // Dark mode addon options
      dark: {
        appBg: '#1e1e1e',
        appContentBg: '#1e1e1e',
        barBg: '#1a1a1a',
        barTextColor: '#d4d4d4',
        textColor: '#d4d4d4',
        inputBg: '#2c2c2c',
        inputBorder: '#3c3c3c',
        brandTitle: 'atBadges (Dark)',
        brandUrl: './',
      },
      light: {
        appBg: '#f5f5f5',
        appContentBg: '#f5f5f5',
        barBg: '#ffffff',
        barTextColor: '#333333',
        textColor: '#333333',
        inputBg: '#ffffff',
        inputBorder: '#d8d8d8',
        brandTitle: 'atBadges (Light)',
        brandUrl: './',
      },
      current: 'dark', // Default to dark theme
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (storyFn) => {
      return {
        template: `<div :class="[isDark ? 'dark' : '', 'storybook-wrapper']" style="padding: 1rem; min-height: 100vh;" :style="bgStyle">
          <story />
        </div>`,
        components: { story: storyFn },
        setup() {
          const isDark = useDarkMode();
          
          const bgStyle = computed(() => ({
            backgroundColor: isDark.value ? '#1e1e1e' : '#f5f5f5',
            color: isDark.value ? '#d4d4d4' : '#333333'
          }));
          
          return { 
            isDark,
            bgStyle
          };
        }
      };
    },
  ],
};

export default preview;