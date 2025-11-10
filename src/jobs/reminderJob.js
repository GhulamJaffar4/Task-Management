const cron = require('node-cron');
const config = require('../config');
const Task = require('../models/Task');
const User = require('../models/User');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const REMINDER_WINDOW_HOURS = Number(process.env.REMINDER_WINDOW_HOURS || 24);

function startReminderJob() {
  logger.info(`[ReminderJob] scheduled with cron: ${config.reminderCron} (window ${REMINDER_WINDOW_HOURS}h)`);

  const task = cron.schedule(config.reminderCron, async () => {
    try {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 60 * 60 * 1000);

      logger.info(`[ReminderJob] running at ${now.toISOString()} - searching tasks due before ${windowEnd.toISOString()}`);

      const upcomingTasks = await Task.find({
        dueDate: { $gte: now, $lte: windowEnd },
        notified: false,
      }).populate('assignedTo', 'name email').populate('createdBy', 'name email');

      logger.info(`[ReminderJob] found ${upcomingTasks.length} upcoming tasks`);

      for (const t of upcomingTasks) {
        try {
          const assignee = t.assignedTo;
          if (!assignee || !assignee.email) {
            logger.warn(`[ReminderJob] task ${t._id} has no assignee email - skipping`);
            continue;
          }

          const subject = `Reminder: Task "${t.title}" due ${t.dueDate.toISOString()}`;
          const text = `Hello ${assignee.name || ''},\n\nThis is a reminder that the task "${t.title}" assigned to you is due at ${t.dueDate.toISOString()}.\n\nRegards,\nTask Management System`;

          await emailService.sendEmail({ to: assignee.email, subject, text });

          t.notified = true;
          await t.save();

          logger.info(`[ReminderJob] notified ${assignee.email} for task ${t._id}`);
        } catch (err) {
          logger.error(`[ReminderJob] notify error for task ${t._id}`, err);
        }
      }
    } catch (err) {
      logger.error('[ReminderJob] Error running job:', err);
    }
  });

  task.start();

  return {
    stop: () => task.stop(),
  };
}

module.exports = startReminderJob;
