// models/User.js

/**
 * @module User
 * @description User Schema represents a user in the MongoDB database.
 **/

const mongoose = require('mongoose');

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
