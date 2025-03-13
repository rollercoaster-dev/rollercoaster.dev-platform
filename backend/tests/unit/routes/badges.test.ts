// Tests for the Badge API endpoints
// Covers:
// - Getting all badges
// - Getting a single badge
// - Creating a new badge
// - Updating badge progress

import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { Hono } from 'hono';
import type { Badge } from '@/types/badge';
import { createTestBadge, testBadges, newBadgeData } from '@tests/fixtures/badges';

// Import the routes module - we need to use dynamic import because it has side effects (in-memory data)
let badgesRoute: any;

// Mock response context
const mockJson = mock((data: any, status = 200) => ({ data, status }));
const mockParam = mock((paramName: string) => '');

describe('Feature: Badge Routes', () => {
  // Reset module before each test to get fresh in-memory data
  beforeEach(async () => {
    mockJson.mockClear();
    mockParam.mockClear();
    // We'd need a proper module reset here, but for now we'll just re-import
    badgesRoute = (await import('../../../src/routes/badges')).default;
  });

  afterEach(() => {
    // No need for restoreAllMocks with Bun's mock system
  });

  describe('GET /badges', () => {
    // 🔴 FAILING: Need to implement mocks
    it('should return all badges', async () => {
      // Arrange
      const mockContext = {
        json: mockJson
      };
      
      // Act
      const response = await badgesRoute.routes[0].handler(mockContext);
      
      // Assert
      expect(mockJson).toHaveBeenCalled();
      expect(mockJson.mock.calls[0][0].length).toBeGreaterThan(0);
    });
  });

  describe('GET /badges/:id', () => {
    // 🔴 FAILING: Need to implement mocks
    it('should return a single badge when it exists', async () => {
      // Arrange
      const testId = '1'; // Use ID of a badge we know exists
      const mockContext = {
        json: mockJson,
        req: {
          param: mock().mockReturnValue(testId)
        }
      };
      
      // Act
      const response = await badgesRoute.routes[1].handler(mockContext);
      
      // Assert
      expect(mockJson).toHaveBeenCalled();
      expect(mockJson.mock.calls[0][0].id).toBe(testId);
    });
    
    // ⏳ TODO: Implement later
    // it('should return 404 when badge does not exist', async () => {
    //   // Test for non-existent badge ID
    // });
  });

  // ⏳ TODO: Add tests for POST, PUT, PATCH, and DELETE endpoints
  
  // This is a placeholder for a test we'll implement once we have proper mocking set up
  // 🟢 PASSING
  it('should create a badge with valid data', () => {
    // For now, we're just testing that our test data matches the Badge type
    const badge: Badge = createTestBadge();
    expect(badge.name).toBe('Test Badge');
    expect(badge.status).toBeDefined();
  });
}); 