// Test script for creating and updating badges
import { fetch } from 'bun';
import { badgeEngineService } from '@/services/badgeEngineService';
import { BadgeStatus } from '@/types/badge';

async function testCreateAndUpdate() {
  console.log('Testing badge creation and updates...');
  
  try {
    // 1. Create a new badge
    console.log('\n--- Creating a new badge ---');
    const newBadge = {
      name: "GraphQL Basics",
      description: "Learn the fundamentals of GraphQL",
      content: "# GraphQL Basics Badge\n\nThis badge covers GraphQL fundamentals.\n\n## Requirements\n\n- Learn schema definition\n- Understand queries and mutations\n- Build a GraphQL API",
      progress: 10,
      status: BadgeStatus.IN_PROGRESS,
      requirements: [
        { id: "req-1", description: "Learn schema definition", completed: false },
        { id: "req-2", description: "Understand queries and mutations", completed: true },
        { id: "req-3", description: "Build a GraphQL API", completed: false }
      ],
      startDate: "2025-03-01",
      targetDate: "2025-04-15"
    };
    
    const createResponse = await fetch('http://localhost:3000/api/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBadge)
    });
    
    const createdBadge = await createResponse.json();
    console.log('Status:', createResponse.status);
    console.log('Created badge:', createdBadge);
    
    if (!createdBadge.id) {
      throw new Error('Failed to create badge');
    }
    
    // 2. Update the badge progress
    console.log('\n--- Updating badge progress ---');
    const progressUpdate = {
      progress: 35,
      requirements: [
        { id: "req-1", completed: true },
      ]
    };
    
    const updateResponse = await fetch(`http://localhost:3000/api/badges/${createdBadge.id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressUpdate)
    });
    
    const updatedBadge = await updateResponse.json();
    console.log('Status:', updateResponse.status);
    console.log('Updated badge:', updatedBadge);
    
    // 3. Check if the badge engine integration is working (check for externalId)
    console.log('\n--- Checking badge-engine integration ---');
    console.log('External ID:', updatedBadge.externalId || 'Not found');
    console.log('External Source:', updatedBadge.externalSource || 'Not found');
    
    if (updatedBadge.externalId && updatedBadge.externalSource) {
      console.log('✅ Badge-engine integration is working!');
    } else {
      console.log('⚠️ Badge-engine integration not detected. Badge-engine may not be running or is unavailable.');
    }
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

// Run the tests
testCreateAndUpdate();