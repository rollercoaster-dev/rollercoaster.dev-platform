# Vue 3 SSR App with pnpm, Unplugin Auto Imports, Unplugin Components, Unplugin Router, Tailwind, and shadcn

Below is a concise guide for setting up a Vue 3 SSR project using pnpm, with these requirements:

- **Vue 3** SSR
- **pnpm** package manager
- **unplugin-auto-import** (for composables)
- **unplugin-vue-components** (for auto-importing components)
- **unplugin-vue-router** (to auto-generate routes)
- **Tailwind CSS** latest
- **shadcn** style components (currently limited for Vue—see notes)

> **Note:** While **shadcn** is mostly React-oriented, there's some community work on `shadcn-nuxt` for Nuxt SSR. For pure Vue SSR, you may have to adapt the shadcn component patterns manually or look for a community port (`shadcn-vue`).

---

## 1. Create the Base Project

```bash
pnpm create vite my-ssr-app --template vue
cd my-ssr-app
```

**Optional**: If you prefer to start from scratch:
```bash
mkdir my-ssr-app && cd my-ssr-app
pnpm init
```

---

## 2. Install Dependencies

Install SSR tools, Vue libraries, tailwind, and unplugin:

```bash
pnpm add vue@latest vue-router@latest
pnpm add -D vite@latest vite-plugin-ssr \
  unplugin-auto-import unplugin-vue-components unplugin-vue-router \
  tailwindcss postcss autoprefixer
```

- **vite-plugin-ssr** provides SSR capabilities.
- **unplugin-auto-import** automatically imports Vue Composition API functions.
- **unplugin-vue-components** auto-registers components.
- **unplugin-vue-router** automatically generates the router config from your file structure.
- **tailwindcss, postcss, autoprefixer** for styling.

---

## 3. Configure SSR

Create (or update) a `vite.config.ts` with SSR support and unplugin config:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ssr from 'vite-plugin-ssr/plugin';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';

export default defineConfig({
  plugins: [
    VueRouter({ /* optional config */ }),
    vue(),
    ssr(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
    }),
  ],
});
```

- **VueRouter** from `unplugin-vue-router` scans `src/pages` (by default) to auto-generate routes.
- **AutoImport** & **Components** for auto imports.
- **ssr()** from `vite-plugin-ssr` handles SSR entry points.

> **For advanced SSR** (server entry, client entry, pages) see [vite-plugin-ssr docs](https://vite-plugin-ssr.com/) and [unplugin-vue-router docs](https://github.com/posva/unplugin-vue-router).

---

## 4. Add Tailwind

Initialize Tailwind:

```bash
pnpx tailwindcss init -p
```

*(If that command fails, run `./node_modules/.bin/tailwindcss init -p`.)*

Update **`tailwind.config.js`**:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

In your main CSS file (e.g., `src/style.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import it in `main.ts` or wherever your root entry is:

```ts
import './style.css';
```

---

## 5. (Optional) Using "shadcn" for Vue

`shadcn/ui` is originally for React. For Nuxt SSR, there’s [`shadcn-nuxt`](https://www.npmjs.com/package/shadcn-nuxt). For a non-Nuxt Vue SSR, you have these options:

1. **Manual port** of Shadcn’s Tailwind + Radix styling.
2. **Check for Community Repos** like `shadcn-vue` or others that replicate the design system.

If you find a Vue package, install and follow its docs for usage.

---

## 6. Run and Test

To develop:

```bash
pnpm install
pnpm run dev
```

Check logs to confirm SSR is running. Typically you’ll see a local URL (e.g., <http://localhost:5173>).

---

## 7. Build and Serve

```bash
pnpm run build
pnpm run serve
```

Your SSR app is now running with:
- **Vite** + **vite-plugin-ssr** for SSR
- **unplugin-auto-import**, **unplugin-vue-components**, **unplugin-vue-router**
- **Tailwind CSS** for styling
- (Optionally) Shadcn-inspired components for Vue.

That’s it! You now have a Vue SSR app with auto-imports, auto-generated routes, and Tailwind.

