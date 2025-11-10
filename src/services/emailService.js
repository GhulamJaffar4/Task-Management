// src/services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

let transporter = null;
if (config.smtp && config.smtp.host) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port || 587,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
} else {
  logger.info('[emailService] SMTP not configured — emails will be logged to console only.');
}

async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    logger.info('[emailService] sendEmail (logged):', { to, subject, text });
    return;
  }
  const info = await transporter.sendMail({
    from: config.smtp.user,
    to,
    subject,
    text,
    html,
  });
  logger.info('[emailService] Email sent', { messageId: info.messageId });
}

module.exports = {
  sendEmail,
};
