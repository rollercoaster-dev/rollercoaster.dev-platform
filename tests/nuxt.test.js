import { setup, $fetch } from '@nuxt/test-utils';
import { describe, test, expect } from 'vitest';
// This test verifies that the Nuxt SSR setup is working properly. 
// It uses @nuxt/test-utils to launch a test instance of the application.

const nuxt = await setup({ server: true });

describe('Nuxt SSR - Shadcn + Tailwind Setup', () => {
  test('Homepage renders successfully', async () => {
    const html = await $fetch('/');
    // Ensure the response is proper HTML (basic SSR check)
    expect(html).toContain('<!DOCTYPE html>');
  });

  test('Tailwind CSS appears to be applied', async () => {
    const html = await $fetch('/');
    // A simple regex check for a common Tailwind class pattern, e.g., "text-"
    expect(html).toMatch(/class="[^"]*text-/);
  });

  test('Shadcn Button renders correctly', async () => {
    const html = await $fetch('/');
    // Updated regex using [\s\S]* to match any whitespace including newlines
    expect(html).toMatch(/<button[^>]*>[\s\S]*<!--\[-->[\s\S]*<!--\]-->[\s\S]*<\/button>/i);
  });
}); 