// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLE = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
};

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLE), default: ROLE.USER },
    // optional: for notifications
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// hash password before save (only if modified)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.statics.ROLES = ROLE;

module.exports = mongoose.model('User', UserSchema);
