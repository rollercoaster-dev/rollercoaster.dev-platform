import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-26',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content'
  ],
  app: {
    baseURL: '/'
  },
  // Server configuration
  devServer: {
    port: 3001
  },
  // Runtime config and environment variables
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:7777'
    }
  },
  // Optional: Add proxy to handle CORS in development
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:7777',
        changeOrigin: true,
        prependPath: true
      }
    }
  },
  content: {
    experimental: {
      clientDB: false
    },
    storage: {
      fs: true,
      db: false
    },
    documentDriven: true,
    markdown: {
      anchorLinks: false
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true,
    config: {
      darkMode: 'class',
      plugins: [require('tailwindcss/nesting')]
    }
  },
  colorMode: {
    classSuffix: ''
  },
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