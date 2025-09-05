#!/usr/bin/env node

/**
 * Setup script to create .env file from env.example
 * This script helps users set up their environment variables for Supabase connection
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envPath = path.join(__dirname, '.env');

console.log('🚀 LeadsFynder Environment Setup');
console.log('================================\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  rl.question('⚠️  .env file already exists. Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('❌ Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n📋 Setting up environment variables...\n');
  
  // Read env.example
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  
  // Get database password from user
  rl.question('🔑 Enter your Supabase database password: ', (dbPassword) => {
    if (!dbPassword.trim()) {
      console.log('❌ Database password is required!');
      rl.close();
      return;
    }
    
    // Replace placeholder with actual password
    const envContent = envExample.replace('YOUR_DB_PASSWORD', dbPassword.trim());
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment setup complete!');
    console.log('📁 Created .env file in backend directory');
    console.log('\n🔧 Next steps:');
    console.log('1. Run: cd backend && npm install');
    console.log('2. Run: npx prisma generate');
    console.log('3. Run: npx prisma db push');
    console.log('4. Run: npm run dev');
    console.log('\n🌐 Your app will be available at: http://localhost:8000');
    console.log('📚 API docs will be available at: http://localhost:8000/api/docs');
    console.log('🏥 Health check: http://localhost:8000/api/health');
    
    rl.close();
  });
}
