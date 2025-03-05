import type { Meta, StoryObj } from '@storybook/vue3';
import type { Badge, BadgeStatus } from '../../../types/badge';
import EditModal from './index.vue';

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
  title: 'Badge/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  argTypes: {
    badge: {
      control: 'object',
      description: 'Badge data to edit',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is being submitted',
    },
    onClose: { action: 'close' },
    onSubmit: { action: 'submit' },
  },
  decorators: [
    () => ({
      template: '<div style="min-height: 600px; position: relative;"><story/></div>',
    }),
  ],
} satisfies Meta<typeof EditModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: createBadge(),
    isSubmitting: false,
  },
};

export const WithLongContent: Story = {
  args: {
    badge: createBadge({
      name: 'Badge with Very Long Content',
      description: 'This is a very long description that might need special handling in the modal. It contains multiple sentences and might wrap to multiple lines.',
      content: 'This is a very long content section that contains multiple paragraphs.\n\nIt might include formatting, code snippets, or other complex content that needs to be displayed properly in the modal.\n\nWe need to ensure it handles this content well.',
      requirements: Array(5).fill(null).map((_, i) => ({
        id: String(i + 1),
        description: `Requirement ${i + 1} with a longer description that might wrap to multiple lines`,
        completed: i % 2 === 0,
      })),
    }),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    badge: createBadge(),
    isSubmitting: true,
  },
};

export const NoOptionalFields: Story = {
  args: {
    badge: createBadge({
      content: undefined,
      startDate: undefined,
      targetDate: undefined,
      requirements: [],
    }),
    isSubmitting: false,
  },
}; 