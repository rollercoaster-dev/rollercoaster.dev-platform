import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// ES module replacement for __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "storybook-dark-mode"
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Use the same tailwind configuration as the main app
      css: {
        postcss: {
          plugins: [
            // Use imported packages directly
            tailwindcss(path.resolve(projectRoot, 'tailwind.config.js')),
            autoprefixer,
          ],
        },
      },
      resolve: {
        alias: {
          // Add aliases if needed
          '~': projectRoot,
          '@': projectRoot,
        },
      },
    });
  }
};

export default config;