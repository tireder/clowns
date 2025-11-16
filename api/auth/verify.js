const { handleCors } = require('../utils/cors');
const authMiddleware = require('../middleware/auth');

const handler = async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    return res.status(200).json({ 
      valid: true, 
      admin: req.admin 
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authMiddleware(handler);

