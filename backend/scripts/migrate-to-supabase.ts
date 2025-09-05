#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function migrateToSupabase() {
  console.log('🚀 Starting migration to Supabase...\n');

  try {
    // Step 1: Generate Prisma migration files
    console.log('📝 Generating Prisma migration files...');
    execSync('npx prisma migrate dev --name supabase-migration', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Step 2: Check if Supabase environment variables are set
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('❌ Supabase environment variables not found!');
      console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
      process.exit(1);
    }

    // Step 3: Update DATABASE_URL to point to Supabase
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Comment out local DATABASE_URL and uncomment Supabase one
    envContent = envContent.replace(
      /^DATABASE_URL=.*$/m,
      '# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leadsfynder'
    );
    
    // Uncomment and set Supabase DATABASE_URL
    const supabaseDatabaseUrl = process.env.DATABASE_URL;
    if (supabaseDatabaseUrl) {
      envContent = envContent.replace(
        /^# DATABASE_URL=postgresql:\/\/postgres\.\[YOUR-PROJECT-REF\]:\[YOUR-PASSWORD\]@aws-0-\[REGION\]\.pooler\.supabase\.com:6543\/postgres$/m,
        `DATABASE_URL=${supabaseDatabaseUrl}`
      );
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with Supabase configuration');

    // Step 4: Push schema to Supabase
    console.log('📤 Pushing schema to Supabase...');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Step 5: Generate Prisma client for Supabase
    console.log('🔧 Generating Prisma client for Supabase...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('\n✅ Migration to Supabase completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test your application with Supabase');
    console.log('2. Update your Vercel environment variables');
    console.log('3. Deploy to Vercel');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSupabase();
}

export { migrateToSupabase };
