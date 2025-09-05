// Vercel serverless function entry point
import app from '../backend/src/index';

// Export the app for Vercel
export default app;

// For Vercel Functions, we need to handle the request/response
export const handler = (req: any, res: any) => {
  return app(req, res);
};
