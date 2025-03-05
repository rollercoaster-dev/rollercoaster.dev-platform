import type { Meta, StoryObj } from '@storybook/vue3';
import DeleteModal from './index.vue';

const meta = {
  title: 'Badge/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {
    badgeName: {
      control: 'text',
      description: 'Name of the badge to be deleted',
    },
    isDeleting: {
      control: 'boolean',
      description: 'Whether the delete operation is in progress',
    },
    onClose: { action: 'close' },
    onConfirm: { action: 'confirm' },
  },
  decorators: [
    () => ({
      template: '<div style="min-height: 400px; position: relative;"><story/></div>',
    }),
  ],
} satisfies Meta<typeof DeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badgeName: 'Test Badge',
    isDeleting: false,
  },
};

export const LongBadgeName: Story = {
  args: {
    badgeName: 'A Very Long Badge Name That Might Need Special Handling in the Modal',
    isDeleting: false,
  },
};

export const Deleting: Story = {
  args: {
    badgeName: 'Test Badge',
    isDeleting: true,
  },
}; 