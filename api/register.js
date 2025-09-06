// Basic Vercel API function - register
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    res.status(200).json({
      success: true,
      message: 'Register endpoint is working!',
      method: req.method,
      body: req.body
    });
    return;
  }
  
  res.status(405).json({
    success: false,
    message: 'Method not allowed',
    method: req.method
  });
};
