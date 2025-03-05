import { BadgeStatus } from '../../../shared/types/badge';
import type { Badge, BadgeRequirement } from '../../../shared/types/badge';

// Helper function to create test badge data
// Can be customized by providing override values
export const createTestBadge = (overrides = {}): Badge => ({
  id: 'test-badge-1',
  name: 'Test Badge',
  description: 'A badge created for testing',
  content: '# Test Badge\n\nThis is a test badge.',
  progress: 0,
  status: BadgeStatus.NOT_STARTED,
  requirements: [
    { 
      id: 'req-1', 
      description: 'Complete test requirement 1', 
      completed: false 
    },
    { 
      id: 'req-2', 
      description: 'Complete test requirement 2', 
      completed: false 
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  startDate: new Date().toISOString(),
  targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  ...overrides
});

// Sample badge data for various states
export const testBadges = {
  notStarted: createTestBadge(),
  inProgress: createTestBadge({
    id: 'test-badge-2',
    progress: 50,
    status: BadgeStatus.IN_PROGRESS,
    requirements: [
      { id: 'req-1', description: 'Complete test requirement 1', completed: true },
      { id: 'req-2', description: 'Complete test requirement 2', completed: false }
    ]
  }),
  completed: createTestBadge({
    id: 'test-badge-3',
    progress: 100,
    status: BadgeStatus.COMPLETED,
    requirements: [
      { id: 'req-1', description: 'Complete test requirement 1', completed: true },
      { id: 'req-2', description: 'Complete test requirement 2', completed: true }
    ]
  })
};

// Test data for creating a new badge
export const newBadgeData = {
  name: 'New Test Badge',
  description: 'A newly created test badge',
  content: '# New Test Badge\n\nThis is a new test badge.',
  progress: 0,
  status: BadgeStatus.NOT_STARTED,
  requirements: [
    { 
      id: 'new-req-1', 
      description: 'Complete new requirement 1', 
      completed: false 
    }
  ],
  startDate: new Date().toISOString(),
  targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
}; 