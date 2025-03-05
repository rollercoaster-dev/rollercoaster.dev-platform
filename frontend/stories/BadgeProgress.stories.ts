import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import BadgeProgress from "../components/Badge/Progress/index.vue";
import { BadgeStatus } from "../types/badge";

const meta = {
  title: 'Components/BadgeProgress',
  component: BadgeProgress,
  tags: ['autodocs'],
  argTypes: {
    progress: { 
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)'
    }
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="p-4" :class="{ \'light-theme\': isLight }"><story /></div>',
      data() {
        return {
          isLight: false
        }
      }
    })
  ]
} satisfies Meta<typeof BadgeProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story with no progress
export const Empty: Story = {
  args: {
    progress: 0
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check initial state
    const progressText = canvas.getByText('0%');
    await expect(progressText).toBeInTheDocument();
    
    const progressBar = canvas.getByRole('generic');
    const progressFill = progressBar.querySelector('div');
    await expect(progressFill).toHaveStyle({ width: '0%' });
    await expect(progressFill).toHaveClass('progress-started');
  }
};

// Half complete
export const HalfComplete: Story = {
  args: {
    progress: 50
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check progress text
    const progressText = canvas.getByText('50%');
    await expect(progressText).toBeInTheDocument();
    
    // Check progress bar
    const progressBar = canvas.getByRole('generic');
    const progressFill = progressBar.querySelector('div');
    await expect(progressFill).toHaveStyle({ width: '50%' });
    await expect(progressFill).toHaveClass('progress-halfway');
  }
};

// Complete
export const Complete: Story = {
  args: {
    progress: 100
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check progress text
    const progressText = canvas.getByText('100%');
    await expect(progressText).toBeInTheDocument();
    
    // Check progress bar
    const progressBar = canvas.getByRole('generic');
    const progressFill = progressBar.querySelector('div');
    await expect(progressFill).toHaveStyle({ width: '100%' });
    await expect(progressFill).toHaveClass('progress-complete');
  }
};

// Theme switching test
export const ThemeSwitching: Story = {
  args: {
    progress: 75
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = canvasElement.parentElement;
    
    // Initial dark theme
    let progressBar = canvas.getByRole('generic');
    await expect(progressBar).not.toHaveClass('light-theme');
    
    // Switch to light theme
    if (container) {
      container.classList.add('light-theme');
      await expect(progressBar).toBeVisible();
    }
    
    // Switch back to dark theme
    if (container) {
      container.classList.remove('light-theme');
      await expect(progressBar).toBeVisible();
    }
  }
}; 