const jwt = require('jsonwebtoken');
const connectDB = require('../utils/db');
const Admin = require('../models/Admin');
const { handleCors } = require('../utils/cors');
const { validateLoginData } = require('../middleware/validator');
const rateLimit = require('../middleware/rateLimit');

const handler = async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    // Validate input
    const errors = validateLoginData({ email, password });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      email: admin.email
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// Apply rate limiting (5 attempts per 15 minutes)
module.exports = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 })(handler);

