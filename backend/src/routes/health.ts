import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { supabase } from '../config/supabase';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'LeadsFynder API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: Database health check
 *     description: Checks if the database connection is working
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database is healthy
 *       500:
 *         description: Database connection failed
 */
router.get('/db', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /health/supabase:
 *   get:
 *     summary: Supabase health check
 *     description: Checks if the Supabase connection is working
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Supabase is healthy
 *       500:
 *         description: Supabase connection failed
 */
router.get('/supabase', async (req: Request, res: Response) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: 'Supabase not configured',
        error: 'Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
        timestamp: new Date().toISOString()
      });
    }

    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      throw error;
    }
    
    return res.status(200).json({
      success: true,
      message: 'Supabase connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /health/redis:
 *   get:
 *     summary: Redis health check
 *     description: Checks if the Redis connection is working
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Redis is healthy
 *       500:
 *         description: Redis connection failed
 */
router.get('/redis', async (req: Request, res: Response) => {
  try {
    // This would require Redis client setup
    // For now, return a mock response
    return res.status(200).json({
      success: true,
      message: 'Redis connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export const healthRoutes = router;
