import type { Meta, StoryObj } from '@storybook/vue3';
import Header from './Header.vue';
import { ref } from 'vue';

// Mock the useColorMode composable
const mockUseColorMode = () => {
  const value = ref('light');
  const preference = ref('light');
  
  return {
    value,
    preference,
  };
};

// Mock the ClientOnly component
const mockClientOnly = {
  name: 'ClientOnly',
  setup(_, { slots }) {
    return () => slots.default ? slots.default() : null;
  }
};

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      components: { story, ClientOnly: mockClientOnly },
      setup() {
        // Mock the useColorMode composable
        window.useColorMode = mockUseColorMode;
        return {};
      },
      template: '<story />',
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LightMode: Story = {
  decorators: [
    (story) => ({
      components: { story, ClientOnly: mockClientOnly },
      setup() {
        // Mock the useColorMode composable for light mode
        window.useColorMode = () => {
          const value = ref('light');
          const preference = ref('light');
          return { value, preference };
        };
        return {};
      },
      template: '<story />',
    }),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (story) => ({
      components: { story, ClientOnly: mockClientOnly },
      setup() {
        // Mock the useColorMode composable for dark mode
        window.useColorMode = () => {
          const value = ref('dark');
          const preference = ref('dark');
          return { value, preference };
        };
        return {};
      },
      template: '<div class="dark"><story /></div>',
    }),
  ],
};
