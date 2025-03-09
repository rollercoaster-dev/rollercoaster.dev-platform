-- Insert a test badge
INSERT INTO badges (
  id, 
  name, 
  description, 
  content,
  progress,
  status,
  created_at,
  updated_at,
  start_date,
  target_date,
  external_id,
  external_source
) VALUES (
  'test-badge-1',
  'Test Badge',
  'A test badge to verify database operations',
  '# Test Badge\n\nThis is a test badge created to verify database operations.',
  50,
  'IN_PROGRESS',
  NOW(),
  NOW(),
  '2023-01-01',
  '2023-12-31',
  'ext-test-1',
  'badge-engine'
);

-- Insert a test badge requirement
INSERT INTO badge_requirements (
  id,
  badge_id,
  description,
  completed,
  created_at,
  updated_at
) VALUES (
  'test-req-1',
  'test-badge-1',
  'Complete the test',
  true,
  NOW(),
  NOW()
);

-- Show the badge
SELECT * FROM badges WHERE id = 'test-badge-1';

-- Show the requirement
SELECT * FROM badge_requirements WHERE badge_id = 'test-badge-1';