import type { Meta, StoryObj } from '@storybook/vue3';
import CreateModal from './index.vue';

const meta = {
  title: 'Badge/CreateModal',
  component: CreateModal,
  tags: ['autodocs'],
  argTypes: {
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
} satisfies Meta<typeof CreateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
}; 