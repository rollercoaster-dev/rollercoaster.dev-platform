import { defineNuxtConfig } from 'nuxt/config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-26',
  devtools: { enabled: true },
  modules: [
    ['@nuxtjs/tailwindcss', {
      cssPath: '~/assets/css/tailwind.css',
      configPath: 'tailwind.config.js',
      exposeConfig: true,
      config: {}
    }],
    ['@nuxtjs/color-mode', {
      classSuffix: '',
      fallback: 'light',
      preference: 'system'
    }]
    // Storybook module removed for testing
  ],
  imports: {
    dirs: [
      'composables',
      'utils',
      'stores'
    ],
    presets: [
      { 
        from: 'vue', 
        imports: [
          'ref', 
          'computed', 
          'reactive', 
          'onMounted',
          'defineComponent',
          'defineProps',
          'defineEmits',
          'watch',
          'watchEffect'
        ] 
      }
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
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        allowJs: true,
        types: ["vue"]
      }
    }
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('lucide-')
        }
      }
    }
  }
})