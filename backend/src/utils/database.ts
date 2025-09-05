// Optimized database connection for production and serverless environments
import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with optimized configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres.qphomvhegulifftzirmb:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
      }
    }
  });
};

// Export singleton instance
export const prisma = globalThis.__prisma || createPrismaClient();

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Database transaction helper
export const withTransaction = async <T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(callback);
};

// Connection pool monitoring
export const getDatabaseStats = async () => {
  try {
    const [userCount, leadCount, campaignCount] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.emailCampaign.count()
    ]);

    return {
      connected: true,
      stats: {
        users: userCount,
        leads: leadCount,
        campaigns: campaignCount
      }
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
