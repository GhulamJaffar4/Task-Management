// src/config/index.js
const dotenv = require('dotenv');
const path = require('path');

const envPath = process.env.NODE_ENV === 'production' ? '.env' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb',
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret_change_me',
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret_change_me',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  reminderCron: process.env.REMINDER_CRON || '0 * * * *', // every hour by default
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};
