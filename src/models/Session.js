// src/models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', SessionSchema);
