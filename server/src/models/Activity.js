// models/Activity.js

/**
 * @module Activity
 * @description Activity Schema represents a user's sports activity in the MongoDB database.
 */

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
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
    activityType: {
        type: String,
        enum: ['running', 'cycling', 'swimming', 'walking', 'hiking', 'yoga', 'weightlifting', 'other'],
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: false,
    },
    calories: {
        type: Number,
        required: false,
    },
    elevationGain: {
        type: Number,
        required: false,
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
