import type { Meta, StoryObj } from '@storybook/vue3';
import RequirementsList from './index.vue';

interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
}

const mockRequirements: BadgeRequirement[] = [
  {
    id: '1',
    description: 'Complete the introduction tutorial',
    completed: true,
  },
  {
    id: '2',
    description: 'Submit your first pull request',
    completed: false,
  },
  {
    id: '3',
    description: 'Get your PR reviewed and approved',
    completed: false,
  },
];

const meta = {
  title: 'Badge/RequirementsList',
  component: RequirementsList,
  tags: ['autodocs'],
  argTypes: {
    requirements: {
      control: 'object',
      description: 'Array of requirement objects',
    },
    isEditing: {
      control: 'boolean',
      description: 'Whether the list is in edit mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the requirements are disabled',
    },
    showTitle: {
      control: 'boolean',
      description: 'Whether to show the title',
    },
    title: {
      control: 'text',
      description: 'Title of the requirements list',
    },
    'onUpdate:requirements': { action: 'update:requirements' },
    'onToggle': { action: 'toggle' },
  },
} satisfies Meta<typeof RequirementsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: false,
    disabled: false,
    showTitle: true,
    title: 'Requirements',
  },
};

export const Editing: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: true,
    disabled: false,
    showTitle: true,
    title: 'Requirements',
  },
};

export const Disabled: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: false,
    disabled: true,
    showTitle: true,
    title: 'Requirements',
  },
};

export const NoTitle: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: false,
    disabled: false,
    showTitle: false,
  },
};

export const CustomTitle: Story = {
  args: {
    requirements: mockRequirements,
    isEditing: false,
    disabled: false,
    showTitle: true,
    title: 'Badge Requirements',
  },
};

export const SingleRequirement: Story = {
  args: {
    requirements: [mockRequirements[0]],
    isEditing: false,
    disabled: false,
    showTitle: true,
    title: 'Requirements',
  },
};

export const ManyRequirements: Story = {
  args: {
    requirements: Array(10).fill(null).map((_, i) => ({
      id: String(i + 1),
      description: `Requirement ${i + 1}: Complete this task`,
      completed: i < 5,
    })),
    isEditing: false,
    disabled: false,
    showTitle: true,
    title: 'Requirements',
  },
}; 