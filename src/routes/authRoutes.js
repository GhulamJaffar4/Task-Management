// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { registerValidator, loginValidator } = require('../utils/validators');

/**
 * Public:
 * POST /api/auth/register  -> create a normal User
 * POST /api/auth/login     -> returns access & refresh tokens
 * POST /api/auth/refresh   -> exchange refresh token for new access token
 * POST /api/auth/logout    -> revoke refresh token
 */

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/refresh', express.json(), refresh);
router.post('/logout', express.json(), logout);

module.exports = router;
