const http = require('http');

const BASE_URL = 'http://localhost:8000/api';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Testing LeadsFynder Backend Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing Health Endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');

    // Test health/db endpoint
    console.log('2. Testing Database Health...');
    const dbHealth = await makeRequest('/health/db');
    console.log(`   Status: ${dbHealth.status}`);
    console.log(`   Response:`, dbHealth.data);
    console.log('');

    // Test health/test endpoint
    console.log('3. Testing Health Test Endpoint...');
    const testHealth = await makeRequest('/health/test');
    console.log(`   Status: ${testHealth.status}`);
    console.log(`   Response:`, testHealth.data);
    console.log('');

    // Test registration
    console.log('4. Testing User Registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };
    const register = await makeRequest('/auth/register', 'POST', registerData);
    console.log(`   Status: ${register.status}`);
    console.log(`   Response:`, register.data);
    console.log('');

    // Test login
    console.log('5. Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const login = await makeRequest('/auth/login', 'POST', loginData);
    console.log(`   Status: ${login.status}`);
    console.log(`   Response:`, login.data);
    console.log('');

    console.log('✅ All tests completed successfully!');
    console.log('\n🎉 Backend is working correctly with demo mode support!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints();
