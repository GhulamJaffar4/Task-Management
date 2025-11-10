// src/models/Task.js
const mongoose = require('mongoose');

const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(STATUS), default: STATUS.TODO },
    priority: { type: String, enum: Object.values(PRIORITY), default: PRIORITY.MEDIUM },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notified: { type: Boolean, default: false }, // used by reminder job
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

TaskSchema.statics.STATUS = STATUS;
TaskSchema.statics.PRIORITY = PRIORITY;

module.exports = mongoose.model('Task', TaskSchema);
