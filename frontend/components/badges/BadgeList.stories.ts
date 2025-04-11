import type { Meta, StoryObj } from '@storybook/vue3';
import BadgeList from './BadgeList.vue';

// Mock data for the badges
const mockBadges = [
  {
    id: '1',
    name: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming',
    progress: 75,
    criteria: 'Complete all JavaScript exercises',
    image: 'https://example.com/js-badge.png',
    issuer: {
      name: 'Coding Academy',
      url: 'https://example.com',
      email: 'contact@example.com'
    },
    recipient: {
      identity: 'user@example.com',
      type: 'email',
      hashed: false
    },
    issuedOn: '2023-01-15',
    expires: '2025-01-15',
    tags: ['javascript', 'programming', 'web development']
  },
  {
    id: '2',
    name: 'CSS Master',
    description: 'Advanced CSS and layout techniques',
    progress: 30,
    criteria: 'Build 5 responsive layouts',
    image: 'https://example.com/css-badge.png',
    issuer: {
      name: 'Coding Academy',
      url: 'https://example.com',
      email: 'contact@example.com'
    },
    recipient: {
      identity: 'user@example.com',
      type: 'email',
      hashed: false
    },
    issuedOn: '2023-02-20',
    expires: '2025-02-20',
    tags: ['css', 'design', 'web development']
  },
  {
    id: '3',
    name: 'Vue.js Developer',
    description: 'Building applications with Vue.js',
    progress: 10,
    criteria: 'Create a Vue.js application with state management',
    image: 'https://example.com/vue-badge.png',
    issuer: {
      name: 'Coding Academy',
      url: 'https://example.com',
      email: 'contact@example.com'
    },
    recipient: {
      identity: 'user@example.com',
      type: 'email',
      hashed: false
    },
    issuedOn: '2023-03-10',
    expires: '2025-03-10',
    tags: ['vue', 'javascript', 'framework', 'web development']
  }
];

// Add CSS variables for the component to work properly
const cssVariables = {
  '--vscode-bg-light': '#f5f5f5',
  '--vscode-border': '#e0e0e0',
  '--vscode-bg-lighter': '#ffffff',
  '--vscode-hover': '#f0f0f0',
  '--vscode-selection': '#e6f7ff',
  '--vscode-bg-lightest': '#f9f9f9',
  '--vscode-progress-blue': '#0078d4',
  '--vscode-fg-subtle': '#666666',
  '--vscode-focus': '#0078d4',
};

const meta: Meta<typeof BadgeList> = {
  title: 'Badges/BadgeList',
  component: BadgeList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    () => ({
      template: `
        <div style="height: 500px; ${Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join(' ')}">
          <story />
        </div>
      `,
    }),
  ],
  argTypes: {
    badges: { control: 'object' },
    selectedBadgeId: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    isDarkMode: { control: 'boolean' },
    'onSelect': { action: 'select' },
    'onCreate': { action: 'create' },
    'onToggle-theme': { action: 'toggle-theme' },
    'onRetry': { action: 'retry' },
  },
};

export default meta;
type Story = StoryObj<typeof BadgeList>;

export const Default: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: null,
    isLoading: false,
    error: null,
    isDarkMode: false,
  },
};

export const WithSelectedBadge: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: '2',
    isLoading: false,
    error: null,
    isDarkMode: false,
  },
};

export const Loading: Story = {
  args: {
    badges: [],
    selectedBadgeId: null,
    isLoading: true,
    error: null,
    isDarkMode: false,
  },
};

export const Error: Story = {
  args: {
    badges: [],
    selectedBadgeId: null,
    isLoading: false,
    error: 'Failed to load badges. Please try again.',
    isDarkMode: false,
  },
};

export const DarkMode: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: null,
    isLoading: false,
    error: null,
    isDarkMode: true,
  },
  decorators: [
    () => ({
      template: `
        <div style="height: 500px; background-color: #1e1e1e; color: #ffffff;
          --vscode-bg-light: #252526;
          --vscode-border: #3c3c3c;
          --vscode-bg-lighter: #2d2d2d;
          --vscode-hover: #3c3c3c;
          --vscode-selection: #264f78;
          --vscode-bg-lightest: #333333;
          --vscode-progress-blue: #0e70c0;
          --vscode-fg-subtle: #cccccc;
          --vscode-focus: #0e70c0;">
          <story />
        </div>
      `,
    }),
  ],
};
