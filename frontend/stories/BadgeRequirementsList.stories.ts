import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import BadgeRequirementsList from '../components/Badge/RequirementsList/index.vue';
import type { BadgeRequirement } from '../types/badge';

const mockRequirements: BadgeRequirement[] = [
  {
    id: '1',
    description: 'Complete the tutorial',
    completed: false
  },
  {
    id: '2',
    description: 'Create your first component',
    completed: true
  },
  {
    id: '3',
    description: 'Write component tests',
    completed: false
  }
];

const meta = {
  title: 'Components/BadgeRequirementsList',
  component: BadgeRequirementsList,
  tags: ['autodocs'],
  argTypes: {
    requirements: { control: 'object' },
    isEditing: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showTitle: { control: 'boolean' },
    title: { control: 'text' }
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="p-4 max-w-md"><story /></div>'
    })
  ]
} satisfies Meta<typeof BadgeRequirementsList>;

export default meta;
type Story = StoryObj<typeof meta>;

// View mode story
export const ViewMode: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: false,
    disabled: false,
    showTitle: true,
    title: 'Requirements'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Check title
    const title = canvas.getByText('Requirements');
    await expect(title).toBeInTheDocument();
    
    // Check requirements are displayed
    for (const req of mockRequirements) {
      const reqText = canvas.getByText(req.description);
      await expect(reqText).toBeInTheDocument();
      
      const checkbox = canvas.getByRole('checkbox', { name: req.description });
      await expect(checkbox).toHaveProperty('checked', req.completed);
      
      // Test checkbox interaction
      await userEvent.click(checkbox);
      await expect(checkbox).toHaveProperty('checked', !req.completed);
    }
  }
};

// Disabled view mode
export const DisabledView: Story = {
  args: {
    ...ViewMode.args,
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check all checkboxes are disabled
    const checkboxes = canvas.getAllByRole('checkbox');
    for (const checkbox of checkboxes) {
      await expect(checkbox).toBeDisabled();
    }
  }
};

// Edit mode story
export const EditMode: Story = {
  args: {
    requirements: [...mockRequirements],
    isEditing: true
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Check input fields exist
    const inputs = canvas.getAllByRole('textbox');
    await expect(inputs).toHaveLength(mockRequirements.length);
    
    // Test adding a requirement
    const addButton = canvas.getByRole('button', { name: /add requirement/i });
    await userEvent.click(addButton);
    const newInputs = canvas.getAllByRole('textbox');
    await expect(newInputs).toHaveLength(mockRequirements.length + 1);
    
    // Test removing a requirement
    const removeButtons = canvas.getAllByRole('button', { name: /remove requirement/i });
    await userEvent.click(removeButtons[removeButtons.length - 1]);
    const remainingInputs = canvas.getAllByRole('textbox');
    await expect(remainingInputs).toHaveLength(mockRequirements.length);
    
    // Test editing a requirement
    const firstInput = canvas.getAllByRole('textbox')[0];
    await userEvent.clear(firstInput);
    await userEvent.type(firstInput, 'Updated requirement');
    await expect(firstInput).toHaveValue('Updated requirement');
  }
};

// Empty state
export const Empty: Story = {
  args: {
    requirements: [{
      id: '1',
      description: '',
      completed: false
    }],
    isEditing: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check empty input exists
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveValue('');
    
    // Remove button should be disabled for single requirement
    const removeButton = canvas.getByRole('button', { name: /remove requirement/i });
    await expect(removeButton).toBeDisabled();
  }
}; 