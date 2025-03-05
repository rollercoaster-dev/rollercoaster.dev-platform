import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import BadgeDetails from "../components/Badge/Details/index.vue";
import type { Badge } from '../types/badge';
import { BadgeStatus } from '../types/badge';

const mockBadge: Badge = {
  id: '1',
  name: 'Test Badge',
  description: 'A test badge for Storybook',
  content: 'Additional content for the badge',
  progress: 60,
  status: BadgeStatus.IN_PROGRESS,
  requirements: [
    {
      id: '1',
      description: 'First requirement',
      completed: true
    },
    {
      id: '2',
      description: 'Second requirement',
      completed: false
    }
  ],
  createdAt: '2024-03-05T12:00:00Z',
  updatedAt: '2024-03-05T12:00:00Z',
  startDate: '2024-03-01T00:00:00Z',
  targetDate: '2024-03-31T00:00:00Z'
};

const meta = {
  title: 'Components/BadgeDetails',
  component: BadgeDetails,
  tags: ['autodocs'],
  argTypes: {
    badge: { control: 'object' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' }
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="p-4 h-[600px]"><story /></div>'
    })
  ]
} satisfies Meta<typeof BadgeDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty state
export const EmptySelection: Story = {
  args: {
    badge: null,
    isLoading: false,
    error: null
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check empty state message
    const message = canvas.getByText('Select a badge to view details');
    await expect(message).toBeInTheDocument();
    
    // Test create button
    const createButton = canvas.getByText('Create New Badge');
    await expect(createButton).toBeInTheDocument();
    await userEvent.click(createButton);
  }
};

// Loading state
export const Loading: Story = {
  args: {
    badge: null,
    isLoading: true,
    error: null
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check loading message
    const message = canvas.getByText('Loading badge details...');
    await expect(message).toBeInTheDocument();
    
    // Check loading icon
    const loadingIcon = canvas.getByText('Loading badge details...').previousSibling;
    await expect(loadingIcon).toHaveClass('loading-icon', 'spin');
  }
};

// Error state
export const Error: Story = {
  args: {
    badge: null,
    isLoading: false,
    error: 'Failed to load badge details'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check error message
    const message = canvas.getByText('Failed to load badge details');
    await expect(message).toBeInTheDocument();
    
    // Test retry button
    const retryButton = canvas.getByText('Retry');
    await expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
  }
};

// Badge details
export const WithBadge: Story = {
  args: {
    badge: mockBadge,
    isLoading: false,
    error: null
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check badge info is displayed
    const title = canvas.getByText(mockBadge.name);
    await expect(title).toBeInTheDocument();
    
    const description = canvas.getByText(mockBadge.description);
    await expect(description).toBeInTheDocument();
    
    // Check dates
    const startDate = canvas.getByText(/Started:/);
    await expect(startDate).toBeInTheDocument();
    
    const targetDate = canvas.getByText(/Target:/);
    await expect(targetDate).toBeInTheDocument();
    
    // Check requirements
    for (const req of mockBadge.requirements) {
      const reqText = canvas.getByText(req.description);
      await expect(reqText).toBeInTheDocument();
      
      const checkbox = canvas.getByRole('checkbox', { name: req.description });
      await expect(checkbox).toHaveProperty('checked', req.completed);
      
      // Test requirement toggle
      await userEvent.click(checkbox);
    }
    
    // Test edit and delete buttons
    const editButton = canvas.getByRole('button', { name: /edit badge/i });
    await userEvent.click(editButton);
    
    const deleteButton = canvas.getByRole('button', { name: /delete badge/i });
    await userEvent.click(deleteButton);
  }
};

// Badge with additional content
export const WithContent: Story = {
  args: {
    badge: {
      ...mockBadge,
      content: 'This is some additional content for the badge that provides more context and information.'
    },
    isLoading: false,
    error: null
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check content section exists
    const contentTitle = canvas.getByText('Additional Content');
    await expect(contentTitle).toBeInTheDocument();
    
    const content = canvas.getByText(mockBadge.content as string);
    await expect(content).toBeInTheDocument();
  }
}; 