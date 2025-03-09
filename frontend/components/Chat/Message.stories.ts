import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import Message from './Message.vue';

const meta: Meta<typeof Message> = {
  title: 'Chat/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    message: {
      id: '1',
      sender: 'user',
      content: 'How do I complete the Vue.js badge?',
      timestamp: new Date('2023-09-15T14:35:00'),
    },
    isLastMessage: false,
  },
};

export const AIMessage: Story = {
  args: {
    message: {
      id: '2',
      sender: 'ai',
      content: 'To complete the Vue.js badge, you need to finish all requirements listed. I see you have 3 out of 4 requirements completed. The remaining task is to "Understand Vue Router". Would you like me to provide resources for learning Vue Router?',
      timestamp: new Date('2023-09-15T14:36:00'),
    },
    isLastMessage: false,
  },
};

export const ShortMessage: Story = {
  args: {
    message: {
      id: '3',
      sender: 'user',
      content: 'Yes, please!',
      timestamp: new Date('2023-09-15T14:37:00'),
    },
    isLastMessage: false,
  },
};

export const LastMessage: Story = {
  args: {
    message: {
      id: '4',
      sender: 'ai',
      content: 'Here are some resources for learning Vue Router:\n\n1. Official Vue Router Documentation\n2. Vue Mastery Courses\n3. Vue School tutorials\n\nWould you like me to explain any particular concept in more detail?',
      timestamp: new Date('2023-09-15T14:38:00'),
    },
    isLastMessage: true,
  },
};