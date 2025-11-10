// src/utils/logger.js
const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  debug: 'DEBUG',
};

/**
 * Formats the log message with timestamp and level
 * @param {string} level
 * @param {string} message
 * @param {any} meta - optional object to log
 */
function log(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  const lvl = levels[level] || 'INFO';
  if (meta) {
    console.log(`[${timestamp}] [${lvl}] ${message}`, meta);
  } else {
    console.log(`[${timestamp}] [${lvl}] ${message}`);
  }
}

module.exports = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
};
