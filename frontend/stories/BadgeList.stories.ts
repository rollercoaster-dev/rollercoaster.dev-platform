import type { Meta, StoryObj } from '@storybook/vue3';
import BadgeList from '../components/Badge/List/index.vue';
import { BadgeStatus } from '../types/badge';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Components/BadgeList',
  component: BadgeList,
  tags: ['autodocs'],
  argTypes: {
    badges: { control: 'object' },
    selectedBadgeId: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    isDarkMode: { control: 'boolean' },
    onSelect: { action: 'select' },
    onCreate: { action: 'create' },
    'onToggle-theme': { action: 'toggle-theme' },
    onRetry: { action: 'retry' }
  },
} satisfies Meta<typeof BadgeList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockBadges = [
  {
    id: '1',
    name: 'First Badge',
    description: 'This is the first badge',
    status: BadgeStatus.NOT_STARTED,
    progress: 0
  },
  {
    id: '2',
    name: 'In Progress Badge',
    description: 'This badge is in progress',
    status: BadgeStatus.IN_PROGRESS,
    progress: 50
  },
  {
    id: '3',
    name: 'Completed Badge',
    description: 'This badge is completed',
    status: BadgeStatus.COMPLETED,
    progress: 100
  }
];

// Base story
export const Default: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: null,
    isLoading: false,
    error: null,
    isDarkMode: true
  }
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
};

// Error state
export const Error: Story = {
  args: {
    ...Default.args,
    error: 'Failed to load badges. Please try again.'
  }
};

// Empty state
export const Empty: Story = {
  args: {
    ...Default.args,
    badges: []
  }
};

// Selected state
export const WithSelection: Story = {
  args: {
    ...Default.args,
    selectedBadgeId: '2'
  }
};

// Light theme
export const LightTheme: Story = {
  args: {
    ...Default.args,
    isDarkMode: false
  }
}; 