import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import CreateModal from '../CreateModal.vue';
import { BadgeStatus } from '../../../types/badge';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof CreateModal> = {
  title: 'Badge/CreateModal',
  component: CreateModal,
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submit' },
    onCancel: { action: 'cancel' },
    'onUpdate:isOpen': { action: 'update:isOpen' }
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    isOpen: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Fill out the form
    await userEvent.type(canvas.getByLabelText(/Name/i), 'New Test Badge');
    await userEvent.type(canvas.getByLabelText(/Description/i), 'This is a test badge created with Storybook play function');
    
    // Add a requirement
    await userEvent.type(canvas.getByPlaceholderText(/Add a new requirement/i), 'Complete Storybook testing');
    await userEvent.click(canvas.getByRole('button', { name: /Add/i }));
    
    // Submit the form
    await userEvent.click(canvas.getByRole('button', { name: /Create Badge/i }));
    
    // Verify the submit event was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    isOpen: true,
  },
};

export const WithPrefilledData: Story = {
  args: {
    isLoading: false,
    isOpen: true,
    badge: {
      id: '1',
      name: 'Learn Vue.js',
      description: 'Master the fundamentals of Vue.js framework',
      content: 'This badge covers Vue 3 composition API and Nuxt basics.',
      progress: 25,
      status: BadgeStatus.IN_PROGRESS,
      requirements: [
        { id: 'req1', description: 'Complete Vue.js documentation', completed: true },
        { id: 'req2', description: 'Build a small Vue application', completed: false },
        { id: 'req3', description: 'Learn about Vuex state management', completed: false },
        { id: 'req4', description: 'Understand Vue Router', completed: false }
      ],
      createdAt: '2023-05-15T10:00:00.000Z',
      updatedAt: '2023-05-20T14:30:00.000Z',
      startDate: '2023-05-15',
      targetDate: '2023-06-15'
    }
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Update the description
    const descriptionField = canvas.getByLabelText(/Description/i);
    await userEvent.clear(descriptionField);
    await userEvent.type(descriptionField, 'Updated description for Vue.js badge');
    
    // Add a new requirement
    await userEvent.type(canvas.getByPlaceholderText(/Add a new requirement/i), 'Deploy to production');
    await userEvent.click(canvas.getByRole('button', { name: /Add/i }));
    
    // Update the form
    await userEvent.click(canvas.getByRole('button', { name: /Update Badge/i }));
    
    // Verify the submit event was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const CancelButton: Story = {
  args: {
    isLoading: false,
    isOpen: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Fill out part of the form
    await userEvent.type(canvas.getByLabelText(/Name/i), 'Discarded Badge');
    
    // Click the cancel button
    await userEvent.click(canvas.getByRole('button', { name: /Cancel/i }));
    
    // Verify the cancel event was called
    await expect(args.onCancel).toHaveBeenCalled();
    await expect(args['onUpdate:isOpen']).toHaveBeenCalledWith(false);
  },
};