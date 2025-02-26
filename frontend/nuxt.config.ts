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
    ['@nuxt/content', {
      documentDriven: true,
      highlight: {
        theme: 'github-dark'
      }
    }],
    ['@nuxtjs/color-mode', {
      classSuffix: '',
      fallback: 'light',
      preference: 'system'
    }]
  ],
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
  }
})