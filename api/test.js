// Basic Vercel API function - test
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    success: true,
    message: 'Test endpoint is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
