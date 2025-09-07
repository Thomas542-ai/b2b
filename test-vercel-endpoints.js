// Test script to verify Vercel endpoints are working
// Run this with: node test-vercel-endpoints.js

const https = require('https');

const BASE_URL = 'https://b2b-6g6r.vercel.app';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'b2b-6g6r.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Testing Vercel Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await makeRequest('/api/health');
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response: ${healthResponse.data}\n`);

    // Test 2: Registration
    console.log('2. Testing Registration Endpoint...');
    const registerData = {
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company'
    };
    const registerResponse = await makeRequest('/api/auth/register', 'POST', registerData);
    console.log(`   Status: ${registerResponse.statusCode}`);
    console.log(`   Response: ${registerResponse.data}\n`);

    // Test 3: Login
    console.log('3. Testing Login Endpoint...');
    const loginData = {
      email: 'test@example.com',
      password: 'test123'
    };
    const loginResponse = await makeRequest('/api/auth/login', 'POST', loginData);
    console.log(`   Status: ${loginResponse.statusCode}`);
    console.log(`   Response: ${loginResponse.data}\n`);

    // Summary
    console.log('📊 Test Summary:');
    console.log(`   Health: ${healthResponse.statusCode === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Register: ${registerResponse.statusCode === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Login: ${loginResponse.statusCode === 200 ? '✅ PASS' : '❌ FAIL'}`);

    if (healthResponse.statusCode === 200 && 
        (registerResponse.statusCode === 200 || registerResponse.statusCode === 400) && 
        (loginResponse.statusCode === 200 || loginResponse.statusCode === 401)) {
      console.log('\n🎉 All endpoints are working correctly!');
    } else {
      console.log('\n❌ Some endpoints are not working. Check Vercel deployment.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints();
