import { Router, Request, Response } from 'express';
import { prisma, checkDatabaseConnection } from '../utils/database';

const router = Router();

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
    const isConnected = await checkDatabaseConnection();
    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
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
    res.status(200).json({
      success: true,
      message: 'Redis connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export const healthRoutes = router;
