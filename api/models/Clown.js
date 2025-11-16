const mongoose = require('mongoose');

const clownSchema = new mongoose.Schema({
  steamId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  steamProfileUrl: {
    type: String,
    trim: true
  },
  discordId: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true
  },
  cheatName: {
    type: String,
    trim: true
  },
  banDate: {
    type: Date,
    default: Date.now
  },
  proofUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search functionality
clownSchema.index({ steamId: 'text', discordId: 'text', reason: 'text', cheatName: 'text' });

module.exports = mongoose.models.Clown || mongoose.model('Clown', clownSchema);

