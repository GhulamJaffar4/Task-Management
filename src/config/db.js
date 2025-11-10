// src/config/db.js
const mongoose = require('mongoose');
const { mongoURI } = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Connect without deprecated options
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
