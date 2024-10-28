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
    },
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly']
    },
    recurringDate: {
        type: Date,
        required: false,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ['Not Completed', 'Completed'],
        default: 'Not Completed',
    },
    completedDate: {
        type: Date,
        required: false,
    }
});

module.exports = mongoose.model('Task', TaskSchema);
