// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

/**
 * POST /api/tasks - create task - Admin/Manager
 */
const createTaskValidator = [
  body('title').isString().isLength({ min: 1 }).withMessage('title required'),
  body('assignedTo').isMongoId().withMessage('assignedTo must be a user id'),
  body('dueDate').isISO8601().toDate().withMessage('dueDate required ISO8601'),
];

const updateTaskValidator = [
  // allow optional fields; if present validate
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('assignedTo').optional().isMongoId(),
  body('status').optional().isString(),
  body('priority').optional().isString(),
  body('dueDate').optional().isISO8601().toDate(),
];

router.use(authenticate);

// Create task
router.post('/', authorize('Admin', 'Manager'), createTaskValidator, validateRequest, createTask);

// List tasks (visible to the user based on role)
router.get('/', listTasks);

// Get a task
router.get('/:id', getTask);

// Update task
router.patch('/:id', updateTaskValidator, validateRequest, updateTask);

// Delete
router.delete('/:id', authorize('Admin', 'Manager'), deleteTask);

module.exports = router;
