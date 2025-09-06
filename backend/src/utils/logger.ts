import winston from 'winston';

// Create logs directory if it doesn't exist
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const path = require('path');
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'leadsfynder-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Only add file transports in development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log' 
      })
    ] : [])
  ]
});

// Always log to console
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}));

// Enhanced logging methods
export const enhancedLogger = {
  ...logger,
  
  // Log API requests
  logRequest: (req: any, res: any, responseTime: number) => {
    logger.info('API Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  },

  // Log errors with context
  logError: (error: Error, context?: any) => {
    logger.error('Application Error', {
      message: error.message,
      stack: error.stack,
      context
    });
  },

  // Log database operations
  logDatabase: (operation: string, table: string, duration?: number) => {
    logger.debug('Database Operation', {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined
    });
  }
};

export default logger;
