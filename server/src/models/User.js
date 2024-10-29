// models/User.js

/**
 * @module User
 * @description User Schema represents a user in the MongoDB database.
 **/

const mongoose = require('mongoose');

/**
 * @typedef {object} User
 *
 * @property {string} username - The user's unique username (required).
 * @property {string} password - The user's password (required).
 * @property {string} email - The user's unique email address (required).
 * @property {Date} createdAt - The date when the user account was created (default: current date).
 */

/**
 * User Schema for Mongoose.
 *
 * @type {mongoose.Schema<User>}
 */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);
