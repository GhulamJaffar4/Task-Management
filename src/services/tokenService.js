// src/services/tokenService.js
const jwt = require('jsonwebtoken');
const ms = require('ms'); // optional helper - but we didn't install ms; will parse durations manually
const config = require('../config');
const Session = require('../models/Session');

const ACCESS_EXPIRES = config.accessTokenExpiresIn || '15m';
const REFRESH_EXPIRES = config.refreshTokenExpiresIn || '7d';

function signAccessToken(payload) {
  return jwt.sign(payload, config.accessTokenSecret, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshTokenSecret);
}

/**
 * Create session and return refresh token (persisted)
 * @param {ObjectId} userId
 * @param {Object} meta {ip, userAgent}
 */
async function createSession(userId, meta = {}) {
  const payload = { userId };
  const refreshToken = signRefreshToken(payload);

  // compute expiry date for session in DB using JWT expiry decode
  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);

  const session = await Session.create({
    user: userId,
    refreshToken,
    userAgent: meta.userAgent || '',
    ip: meta.ip || '',
    expiresAt,
  });

  return { session, refreshToken };
}

async function revokeRefreshToken(refreshToken) {
  const session = await Session.findOne({ refreshToken });
  if (!session) return false;
  session.revoked = true;
  await session.save();
  return true;
}

async function getSessionByToken(refreshToken) {
  return Session.findOne({ refreshToken, revoked: false }).populate('user');
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createSession,
  revokeRefreshToken,
  getSessionByToken,
};
