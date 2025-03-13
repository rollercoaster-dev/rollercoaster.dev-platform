/**
 * Tests for verifying path alias configuration.
 * Ensures that all configured path aliases work correctly.
 */
import { describe, expect, it } from 'bun:test';
import { BadgeStatus } from '@/types/badge';
import badgeRoutes from '@routes/badges';
import { validateBadge } from '@utils/validation';

describe('Path Aliases', () => {
  it('should successfully import from @/ alias', () => {
    expect(BadgeStatus).toBeDefined();
  });

  it('should successfully import from @routes/* alias', () => {
    expect(badgeRoutes).toBeDefined();
  });

  it('should successfully import from @utils/* alias', () => {
    expect(validateBadge).toBeDefined();
  });
}); 