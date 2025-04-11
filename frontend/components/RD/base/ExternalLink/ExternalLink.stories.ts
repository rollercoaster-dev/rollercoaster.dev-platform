import type { Meta, StoryObj } from '@storybook/vue3';
import RDExternalLink from './index.vue';

const meta: Meta<typeof RDExternalLink> = {
  title: 'RD/Base/ExternalLink',
  component: RDExternalLink,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    text: { control: 'text' },
    variant: { 
      control: 'select', 
      options: ['primary', 'secondary', 'outline', 'accent', 'text'] 
    },
    icon: { 
      control: 'select', 
      options: ['arrow-right', 'arrow-up', 'arrow-down', 'none'] 
    },
    target: { control: 'text' },
    rel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RDExternalLink>;

export const Primary: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'primary',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const Secondary: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'secondary',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const Outline: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'outline',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const Accent: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'accent',
    icon: 'arrow-right',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const TextOnly: Story = {
  args: {
    href: 'https://example.com',
    text: 'Example Link',
    variant: 'text',
    icon: 'none',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};
