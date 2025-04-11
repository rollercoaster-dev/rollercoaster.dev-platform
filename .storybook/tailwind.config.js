/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../frontend/tailwind.config.js')],
  content: [
    '../frontend/components/**/*.{js,vue,ts}',
    '../frontend/layouts/**/*.vue',
    '../frontend/pages/**/*.vue',
    '../frontend/plugins/**/*.{js,ts}',
    '../frontend/app.vue',
    '../frontend/error.{js,ts,vue}',
    '../frontend/content/**/*.md',
    '../stories/**/*.{js,ts,vue,mdx}',
    './.storybook/**/*.{js,ts,vue,mdx}',
  ],
};
