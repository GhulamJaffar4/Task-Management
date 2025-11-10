// src/controllers/userController.js
const User = require('../models/User');

/**
 * Admin-only: create a user with specified role (Admin/Manager/User)
 */
async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    // only Admin can create Admin/Manager roles; other roles will be ignored if not allowed
    const roles = User.ROLES || { ADMIN: 'Admin', MANAGER: 'Manager', USER: 'User' };
    let assignedRole = role && Object.values(roles).includes(role) ? role : roles.USER;

    // if requestor is not Admin, force role to User (this endpoint is Admin-only though)
    if (req.user.role !== roles.ADMIN) assignedRole = roles.USER;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin-only: list all users
 */
async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  listUsers,
};
