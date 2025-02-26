import { NuxtConfig } from 'nuxt/schema'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    tailwindcss?: {
      cssPath?: string;
      configPath?: string;
      exposeConfig?: boolean;
      config?: Record<string, any>;
    };
  }
}

export {}; 