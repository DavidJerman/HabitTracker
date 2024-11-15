// models/Task.js

/**
 * @module Task
 * @description Task Schema represents a task in the MongoDB database.
 **/

const mongoose = require('mongoose');

/**
 * @typedef {object} Task
 *
 * @property {string} userId - The ID of the user associated with the task.
 * @property {string} name - The name of the task (required).
 * @property {string} [description] - A brief description of the task.
 * @property {Date} dateAdded - The date when the task was added (default: current date, required).
 * @property {('none'|'daily'|'weekly'|'monthly')} recurrence - The recurrence pattern of the task (default: 'none', required).
 * @property {Date} [recurringDate] - The date for recurring tasks.
 * @property {Date} [dueDate] - The due date for the task.
 * @property {boolean} completed - Indicates whether the task has been completed (default: false).
 * @property {Date} [completedDate] - The date when the task was completed.
 */

/**
 * Task Schema for Mongoose.
 *
 * @type {mongoose.Schema<Task>}
 */
const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
        required: true,
    },
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none',
        required: true,
    },
    recurringDate: {
        type: Date,
        required: false,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date,
        required: false,
    }
});

module.exports = mongoose.model('Task', TaskSchema);
