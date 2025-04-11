import type { Meta, StoryObj } from '@storybook/vue3';
import RDHeadlineGradient from './index.vue';

const meta: Meta<typeof RDHeadlineGradient> = {
  title: 'RD/HeadlineGradient',
  component: RDHeadlineGradient,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: '<div class="text-4xl font-bold"><story /></div>',
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof RDHeadlineGradient>;

export const Default: Story = {
  render: () => ({
    components: { RDHeadlineGradient },
    template: '<RDHeadlineGradient>Gradient Headline</RDHeadlineGradient>',
  }),
};

export const LongText: Story = {
  render: () => ({
    components: { RDHeadlineGradient },
    template: '<RDHeadlineGradient>This is a longer headline with gradient styling</RDHeadlineGradient>',
  }),
};

export const WithinHeading: Story = {
  render: () => ({
    components: { RDHeadlineGradient },
    template: `
      <h1 class="text-4xl font-bold">
        Welcome to <RDHeadlineGradient>Rollercoaster.dev</RDHeadlineGradient>
      </h1>
    `,
  }),
};
