// models/Task.js

/**
 * @module Task
 * @description Task Schema represents a task in the MongoDB database.
 **/

const mongoose = require('mongoose');

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
