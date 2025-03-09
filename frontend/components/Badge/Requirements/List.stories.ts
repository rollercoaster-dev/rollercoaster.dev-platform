import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import RequirementsList from '../RequirementsList.vue';

const mockRequirements = [
  { id: 'req1', description: 'Learn Vue.js fundamentals', completed: true },
  { id: 'req2', description: 'Understand component composition', completed: true },
  { id: 'req3', description: 'Master reactive state management', completed: false },
  { id: 'req4', description: 'Create a small project with Vue 3', completed: false },
  { id: 'req5', description: 'Learn about the Composition API', completed: false }
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof RequirementsList> = {
  title: 'Badge/RequirementsList',
  component: RequirementsList,
  tags: ['autodocs'],
  argTypes: {
    onToggle: { action: 'toggle' },
    onAdd: { action: 'add' },
    onRemove: { action: 'remove' },
    onUpdate: { action: 'update' }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    requirements: mockRequirements,
    editable: false,
    isLoading: false,
  },
};

export const Editable: Story = {
  args: {
    requirements: [...mockRequirements],
    editable: true,
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Toggle a requirement from incomplete to complete
    const checkbox = canvas.getByLabelText('Master reactive state management');
    await userEvent.click(checkbox);
    
    // Verify the toggle event was called
    await expect(args.onToggle).toHaveBeenCalledWith({
      id: 'req3',
      completed: true
    });
    
    // Add a new requirement
    await userEvent.type(canvas.getByPlaceholderText(/Add a new requirement/i), 'Learn Pinia state management');
    await userEvent.click(canvas.getByRole('button', { name: /Add/i }));
    
    // Verify the add event was called
    await expect(args.onAdd).toHaveBeenCalledWith({
      description: 'Learn Pinia state management'
    });
  },
};

export const EditRequirement: Story = {
  args: {
    requirements: [...mockRequirements],
    editable: true,
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find the edit button for a specific requirement
    const editButtons = canvas.getAllByLabelText('Edit requirement');
    await userEvent.click(editButtons[2]); // Edit the third requirement
    
    // Update the text in the edit input
    const editInput = canvas.getByRole('textbox');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'UPDATED: Master advanced reactive state management');
    
    // Save the changes
    const saveButton = canvas.getByLabelText('Save changes');
    await userEvent.click(saveButton);
    
    // Verify the update event was called
    await expect(args.onUpdate).toHaveBeenCalled();
  },
};

export const DeleteRequirement: Story = {
  args: {
    requirements: [...mockRequirements],
    editable: true,
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find the delete button for a specific requirement
    const deleteButtons = canvas.getAllByLabelText('Delete requirement');
    await userEvent.click(deleteButtons[1]); // Delete the second requirement
    
    // Verify the remove event was called
    await expect(args.onRemove).toHaveBeenCalledWith('req2');
  },
};

export const Empty: Story = {
  args: {
    requirements: [],
    editable: false,
    isLoading: false,
  },
};

export const EmptyEditable: Story = {
  args: {
    requirements: [],
    editable: true,
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Add requirements to the empty list
    await userEvent.type(canvas.getByPlaceholderText(/Add a new requirement/i), 'First requirement');
    await userEvent.click(canvas.getByRole('button', { name: /Add/i }));
    
    // Add another requirement
    await userEvent.type(canvas.getByPlaceholderText(/Add a new requirement/i), 'Second requirement');
    await userEvent.click(canvas.getByRole('button', { name: /Add/i }));
    
    // Verify the add event was called twice
    await expect(args.onAdd).toHaveBeenCalledTimes(2);
  },
};

export const Loading: Story = {
  args: {
    requirements: mockRequirements,
    editable: true,
    isLoading: true,
  },
};