import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  staticDirs: ['../frontend/public'],
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
    // We'll use the Vite config directly
    return config;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
