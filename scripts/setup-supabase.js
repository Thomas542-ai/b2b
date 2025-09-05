#!/usr/bin/env node

/**
 * Supabase Setup Script for LeadsFynder
 * This script helps you set up the connection to Supabase
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupSupabase() {
  console.log('🚀 LeadsFynder Supabase Setup');
  console.log('================================\n');

  try {
    // Check if .env already exists
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env file already exists!');
      const overwrite = await question('Do you want to update it with Supabase configuration? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    // Get Supabase connection details
    console.log('\n📋 Please provide your Supabase connection details:');
    console.log('You can find these in your Supabase project: Settings → Database\n');

    const projectRef = await question('Enter your Supabase project reference (e.g., abcdefghijklmnop): ');
    const password = await question('Enter your Supabase database password: ');

    // Construct the DATABASE_URL
    const databaseUrl = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

    // Read the example env file
    let envContent = fs.readFileSync(envExamplePath, 'utf8');

    // Update the DATABASE_URL
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${databaseUrl}`
    );

    // Add a comment
    envContent = `# =============================================================================
# LEADSFYNDER ENVIRONMENT CONFIGURATION - SUPABASE SETUP
# =============================================================================
# Generated on: ${new Date().toISOString()}
# Database: Supabase PostgreSQL

${envContent}`;

    // Write the .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ .env file created successfully!');
    console.log(`📊 Database URL: ${databaseUrl.replace(password, '***')}`);

    // Ask if they want to run migrations
    const runMigrations = await question('\n🔄 Do you want to run Prisma migrations now? (y/N): ');
    
    if (runMigrations.toLowerCase() === 'y') {
      console.log('\n🏃 Running Prisma migrations...');
      
      const { execSync } = require('child_process');
      const backendPath = path.join(__dirname, '..', 'backend');
      
      try {
        // Generate Prisma client
        console.log('📦 Generating Prisma client...');
        execSync('npx prisma generate', { cwd: backendPath, stdio: 'inherit' });
        
        // Run migrations
        console.log('🗄️  Running database migrations...');
        execSync('npx prisma migrate deploy', { cwd: backendPath, stdio: 'inherit' });
        
        console.log('\n✅ Migrations completed successfully!');
        console.log('🎉 Your LeadsFynder project is now connected to Supabase!');
        
      } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.log('\n💡 You can run migrations manually later:');
        console.log('   cd backend');
        console.log('   npx prisma generate');
        console.log('   npx prisma migrate deploy');
      }
    }

    console.log('\n📚 Next steps:');
    console.log('1. Start your backend: cd backend && npm run dev');
    console.log('2. Start your frontend: cd frontend && npm run dev');
    console.log('3. Test the connection: curl http://localhost:8000/api/health/db');
    console.log('\n📖 For more details, see SUPABASE_SETUP.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setupSupabase();
