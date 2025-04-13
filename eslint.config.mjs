import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

// Load parsers and plugins using require
const vueParser = require('vue-eslint-parser');
const vuePlugin = require('eslint-plugin-vue');

import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  // Add Vue-specific configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // Vue recommended rules
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      // These Vue formatting rules will be turned OFF by eslint-config-prettier
      // 'vue/html-closing-bracket-newline': ['error', {
      //   'singleline': 'never',
      //   'multiline': 'always'
      // }],
      // 'vue/html-closing-bracket-spacing': 'error',
      // 'vue/max-attributes-per-line': ['error', {
      //   'singleline': 3,
      //   'multiline': 1
      // }],
      // 'vue/first-attribute-linebreak': ['error', {
      //   'singleline': 'ignore',
      //   'multiline': 'below'
      // }],
    },
  },
  // Add eslint-config-prettier as the LAST configuration
  eslintConfigPrettier,
];
