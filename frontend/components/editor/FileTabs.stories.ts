import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import FileTabs from './FileTabs.vue';
import { BadgeTab } from '../../types/badge';

const mockTabs: BadgeTab[] = [
  {
    id: 'tab1',
    badgeId: 'badge1',
    title: 'Learn Vue.js',
    type: 'badge',
    active: true
  },
  {
    id: 'tab2',
    badgeId: 'badge1',
    title: 'Learn Vue.js - Requirements',
    type: 'requirements',
    active: false
  },
  {
    id: 'tab3',
    badgeId: 'badge2',
    title: 'TypeScript Fundamentals',
    type: 'badge',
    active: false
  },
  {
    id: 'tab4',
    badgeId: 'badge3',
    title: 'CSS Grid - Notes',
    type: 'notes',
    active: false
  }
];

const meta: Meta<typeof FileTabs> = {
  title: 'Editor/FileTabs',
  component: FileTabs,
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'select' },
    onClose: { action: 'close' },
    onCreateTab: { action: 'createTab' }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [...mockTabs]
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Select a different tab
    await userEvent.click(canvas.getByText('TypeScript Fundamentals'));
    
    // Verify the select event was called with the correct tab ID
    await expect(args.onSelect).toHaveBeenCalledWith('tab3');
  }
};

export const ClosingTabs: Story = {
  args: {
    tabs: [...mockTabs]
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find all close buttons
    const closeButtons = canvas.getAllByLabelText('Close tab');
    
    // Close the second tab
    await userEvent.click(closeButtons[1]);
    
    // Verify the close event was called with the correct tab ID
    await expect(args.onClose).toHaveBeenCalledWith('tab2');
  }
};

export const EmptyTabs: Story = {
  args: {
    tabs: []
  }
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      ...mockTabs,
      {
        id: 'tab5',
        badgeId: 'badge4',
        title: 'Node.js Basics',
        type: 'badge',
        active: false
      },
      {
        id: 'tab6',
        badgeId: 'badge5',
        title: 'Express Framework',
        type: 'badge',
        active: false
      },
      {
        id: 'tab7',
        badgeId: 'badge6',
        title: 'MongoDB',
        type: 'badge',
        active: false
      },
      {
        id: 'tab8',
        badgeId: 'badge7',
        title: 'Testing with Jest',
        type: 'badge',
        active: false
      }
    ]
  },
  parameters: {
    layout: 'fullscreen',
  }
};