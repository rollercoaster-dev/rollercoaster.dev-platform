import { spawn } from 'child_process';

// Execute a command in the Docker container
function execInDocker(command) {
  return new Promise((resolve, reject) => {
    // Create the full Docker command
    const fullCommand = `docker exec atbadges-postgres ${command}`;
    console.log(`Running: ${fullCommand}`);
    
    // Run the command
    const process = spawn('sh', ['-c', fullCommand]);
    
    let stdout = '';
    let stderr = '';
    
    // Collect stdout
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Collect stderr
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process completion
    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    
    // Handle process errors
    process.on('error', (err) => {
      reject(err);
    });
  });
}

async function testBadgeOperations() {
  try {
    console.log('=== Badge Database Operations Test ===');
    
    // Clear any previous test data
    console.log('\n1. Clearing previous test data...');
    await execInDocker('psql -U postgres -d atbadges -c "DELETE FROM badge_requirements WHERE badge_id = \'test-api-badge\'"');
    await execInDocker('psql -U postgres -d atbadges -c "DELETE FROM badges WHERE id = \'test-api-badge\'"');
    
    // Create a test badge
    console.log('\n2. Creating a test badge...');
    const createBadgeCmd = `psql -U postgres -d atbadges -c "
      INSERT INTO badges (
        id, name, description, content, progress, status, created_at, updated_at
      ) VALUES (
        'test-api-badge', 
        'API Test Badge', 
        'Testing badge operations via API', 
        '# API Test Badge', 
        25, 'IN_PROGRESS', NOW(), NOW()
      ) RETURNING id, name, progress
    "`;
    
    const createBadgeResult = await execInDocker(createBadgeCmd);
    console.log('Badge created:', createBadgeResult);
    
    // Create badge requirements
    console.log('\n3. Adding badge requirements...');
    const addRequirementsCmd = `psql -U postgres -d atbadges -c "
      INSERT INTO badge_requirements (
        id, badge_id, description, completed, created_at, updated_at
      ) VALUES 
        ('test-api-req-1', 'test-api-badge', 'Requirement 1', true, NOW(), NOW()),
        ('test-api-req-2', 'test-api-badge', 'Requirement 2', false, NOW(), NOW())
      RETURNING id, description, completed
    "`;
    
    const addRequirementsResult = await execInDocker(addRequirementsCmd);
    console.log('Requirements added:', addRequirementsResult);
    
    // Get the badge with requirements
    console.log('\n4. Retrieving badge with requirements...');
    const getBadgeCmd = `psql -U postgres -d atbadges -c "
      SELECT b.id, b.name, b.progress, b.status, 
             r.id AS req_id, r.description AS req_description, r.completed
      FROM badges b
      LEFT JOIN badge_requirements r ON b.id = r.badge_id
      WHERE b.id = 'test-api-badge'
    "`;
    
    const getBadgeResult = await execInDocker(getBadgeCmd);
    console.log('Badge with requirements:', getBadgeResult);
    
    // Update badge progress
    console.log('\n5. Updating badge progress...');
    const updateProgressCmd = `psql -U postgres -d atbadges -c "
      UPDATE badges 
      SET progress = 75, 
          status = 'IN_PROGRESS',
          updated_at = NOW() 
      WHERE id = 'test-api-badge'
      RETURNING id, name, progress, status
    "`;
    
    const updateProgressResult = await execInDocker(updateProgressCmd);
    console.log('Progress updated:', updateProgressResult);
    
    // Update requirement status
    console.log('\n6. Updating requirement status...');
    const updateRequirementCmd = `psql -U postgres -d atbadges -c "
      UPDATE badge_requirements
      SET completed = true,
          updated_at = NOW()
      WHERE id = 'test-api-req-2'
      RETURNING id, description, completed
    "`;
    
    const updateRequirementResult = await execInDocker(updateRequirementCmd);
    console.log('Requirement updated:', updateRequirementResult);
    
    // Delete the test badge (will cascade delete requirements)
    console.log('\n7. Deleting test badge...');
    const deleteBadgeCmd = `psql -U postgres -d atbadges -c "
      DELETE FROM badges 
      WHERE id = 'test-api-badge'
      RETURNING id
    "`;
    
    const deleteBadgeResult = await execInDocker(deleteBadgeCmd);
    console.log('Badge deleted:', deleteBadgeResult);
    
    // Verify deletion
    console.log('\n8. Verifying deletion...');
    const verifyDeletionCmd = `psql -U postgres -d atbadges -c "
      SELECT COUNT(*) FROM badges WHERE id = 'test-api-badge'
    "`;
    
    const verifyDeletionResult = await execInDocker(verifyDeletionCmd);
    console.log('Verification result:', verifyDeletionResult);
    
    console.log('\n✅ All database operations completed successfully!');
  } catch (error) {
    console.error('❌ Error during database operations test:', error);
  }
}

// Run the test
testBadgeOperations();