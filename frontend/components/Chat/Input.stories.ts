import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import Input from './Input.vue';

const meta: Meta<typeof Input> = {
  title: 'Chat/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    onSend: { action: 'send' },
    onClear: { action: 'clear' }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type a message...',
    disabled: false,
    maxRows: 5
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Get the textarea element
    const textarea = canvas.getByRole('textbox');
    
    // Type a message
    await userEvent.type(textarea, 'Hello, how can you help me with my badges?');
    
    // Click the send button
    const sendButton = canvas.getByLabelText('Send message');
    await userEvent.click(sendButton);
    
    // Verify the send event was called with the typed message
    await expect(args.onSend).toHaveBeenCalledWith('Hello, how can you help me with my badges?');
  },
};

export const WithMultiLineMessage: Story = {
  args: {
    placeholder: 'Type a message...',
    disabled: false,
    maxRows: 5
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Get the textarea element
    const textarea = canvas.getByRole('textbox');
    
    // Type a multi-line message
    await userEvent.type(textarea, 'This is line 1.\nThis is line 2.\nThis is line 3.');
    
    // Textarea should have expanded
    // (Note: We can't easily assert the height change in this test environment)
  },
};

export const WithClear: Story = {
  args: {
    placeholder: 'Type a message...',
    disabled: false,
    maxRows: 5
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Get the textarea element
    const textarea = canvas.getByRole('textbox');
    
    // Type a message
    await userEvent.type(textarea, 'A message to be cleared');
    
    // The clear button should appear
    const clearButton = canvas.getByLabelText('Clear message');
    
    // Click the clear button
    await userEvent.click(clearButton);
    
    // Verify the clear event was called
    await expect(args.onClear).toHaveBeenCalled();
    
    // Textarea should be empty
    expect(textarea).toHaveValue('');
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Processing...',
    disabled: true,
    maxRows: 5
  },
};