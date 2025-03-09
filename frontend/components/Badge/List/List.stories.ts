import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import List from '../List.vue';
import { BadgeStatus } from '../../../types/badge';
import { withTheme } from '../../../.storybook/preview';

// Generate mock data for badges
const mockBadges = [
  {
    id: 'badge1',
    name: 'Learn Vue.js',
    description: 'Master the fundamentals of Vue.js framework',
    content: 'This badge covers Vue 3 composition API and Nuxt basics.',
    progress: 75,
    status: BadgeStatus.IN_PROGRESS,
    requirements: [
      { id: 'req1', description: 'Complete Vue.js documentation', completed: true },
      { id: 'req2', description: 'Build a small Vue application', completed: true },
      { id: 'req3', description: 'Learn about Vuex state management', completed: true },
      { id: 'req4', description: 'Understand Vue Router', completed: false }
    ],
    createdAt: '2023-05-15T10:00:00.000Z',
    updatedAt: '2023-05-20T14:30:00.000Z',
    startDate: '2023-05-15',
    targetDate: '2023-06-15'
  },
  {
    id: 'badge2',
    name: 'TypeScript Fundamentals',
    description: 'Learn TypeScript and type safety',
    content: 'Covers TypeScript basics, interfaces, and advanced types.',
    progress: 40,
    status: BadgeStatus.IN_PROGRESS,
    requirements: [
      { id: 'req1', description: 'Learn basic TypeScript syntax', completed: true },
      { id: 'req2', description: 'Understand interfaces', completed: true },
      { id: 'req3', description: 'Master generics', completed: false },
      { id: 'req4', description: 'Work with advanced types', completed: false },
      { id: 'req5', description: 'Integrate with JavaScript projects', completed: false }
    ],
    createdAt: '2023-06-01T09:00:00.000Z',
    updatedAt: '2023-06-05T11:45:00.000Z',
    startDate: '2023-06-01',
    targetDate: '2023-07-15'
  },
  {
    id: 'badge3',
    name: 'CSS Grid & Flexbox',
    description: 'Master modern CSS layout techniques',
    content: 'Comprehensive guide to CSS Grid and Flexbox layouts.',
    progress: 100,
    status: BadgeStatus.COMPLETED,
    requirements: [
      { id: 'req1', description: 'Learn Flexbox basics', completed: true },
      { id: 'req2', description: 'Create complex Flexbox layouts', completed: true },
      { id: 'req3', description: 'Learn CSS Grid fundamentals', completed: true },
      { id: 'req4', description: 'Build responsive layouts with Grid', completed: true }
    ],
    createdAt: '2023-04-10T08:30:00.000Z',
    updatedAt: '2023-05-01T16:20:00.000Z',
    startDate: '2023-04-10',
    targetDate: '2023-05-01'
  },
  {
    id: 'badge4',
    name: 'Backend with Node.js',
    description: 'Build REST APIs with Node.js and Express',
    content: 'Learn how to create robust backend services with Node.js.',
    progress: 0,
    status: BadgeStatus.NOT_STARTED,
    requirements: [
      { id: 'req1', description: 'Setup Node.js environment', completed: false },
      { id: 'req2', description: 'Create Express server', completed: false },
      { id: 'req3', description: 'Implement RESTful routes', completed: false },
      { id: 'req4', description: 'Connect to database', completed: false },
      { id: 'req5', description: 'Add authentication', completed: false }
    ],
    createdAt: '2023-06-20T13:15:00.000Z',
    updatedAt: '2023-06-20T13:15:00.000Z',
    startDate: '',
    targetDate: '2023-08-01'
  }
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof List> = {
  title: 'Badge/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    onView: { action: 'view' },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onCreateNew: { action: 'createNew' },
    onRetry: { action: 'retry' }
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badges: mockBadges,
    isLoading: false,
    error: null,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify badges are displayed correctly
    expect(canvas.getByText('Learn Vue.js')).toBeTruthy();
    expect(canvas.getByText('TypeScript Fundamentals')).toBeTruthy();
    expect(canvas.getByText('CSS Grid & Flexbox')).toBeTruthy();
    expect(canvas.getByText('Backend with Node.js')).toBeTruthy();
    
    // Click on a badge to view it
    await userEvent.click(canvas.getByText('TypeScript Fundamentals'));
    
    // Verify the view event was called with the correct badge ID
    await expect(args.onView).toHaveBeenCalledWith('badge2');
    
    // Click the Create New Badge button
    await userEvent.click(canvas.getByText('Create New Badge'));
    
    // Verify the createNew event was called
    await expect(args.onCreateNew).toHaveBeenCalled();
  }
};

export const BadgeActions: Story = {
  args: {
    badges: mockBadges,
    isLoading: false,
    error: null,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find edit and delete buttons for the first badge
    const editButtons = canvas.getAllByLabelText('Edit badge');
    const deleteButtons = canvas.getAllByLabelText('Delete badge');
    
    // Click edit button for the first badge
    await userEvent.click(editButtons[0]);
    
    // Verify the edit event was called with the correct badge ID
    await expect(args.onEdit).toHaveBeenCalledWith('badge1');
    
    // Click delete button for the second badge
    await userEvent.click(deleteButtons[1]);
    
    // Verify the delete event was called with the correct badge ID
    await expect(args.onDelete).toHaveBeenCalledWith('badge2');
  }
};

export const Loading: Story = {
  args: {
    badges: [],
    isLoading: true,
    error: null,
  }
};

export const Error: Story = {
  args: {
    badges: [],
    isLoading: false,
    error: 'Failed to load badges. Please try again.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify error message is displayed
    expect(canvas.getByText('Failed to load badges. Please try again.')).toBeTruthy();
    
    // Click the Try Again button
    await userEvent.click(canvas.getByText('Try Again'));
    
    // Verify the retry event was called
    await expect(args.onRetry).toHaveBeenCalled();
  }
};

export const Empty: Story = {
  args: {
    badges: [],
    isLoading: false,
    error: null,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify empty state message is displayed
    expect(canvas.getByText('No badges found.')).toBeTruthy();
    
    // Click the Create Your First Badge button
    await userEvent.click(canvas.getByText('Create Your First Badge'));
    
    // Verify the createNew event was called
    await expect(args.onCreateNew).toHaveBeenCalled();
  }
};

export const Compact: Story = {
  args: {
    badges: mockBadges,
    isLoading: false,
    error: null,
    compact: true,
  }
};

// Theme-specific stories
export const ThemedBadgeList: Story = {
  args: {
    badges: mockBadges,
    isLoading: false,
    error: null,
  },
  decorators: [withTheme],
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the badge list with the current theme from the dark mode toggle. Try switching between light and dark mode using the toggle in the Storybook toolbar.',
      },
    },
  },
};