import { test, expect } from '@playwright/test';
import { createTestBadge } from './fixtures/badges';

test.describe('Feature: Badge Progress Component', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for Nuxt to be ready
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display correct progress percentage', async ({ page }) => {
    // Navigate to the badges page and wait for it to be ready
    await page.goto('/badges');
    await page.waitForLoadState('networkidle');
    
    // Wait for the progress component to be visible
    const progressBar = await page.locator('.progress-bar').first();
    await expect(progressBar).toBeVisible();
    
    // Check the progress text
    const progressText = await page.getByText('75%').first();
    await expect(progressText).toBeVisible();
    
    // Verify progress bar width
    const progressFill = await page.locator('.progress-bar > div').first();
    await expect(progressFill).toHaveAttribute('style', /width: 75%/);
  });

  test('should apply correct progress class based on percentage', async ({ page }) => {
    // Test different progress states
    const states = [
      { progress: 25, class: 'progress-started' },
      { progress: 75, class: 'progress-halfway' },
      { progress: 100, class: 'progress-complete' }
    ];

    for (const state of states) {
      await page.goto('/badges');
      await page.waitForLoadState('networkidle');
      
      const progressFill = await page.locator('.progress-bar > div').first();
      await expect(progressFill).toHaveClass(new RegExp(state.class));
    }
  });
}); 