const connectDB = require('../utils/db');
const Clown = require('../models/Clown');
const { handleCors } = require('../utils/cors');
const authMiddleware = require('../middleware/auth');
const { validateClownData } = require('../middleware/validator');

// GET all clowns (public)
const getClowns = async (req, res) => {
  try {
    await connectDB();

    const { search } = req.query;
    let query = {};

    // If search query provided, use text search
    if (search) {
      query = { $text: { $search: search } };
    }

    const clowns = await Clown.find(query).sort({ banDate: -1 });
    return res.status(200).json(clowns);
  } catch (error) {
    console.error('Get clowns error:', error);
    return res.status(500).json({ message: 'Error fetching clowns' });
  }
};

// POST new clown (admin only)
const addClown = async (req, res) => {
  try {
    await connectDB();

    // Validate input
    const errors = validateClownData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const clownData = {
      ...req.body,
      banDate: req.body.banDate || new Date()
    };

    // Auto-generate Steam profile URL if not provided
    if (!clownData.steamProfileUrl && clownData.steamId) {
      const steamId64 = clownData.steamId.replace('steam:', '');
      clownData.steamProfileUrl = `https://steamcommunity.com/profiles/${steamId64}`;
    }

    const clown = new Clown(clownData);
    await clown.save();

    // Optional: Send Discord notification (implement if needed)
    // await sendDiscordNotification(clown);

    return res.status(201).json(clown);
  } catch (error) {
    console.error('Add clown error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Clown with this Steam ID already exists' });
    }
    
    return res.status(500).json({ message: 'Error adding clown' });
  }
};

const handler = async (req, res) => {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    return getClowns(req, res);
  }

  if (req.method === 'POST') {
    // POST requires authentication
    return authMiddleware(addClown)(req, res);
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

module.exports = handler;

