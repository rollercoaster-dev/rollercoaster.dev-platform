import type { Meta, StoryObj } from '@storybook/vue3';
import Progress from './index.vue';

const meta = {
  title: 'Badge/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    progress: 0,
  },
};

export const Started: Story = {
  args: {
    progress: 25,
  },
};

export const Halfway: Story = {
  args: {
    progress: 50,
  },
};

export const AlmostComplete: Story = {
  args: {
    progress: 75,
  },
};

export const Complete: Story = {
  args: {
    progress: 100,
  },
}; 