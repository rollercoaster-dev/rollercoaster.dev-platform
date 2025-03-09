// API test script
import { fetch } from 'bun';

async function testApi() {
  console.log('Testing API endpoints...');
  
  try {
    // Test health endpoint
    console.log('\n--- Testing /health endpoint ---');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('Status:', healthResponse.status);
    console.log('Response:', healthData);

    // Test badges endpoint
    console.log('\n--- Testing /api/badges endpoint ---');
    const badgesResponse = await fetch('http://localhost:3000/api/badges');
    const badgesData = await badgesResponse.json();
    console.log('Status:', badgesResponse.status);
    console.log('Number of badges:', badgesData.length);
    console.log('First badge:', badgesData[0]);

    // Optional: Test single badge endpoint if badges exist
    if (badgesData.length > 0) {
      const firstBadgeId = badgesData[0].id;
      console.log(`\n--- Testing /api/badges/${firstBadgeId} endpoint ---`);
      const singleBadgeResponse = await fetch(`http://localhost:3000/api/badges/${firstBadgeId}`);
      const singleBadgeData = await singleBadgeResponse.json();
      console.log('Status:', singleBadgeResponse.status);
      console.log('Badge details:', singleBadgeData);
    }

    console.log('\nAPI tests completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the tests
testApi();