import { checkDatabaseConnection } from '../src/db';
import { badgeRepository } from '../src/db/repositories/badgeRepository';
import { BadgeStatus } from '../../shared/types/badge';

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Check database connection
    const connected = await checkDatabaseConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Create a test badge
    console.log('Creating test badge...');
    const testBadge = await badgeRepository.createBadge({
      name: 'Test Badge',
      description: 'A test badge to verify database operations',
      content: '# Test Badge\n\nThis is a test badge created to verify database operations.',
      progress: 50,
      status: BadgeStatus.IN_PROGRESS,
      requirements: [
        {
          id: 'req-1',
          description: 'Requirement 1',
          completed: true
        },
        {
          id: 'req-2',
          description: 'Requirement 2',
          completed: false
        }
      ]
    });
    
    console.log('✅ Test badge created:', testBadge.id);
    
    // Get the badge
    console.log('Retrieving test badge...');
    const retrievedBadge = await badgeRepository.getBadgeById(testBadge.id);
    
    if (!retrievedBadge) {
      console.error('❌ Failed to retrieve test badge');
      process.exit(1);
    }
    
    console.log('✅ Test badge retrieved successfully');
    console.log(retrievedBadge);
    
    // Update the badge
    console.log('Updating test badge...');
    const updatedBadge = await badgeRepository.updateBadge(testBadge.id, {
      name: 'Updated Test Badge',
      progress: 75,
      requirements: [
        {
          id: 'req-1',
          description: 'Updated Requirement 1',
          completed: true
        },
        {
          id: 'req-2',
          description: 'Updated Requirement 2',
          completed: true
        }
      ]
    });
    
    if (!updatedBadge) {
      console.error('❌ Failed to update test badge');
      process.exit(1);
    }
    
    console.log('✅ Test badge updated successfully');
    console.log(updatedBadge);
    
    // Delete the badge
    console.log('Deleting test badge...');
    const deleted = await badgeRepository.deleteBadge(testBadge.id);
    
    if (!deleted) {
      console.error('❌ Failed to delete test badge');
      process.exit(1);
    }
    
    console.log('✅ Test badge deleted successfully');
    
    console.log('All database tests passed! 🎉');
  } catch (error) {
    console.error('❌ Error during database tests:', error);
    process.exit(1);
  }
}

testDatabase();