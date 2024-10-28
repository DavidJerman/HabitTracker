// db.js

/**
 * @module db
 * @description Connects to the MongoDB database using Mongoose.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
