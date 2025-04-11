import type { Meta, StoryObj } from '@storybook/vue3';
import { UIButton } from '#components';

const meta: Meta<typeof UIButton> = {
  title: 'UI/Button',
  component: UIButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    as: {
      control: 'text',
      description: 'The element to render the button as',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render the button as a child',
    },
    class: {
      control: 'text',
      description: 'Additional classes to apply to the button',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof UIButton>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Button</UIButton>',
  }),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Delete</UIButton>',
  }),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Outline</UIButton>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Secondary</UIButton>',
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Ghost</UIButton>',
  }),
};

export const Link: Story = {
  args: {
    variant: 'link',
    size: 'default',
  },
  render: (args) => ({
    components: { UIButton },
    setup() {
      return { args };
    },
    template: '<UIButton v-bind="args">Link</UIButton>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { UIButton },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <UIButton size="xs">Extra Small</UIButton>
        <UIButton size="sm">Small</UIButton>
        <UIButton size="default">Default</UIButton>
        <UIButton size="lg">Large</UIButton>
        <UIButton size="icon">
          <span class="text-lg">+</span>
        </UIButton>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  render: () => ({
    components: { UIButton },
    template: `
      <UIButton as="a" href="https://example.com" target="_blank">
        Link Button
      </UIButton>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    components: { UIButton },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <UIButton>
          <span class="text-lg">→</span>
          <span>Continue</span>
        </UIButton>
        <UIButton variant="outline">
          <span>Download</span>
          <span class="text-lg">↓</span>
        </UIButton>
      </div>
    `,
  }),
};
