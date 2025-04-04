import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-26',
  devtools: { enabled: true },
  modules: [
    [
      '@nuxtjs/tailwindcss',
      {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.js',
        exposeConfig: true,
        config: {},
      },
    ],
    [
      '@nuxtjs/color-mode',
      {
        classSuffix: '',
        fallback: 'light',
        preference: 'system',
      },
    ],
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    // Storybook module removed for testing
  ],
  // Generate a static site
  nitro: {
    preset: 'static',
    // Optimize the static generation
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  app: {
    head: {
      title: 'Rollercoaster.dev',
      meta: [
        {
          name: 'description',
          content: 'Tools for Neurodivergent Minds, Built with Open Badges',
        },
      ],
      link: [
        // Favicon files from favicon.io
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Rollercoaster.dev',
      siteDescription: 'Tools for Neurodivergent Minds, Built with Open Badges',
      language: 'en',
    },
  },
  imports: {
    dirs: ['composables', 'utils', 'stores'],
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
          'watchEffect',
        ],
      },
    ],
  },
  components: {
    dirs: [
      {
        path: '~/components/rd',
        prefix: 'RD',
      },
      {
        path: '~/components/ui',
        prefix: 'UI',
        extensions: ['.vue'],
        pattern: ['**/[A-Z]*.vue', '!**/*.stories.vue', '!**/*.test.vue'],
      },
      '~/components',
    ],
  },
  typescript: {
    strict: true,
    includeWorkspace: true,
    shim: false,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        allowJs: true,
        types: ['vue'],
      },
    },
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('lucide-'),
        },
      },
    },
  },
  // SEO configuration
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://rollercoaster.dev',
    name: 'Rollercoaster.dev',
    description: 'Tools for Neurodivergent Minds, Built with Open Badges',
    defaultLocale: 'en',
  },
  // Robots.txt configuration
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Sitemap configuration
  sitemap: {
    autoLastmod: true,
  },
});
