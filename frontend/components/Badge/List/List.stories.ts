import type { Meta, StoryObj } from '@storybook/vue3';
import List from './index.vue';

enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

interface Badge {
  id: string;
  name: string;
  description: string;
  status: BadgeStatus;
  progress: number;
}

// Mock badge data
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Badge',
    description: 'Description for first badge',
    status: BadgeStatus.NOT_STARTED,
    progress: 0,
  },
  {
    id: '2',
    name: 'In Progress Badge',
    description: 'This badge is being worked on',
    status: BadgeStatus.IN_PROGRESS,
    progress: 45,
  },
  {
    id: '3',
    name: 'Completed Badge',
    description: 'This badge is complete',
    status: BadgeStatus.COMPLETED,
    progress: 100,
  },
];

const meta = {
  title: 'Badge/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    badges: {
      control: 'object',
      description: 'Array of badge objects to display',
    },
    selectedBadgeId: {
      control: 'text',
      description: 'ID of the currently selected badge',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the badge list is loading',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether dark mode is enabled',
    },
    'onSelect': { action: 'select' },
    'onCreate': { action: 'create' },
    'onToggle-theme': { action: 'toggle-theme' },
    'onRetry': { action: 'retry' },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: null,
    isDarkMode: true,
  },
};

export const WithSelection: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: '2',
    isDarkMode: true,
  },
};

export const Loading: Story = {
  args: {
    badges: [],
    selectedBadgeId: null,
    isLoading: true,
    isDarkMode: true,
  },
};

export const Error: Story = {
  args: {
    badges: [],
    selectedBadgeId: null,
    error: 'Failed to load badges. Please try again.',
    isDarkMode: true,
  },
};

export const Empty: Story = {
  args: {
    badges: [],
    selectedBadgeId: null,
    isDarkMode: true,
  },
};

export const LightMode: Story = {
  args: {
    badges: mockBadges,
    selectedBadgeId: null,
    isDarkMode: false,
  },
};

export const WithManyBadges: Story = {
  args: {
    badges: Array(20).fill(null).map((_, i) => ({
      id: String(i + 1),
      name: `Badge ${i + 1}`,
      description: `Description for badge ${i + 1}`,
      status: [BadgeStatus.NOT_STARTED, BadgeStatus.IN_PROGRESS, BadgeStatus.COMPLETED][i % 3],
      progress: Math.min(100, Math.round(i * 5.5)),
    })),
    selectedBadgeId: null,
    isDarkMode: true,
  },
}; 