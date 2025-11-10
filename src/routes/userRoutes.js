// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { createUser, listUsers } = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');

/**
 * Admin-only user management
 */
router.post('/', authenticate, authorize('Admin'), express.json(), validateRequest, createUser);
router.get('/', authenticate, authorize('Admin'), listUsers);

module.exports = router;
