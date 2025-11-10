// src/server.js
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const startReminderJob = require('./jobs/reminderJob');
const logger = require('./utils/logger');

const server = http.createServer(app);

const start = async () => {
  // 1) connect to DB
  await connectDB();

  // 2) start reminder job
  const reminder = startReminderJob();

  // 3) start server
  server.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });

  // handle graceful shutdown
  const graceful = () => {
    logger.info('Shutting down server...');
    reminder.stop();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
};

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
