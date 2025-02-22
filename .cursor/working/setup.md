# Installing Tailwind CSS with Vite

This guide shows how to install and configure the latest version of **Tailwind CSS** with **Vite**.

## 1. Create a Vite Project

If you don't have a Vite project, create one:

```bash
pnpm create vite@latest my-project -- --template vue
cd my-project
```

*(Replace `vue` with your preferred framework if needed.)*

## 2. Install Tailwind CSS

Install Tailwind CSS, PostCSS, and Autoprefixer:

```bash
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates two files:
- `tailwind.config.js`
- `postcss.config.js`

## 3. Configure `tailwind.config.js`

Update the `content` array in `tailwind.config.js`:

```js\ /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 4. Add Tailwind Directives to CSS

In your `src` folder, create or update a `style.css` (or similar) file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import this CSS in `main.ts` or `main.js`:

```ts
import "./style.css";
```

## 5. Run the Development Server

Start the development server:

```bash
pnpm install
pnpm run dev
```

Open the local server URL provided (typically `http://localhost:5173`).

## 6. Verify Tailwind CSS

Test Tailwind by adding a class to `App.vue` (or main component):

```html
<template>
  <div class="text-center text-3xl text-blue-500">
    Hello, Tailwind CSS!
  </div>
</template>
```

If the text appears styled, Tailwind CSS is working correctly.

---

**For advanced configuration**, visit the [official Tailwind CSS documentation](https://tailwindcss.com/docs/installation/using-vite).

