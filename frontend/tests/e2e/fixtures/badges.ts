export const testBadge = {
  id: 'test-badge-1',
  name: 'Test Badge',
  description: 'A badge for testing',
  progress: 75,
  status: 'IN_PROGRESS',
  requirements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const createTestBadge = (overrides = {}) => ({
  ...testBadge,
  ...overrides,
}); 