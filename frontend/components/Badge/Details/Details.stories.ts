import type { Meta, StoryObj } from '@storybook/vue3';
import type { Badge, BadgeStatus } from '../../../types/badge';
import Details from './index.vue';

const createBadge = (overrides?: Partial<Badge>): Badge => ({
  id: '1',
  name: 'Test Badge',
  description: 'A test badge description',
  content: 'Additional content for the badge',
  progress: 50,
  status: 'IN_PROGRESS' as BadgeStatus,
  requirements: [
    { id: '1', description: 'First requirement', completed: true },
    { id: '2', description: 'Second requirement', completed: false },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  startDate: '2024-03-01',
  targetDate: '2024-04-01',
  ...overrides,
});

const meta = {
  title: 'Badge/Details',
  component: Details,
  tags: ['autodocs'],
  argTypes: {
    badge: {
      control: 'object',
      description: 'Badge data to display',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the badge details are loading',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    onCreate: { action: 'create' },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onRetry: { action: 'retry' },
    onToggleRequirement: { action: 'toggleRequirement' },
  },
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: createBadge(),
    isLoading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    badge: null,
    isLoading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    badge: null,
    isLoading: false,
    error: 'Failed to load badge details. Please try again.',
  },
};

export const Empty: Story = {
  args: {
    badge: null,
    isLoading: false,
    error: null,
  },
};

export const WithLongContent: Story = {
  args: {
    badge: createBadge({
      name: 'Badge with Long Content',
      description: 'This is a very long description that might need special handling in the display. It contains multiple sentences and might wrap to multiple lines.',
      content: 'This is a very long content section that contains multiple paragraphs.\n\nIt might include formatting, code snippets, or other complex content that needs to be displayed properly.\n\nWe need to ensure it handles this content well.',
      requirements: Array(5).fill(null).map((_, i) => ({
        id: String(i + 1),
        description: `Requirement ${i + 1} with a longer description that might wrap to multiple lines`,
        completed: i % 2 === 0,
      })),
    }),
    isLoading: false,
    error: null,
  },
};

export const Complete: Story = {
  args: {
    badge: createBadge({
      progress: 100,
      status: 'COMPLETED' as BadgeStatus,
      requirements: [
        { id: '1', description: 'First requirement', completed: true },
        { id: '2', description: 'Second requirement', completed: true },
      ],
    }),
    isLoading: false,
    error: null,
  },
}; 