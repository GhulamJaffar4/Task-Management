const Task = require('../models/Task');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Create task
 */
async function createTask(req, res, next) {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

    const task = new Task({
      title,
      description,
      assignedTo: assignee._id,
      priority: priority || Task.PRIORITY.MEDIUM,
      dueDate: new Date(dueDate),
      createdBy: req.user._id,
    });

    await task.save();
    logger.info('Task created', { taskId: task._id, createdBy: req.user._id, assignedTo: assignedTo });
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    logger.error('Error creating task', err);
    next(err);
  }
}

/**
 * List tasks
 */
async function listTasks(req, res, next) {
  try {
    const role = req.user.role;
    let query = {};
    if (role === User.ROLES.ADMIN) query = {};
    else if (role === User.ROLES.MANAGER) query = { $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] };
    else query = { assignedTo: req.user._id };

    const tasks = await Task.find(query).populate('assignedTo', 'name email role').populate('createdBy', 'name email');
    logger.info('Tasks listed', { userId: req.user._id, role, count: tasks.length });
    res.json({ tasks });
  } catch (err) {
    logger.error('Error listing tasks', err);
    next(err);
  }
}

/**
 * Get single task
 */
async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('assignedTo', 'name email role').populate('createdBy', 'name email role');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const role = req.user.role;
    if (role === User.ROLES.ADMIN) { logger.info('Task retrieved by Admin', { taskId: id }); return res.json({ task }); }

    if (role === User.ROLES.MANAGER) {
      const isCreator = task.createdBy && String(task.createdBy._id) === String(req.user._id);
      const isAssignee = task.assignedTo && String(task.assignedTo._id) === String(req.user._id);
      if (!isCreator && !isAssignee) return res.status(403).json({ message: 'Forbidden' });
      logger.info('Task retrieved by Manager', { taskId: id, userId: req.user._id });
      return res.json({ task });
    }

    if (role === User.ROLES.USER && String(task.assignedTo._id) === String(req.user._id)) {
      logger.info('Task retrieved by User', { taskId: id, userId: req.user._id });
      return res.json({ task });
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    logger.error('Error fetching task', err);
    next(err);
  }
}

/**
 * Update task
 */
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const role = req.user.role;

    if (role === User.ROLES.ADMIN) {
      Object.assign(task, updates);
      await task.save();
      logger.info('Task updated by Admin', { taskId: id });
      return res.json({ message: 'Task updated', task });
    }

    if (role === User.ROLES.MANAGER) {
      if (String(task.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
      Object.assign(task, updates);
      await task.save();
      logger.info('Task updated by Manager', { taskId: id, userId: req.user._id });
      return res.json({ message: 'Task updated', task });
    }

    if (role === User.ROLES.USER) {
      if (!('status' in updates)) return res.status(403).json({ message: 'Users can only update status' });
      if (String(task.assignedTo) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
      task.status = updates.status;
      await task.save();
      logger.info('Task status updated by User', { taskId: id, userId: req.user._id, status: updates.status });
      return res.json({ message: 'Task status updated', task });
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    logger.error('Error updating task', err);
    next(err);
  }
}

/**
 * Delete task
 */
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const role = req.user.role;
    if (role === User.ROLES.ADMIN || (role === User.ROLES.MANAGER && String(task.createdBy) === String(req.user._id))) {
      await task.remove();
      logger.info('Task deleted', { taskId: id, deletedBy: req.user._id });
      return res.json({ message: 'Task deleted' });
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    logger.error('Error deleting task', err);
    next(err);
  }
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };
