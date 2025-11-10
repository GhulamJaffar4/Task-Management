// src/middleware/auth.js
const tokenService = require('../services/tokenService');
const User = require('../models/User');

/**
 * Protect routes using Bearer Access Token
 * Attaches req.user = { id, role, email, ... } (fresh from DB)
 */
async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = tokenService.verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
