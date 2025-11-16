const connectDB = require('../utils/db');
const Clown = require('../models/Clown');
const { handleCors } = require('../utils/cors');
const authMiddleware = require('../middleware/auth');
const { validateClownData } = require('../middleware/validator');

// GET single clown by ID (public)
const getClownById = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.query;
    const clown = await Clown.findById(id);
    
    if (!clown) {
      return res.status(404).json({ message: 'Clown not found' });
    }

    return res.status(200).json(clown);
  } catch (error) {
    console.error('Get clown error:', error);
    return res.status(500).json({ message: 'Error fetching clown' });
  }
};

// PUT update clown (admin only)
const updateClown = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.query;

    // Validate input if provided
    if (req.body.steamId || req.body.discordId || req.body.reason) {
      const errors = validateClownData({
        steamId: req.body.steamId || 'steam:0',
        discordId: req.body.discordId || 'temp',
        reason: req.body.reason || 'temporary validation',
        ...req.body
      });
      
      // Only check for relevant field errors
      const relevantErrors = errors.filter(e => req.body[e.field]);
      if (relevantErrors.length > 0) {
        return res.status(400).json({ errors: relevantErrors });
      }
    }

    const clown = await Clown.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!clown) {
      return res.status(404).json({ message: 'Clown not found' });
    }

    return res.status(200).json(clown);
  } catch (error) {
    console.error('Update clown error:', error);
    return res.status(500).json({ message: 'Error updating clown' });
  }
};

// DELETE clown (admin only)
const deleteClown = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.query;
    const clown = await Clown.findByIdAndDelete(id);

    if (!clown) {
      return res.status(404).json({ message: 'Clown not found' });
    }

    return res.status(200).json({ message: 'Clown removed successfully' });
  } catch (error) {
    console.error('Delete clown error:', error);
    return res.status(500).json({ message: 'Error deleting clown' });
  }
};

const handler = async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    return getClownById(req, res);
  }

  if (req.method === 'PUT') {
    return authMiddleware(updateClown)(req, res);
  }

  if (req.method === 'DELETE') {
    return authMiddleware(deleteClown)(req, res);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

module.exports = handler;

