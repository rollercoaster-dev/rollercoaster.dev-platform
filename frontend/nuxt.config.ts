import { defineNuxtConfig } from 'nuxt/config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-26',
  devtools: { enabled: true },
  modules: [['@nuxtjs/tailwindcss', {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: true,
    config: {}
  }], ['@nuxt/content', {
    documentDriven: true,
    highlight: {
      theme: 'github-dark'
    }
  }], ['@nuxtjs/color-mode', {
    classSuffix: '',
    fallback: 'light',
    preference: 'system'
  }], ['@nuxtjs/storybook', {
    port: 6006,
    stories: [
      '../components/**/*.stories.@(js|jsx|ts|tsx)',
      '../stories/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    version: 8,
    addons: [
      '@storybook/addon-links',
      '@storybook/addon-essentials',
      '@storybook/addon-interactions'
    ],
    framework: {
      name: '@storybook/vue3-vite',
      options: {}
    },
    builder: {
      name: '@storybook/builder-vite',
      options: {}
    }
  }]],
  imports: {
    dirs: [
      'composables',
      'utils',
      'stores'
    ],
    presets: [
      { from: 'vue', imports: ['ref', 'computed', 'reactive', 'onMounted'] }
    ]
  },
  components: {
    dirs: [
      {
        path: '~/components/ui',
        extensions: ['.vue'],
        prefix: ''
      },
      '~/components'
    ]
  },
  typescript: {
    strict: true,
    includeWorkspace: true,
    shim: false,
    tsConfig: {
      compilerOptions: {
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        allowJs: true
      }
    }
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  }
})