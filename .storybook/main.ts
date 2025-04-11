import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  staticDirs: ['../public', '../frontend/public'],
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../frontend/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
  viteFinal: async (config) => {
    // Add PostCSS config
    if (config.css && config.css.postcss) {
      config.css.postcss = {
        plugins: [
          require('tailwindcss')({ config: './.storybook/tailwind.config.js' }),
          require('autoprefixer'),
        ],
      };
    }
    return config;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
