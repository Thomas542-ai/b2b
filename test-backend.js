// Simple script to test if the backend is running and accessible
const http = require('http');

const testEndpoint = (path, description) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
      resolve({ success: true, status: res.statusCode });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${description}: Request timeout`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
};

async function testBackend() {
  console.log('🔍 Testing LeadsFynder Backend...\n');

  const tests = [
    { path: '/api/health', description: 'Health Check' },
    { path: '/api/leads', description: 'Leads Endpoint' },
    { path: '/api/campaigns/email', description: 'Email Campaigns' },
    { path: '/api/campaigns/smtp', description: 'SMTP Configs' }
  ];

  let allPassed = true;

  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    if (!result.success) {
      allPassed = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All tests passed! Backend is running correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the backend server.');
    console.log('\nTo fix:');
    console.log('1. Make sure backend/.env file exists');
    console.log('2. Run: cd backend && npm run dev');
  }
}

testBackend();
