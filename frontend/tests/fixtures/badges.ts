/**
 * Mock badge data for testing
 * This provides consistent test data for badge-related tests
 */

import { BadgeStatus } from '../../../shared/types/badge'
import type { Badge, BadgeRequirement } from '../../../shared/types/badge'

/**
 * Helper function to create a test badge with optional overrides
 */
export const createTestBadge = (overrides = {}): Badge => ({
  id: 'test-badge-1',
  name: 'Test Badge',
  description: 'A badge for testing purposes',
  progress: 0,
  status: BadgeStatus.NOT_STARTED,
  requirements: [
    {
      id: 'req-1',
      description: 'Complete test suite',
      completed: false
    },
    {
      id: 'req-2',
      description: 'Write documentation',
      completed: false
    }
  ],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  ...overrides
})

/**
 * Collection of mock badges for testing
 */
export const mockBadges: Badge[] = [
  createTestBadge({
    id: 'badge-1',
    name: 'JavaScript Mastery',
    progress: 65,
    status: BadgeStatus.IN_PROGRESS
  }),
  createTestBadge({
    id: 'badge-2',
    name: 'CSS Animations',
    description: 'Create beautiful animations with CSS',
    progress: 30,
    status: BadgeStatus.IN_PROGRESS
  }),
  createTestBadge({
    id: 'badge-3',
    name: 'Testing Champion',
    requirements: [
      {
        id: 'req-1',
        description: 'Write unit tests',
        completed: true
      },
      {
        id: 'req-2',
        description: 'Write integration tests',
        completed: true
      },
      {
        id: 'req-3',
        description: 'Achieve 90% coverage',
        completed: false
      }
    ],
    progress: 85,
    status: BadgeStatus.IN_PROGRESS
  })
] 