/**
 * MongoDB Mongoose Schema definitions for MindPulse AI
 */
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Analysis AI History Schema
const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['sentiment', 'summarizer', 'skill_match'], required: true },
  inputText: { type: String, required: true },
  resultJson: { type: mongoose.Schema.Types.Mixed, required: true },
  sentimentLabel: { type: String },
  sentimentScore: { type: Number, default: 0 },
  summaryText: { type: String },
  matchScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Analysis: mongoose.model('Analysis', AnalysisSchema)
};
