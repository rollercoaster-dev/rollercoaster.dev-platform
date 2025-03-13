import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
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
    optimizeDeps: {
      exclude: [
        'slugify',
        'is-buffer',
        'debug',
        'flat',
        'node-emoji',
        'extend',
        'hast-util-raw'
      ]
    },
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    }
  }
})