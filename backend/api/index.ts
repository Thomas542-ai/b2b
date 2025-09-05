import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    message: 'LeadsFynder API is running',
    endpoints: [
      '/api/health',
      '/api/test', 
      '/api/auth/login',
      '/api/auth/register'
    ]
  });
}
