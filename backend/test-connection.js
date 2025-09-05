#!/usr/bin/env node

/**
 * Test script to verify Supabase database connection
 * This script tests the Prisma connection to Supabase PostgreSQL database
 * Run this script to check if your Supabase database connection is working
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing Supabase database connection...\n');
  
  // Check environment variables first
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is missing');
    console.log('Please set DATABASE_URL in your .env file with your Supabase connection string');
    return;
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Supabase environment variables are missing');
    console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
    return;
  }
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Basic connection successful\n');
    
    // Test database info
    console.log('2. Getting database information...');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database version:', result[0].version);
    console.log('');
    
    // Test if tables exist
    console.log('3. Checking if tables exist...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    if (tables.length > 0) {
      console.log('✅ Found tables:', tables.map(t => t.table_name).join(', '));
    } else {
      console.log('⚠️  No tables found. You may need to run migrations.');
    }
    console.log('');
    
    // Test Prisma client
    console.log('4. Testing Prisma client...');
    const userCount = await prisma.user.count();
    console.log('✅ Prisma client working. User count:', userCount);
    console.log('');
    
    console.log('🎉 All tests passed! Your Supabase connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have a .env file in the backend directory');
    console.log('2. Check that DATABASE_URL is correct (should be your Supabase PostgreSQL connection string)');
    console.log('3. Verify your Supabase database password');
    console.log('4. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set');
    console.log('5. Run: npx prisma generate');
    console.log('6. Run: npx prisma db push');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
