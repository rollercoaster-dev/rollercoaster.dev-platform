import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import BadgeCard from '../Card.vue';
import { BadgeStatus } from '../../../types/badge';

const mockBadge = {
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
};

const completedBadge = {
  ...mockBadge,
  id: 'badge2',
  name: 'CSS Grid & Flexbox',
  description: 'Master modern CSS layout techniques',
  progress: 100,
  status: BadgeStatus.COMPLETED,
  requirements: [
    { id: 'req1', description: 'Learn Flexbox basics', completed: true },
    { id: 'req2', description: 'Create complex Flexbox layouts', completed: true },
    { id: 'req3', description: 'Learn CSS Grid fundamentals', completed: true },
    { id: 'req4', description: 'Build responsive layouts with Grid', completed: true }
  ]
};

const notStartedBadge = {
  ...mockBadge,
  id: 'badge3',
  name: 'Backend with Node.js',
  description: 'Build REST APIs with Node.js and Express',
  progress: 0,
  status: BadgeStatus.NOT_STARTED,
  requirements: [
    { id: 'req1', description: 'Setup Node.js environment', completed: false },
    { id: 'req2', description: 'Create Express server', completed: false },
    { id: 'req3', description: 'Implement RESTful routes', completed: false },
    { id: 'req4', description: 'Connect to database', completed: false }
  ],
  startDate: undefined,
  targetDate: '2023-08-15'
};

const meta: Meta<typeof BadgeCard> = {
  title: 'Badge/Card',
  component: BadgeCard,
  tags: ['autodocs'],
  argTypes: {
    onView: { action: 'view' },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    badge: mockBadge,
    compact: false
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify badge content is displayed correctly
    expect(canvas.getByText('Learn Vue.js')).toBeTruthy();
    expect(canvas.getByText('Master the fundamentals of Vue.js framework')).toBeTruthy();
    expect(canvas.getByText('75%')).toBeTruthy();
    expect(canvas.getByText('In Progress')).toBeTruthy();
    
    // Click the badge to view details
    await userEvent.click(canvas.getByText('Learn Vue.js'));
    
    // Verify the view event was called with the correct badge ID
    await expect(args.onView).toHaveBeenCalledWith('badge1');
  }
};

export const Completed: Story = {
  args: {
    badge: completedBadge,
    compact: false
  }
};

export const NotStarted: Story = {
  args: {
    badge: notStartedBadge,
    compact: false
  }
};

export const CompactMode: Story = {
  args: {
    badge: mockBadge,
    compact: true
  }
};

export const WithActions: Story = {
  args: {
    badge: mockBadge,
    compact: false
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Click the edit button
    const editButton = canvas.getByLabelText('Edit badge');
    await userEvent.click(editButton);
    
    // Verify the edit event was called with the correct badge ID
    await expect(args.onEdit).toHaveBeenCalledWith('badge1');
    
    // Click the delete button
    const deleteButton = canvas.getByLabelText('Delete badge');
    await userEvent.click(deleteButton);
    
    // Verify the delete event was called with the correct badge ID
    await expect(args.onDelete).toHaveBeenCalledWith('badge1');
  }
};