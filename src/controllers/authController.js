const User = require('../models/User');
const tokenService = require('../services/tokenService');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Register
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // Determine role
    let assignedRole = 'User'; // default role
    if (role === 'Admin') {
      const adminExists = await User.findOne({ role: 'Admin' });
      if (!adminExists) {
        assignedRole = 'Admin'; // allow first Admin
      } else {
        logger.warn('Attempt to register additional Admin', { email });
        return res.status(403).json({ message: 'Admin already exists. Cannot register another Admin.' });
      }
    }

    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    logger.info('User registered', { userId: user._id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error('Error in register', err);
    next(err);
  }
}

/**
 * Login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const meta = { ip: req.ip, userAgent: req.get('User-Agent') || '' };
    const { session, refreshToken } = await tokenService.createSession(user._id, meta);
    const accessToken = tokenService.signAccessToken({ userId: user._id });

    logger.info('User logged in', { userId: user._id, sessionId: session._id });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      sessionId: session._id,
    });
  } catch (err) {
    logger.error('Login error', err);
    next(err);
  }
}

/**
 * Refresh token
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    let payload;
    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const session = await tokenService.getSessionByToken(refreshToken);
    if (!session) return res.status(401).json({ message: 'Session not found or revoked' });

    const user = await session.populate('user').then((s) => s.user);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = tokenService.signAccessToken({ userId: user._id });

    logger.info('Refresh token used', { userId: user._id, sessionId: session._id });

    res.json({ accessToken });
  } catch (err) {
    logger.error('Refresh token error', err);
    next(err);
  }
}

/**
 * Logout
 */
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    const revoked = await tokenService.revokeRefreshToken(refreshToken);
    logger.info('Logout', { refreshToken, revoked });

    res.json({ message: 'Logged out' });
  } catch (err) {
    logger.error('Logout error', err);
    next(err);
  }
}

module.exports = { register, login, refresh, logout };
