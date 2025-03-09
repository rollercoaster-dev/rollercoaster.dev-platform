import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import type { Message } from '../../types/badge';
import History from './History.vue';

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    content: 'How do I complete the Vue.js badge?',
    timestamp: new Date('2023-09-15T14:35:00'),
  },
  {
    id: '2',
    sender: 'ai',
    content: 'To complete the Vue.js badge, you need to finish all requirements listed. I see you have 3 out of 4 requirements completed. The remaining task is to "Understand Vue Router". Would you like me to provide resources for learning Vue Router?',
    timestamp: new Date('2023-09-15T14:36:00'),
  },
  {
    id: '3',
    sender: 'user',
    content: 'Yes, please!',
    timestamp: new Date('2023-09-15T14:37:00'),
  },
  {
    id: '4',
    sender: 'ai',
    content: 'Here are some resources for learning Vue Router:\n\n1. Official Vue Router Documentation\n2. Vue Mastery Courses\n3. Vue School tutorials\n\nWould you like me to explain any particular concept in more detail?',
    timestamp: new Date('2023-09-15T14:38:00'),
  }
];

const meta: Meta<typeof History> = {
  title: 'Chat/History',
  component: History,
  tags: ['autodocs'],
  argTypes: {
    onSend: { action: 'send' },
    onClear: { action: 'clear' }
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    messages: [],
    isLoading: false,
    selectedBadgeId: null
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify welcome message is displayed
    expect(canvas.getByText('How can I help you with your badges today?')).toBeTruthy();
    
    // Click on a suggestion
    const suggestion = canvas.getByText('What should I learn next?');
    await userEvent.click(suggestion);
    
    // Verify the send event was called with the suggestion text
    await expect(args.onSend).toHaveBeenCalledWith('What should I learn next?', undefined);
  },
};

export const WithMessages: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    selectedBadgeId: 'badge1'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Type a message in the input
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'Tell me more about Vue Router navigation guards');
    
    // Click the send button
    const sendButton = canvas.getByLabelText('Send message');
    await userEvent.click(sendButton);
    
    // Verify the send event was called with the message and badge ID
    await expect(args.onSend).toHaveBeenCalledWith(
      'Tell me more about Vue Router navigation guards', 
      'badge1'
    );
  },
};

export const Loading: Story = {
  args: {
    messages: mockMessages,
    isLoading: true,
    selectedBadgeId: 'badge1'
  },
};