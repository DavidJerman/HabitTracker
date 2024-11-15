// models/Activity.js

/**
 * @module Activity
 * @description Activity Schema represents a user's sports activity in the MongoDB database.
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} Activity
 *
 * @property {string} userId - The ID of the user associated with the activity.
 * @property {string} name - The name of the activity (required).
 * @property {string} [description] - A brief description of the activity.
 * @property {Date} dateAdded - The date when the activity was added (default: current date).
 * @property {('running'|'cycling'|'swimming'|'walking'|'hiking'|'yoga'|'weightlifting'|'other')} activityType - The type of activity.
 * @property {number} duration - The duration of the activity in minutes (required).
 * @property {number} [distance] - The distance covered during the activity in kilometers.
 * @property {number} [calories] - The calories burned during the activity.
 * @property {number} [elevationGain] - The elevation gain during the activity in meters.
 */

/**
 * Activity Schema for Mongoose.
 *
 * @type {mongoose.Schema<Activity>}
 */
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
