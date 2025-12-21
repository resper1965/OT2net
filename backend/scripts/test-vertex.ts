import { vertexService } from '../src/services/vertex-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load envs
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

async function testVertex() {
  console.log('Testing Vertex AI Connectivity...');
  console.log('Project:', process.env.GOOGLE_CLOUD_PROJECT_ID || 'ot2net (default)');
  
  try {
    const isHealthy = await vertexService.healthCheck();
    if (isHealthy) {
      console.log('✅ Vertex AI Health Check Passed!');
      
      // Test Flash Generation
      console.log('\nTesting Flash Model generation...');
      const flashResult = await vertexService.generateJson(
        'Generate a JSON object with key "message" and value "Hello Flash"', 
        'flash'
      );
      console.log('Flash Result:', JSON.stringify(flashResult, null, 2));

    } else {
      console.error('❌ Vertex AI Health Check Failed.');
    }
  } catch (error) {
    console.error('❌ Exception during test:', error);
  }
}

testVertex();
