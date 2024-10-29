// utils.js

/**
 * @module Utils
 * @description Utility functions for the application.
 */
const jwt = require('jsonwebtoken');

/**
 * Verify JWT token
 *
 * @param token - JWT token
 *
 * @returns {object} - Decoded token
 */
const verifyToken = (token) => {
    if (!token) {
        throw {status: 401, error: "Unauthorized or missing token"};
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw {status: 401, error: "Unauthorized"};  // Handle specific JWT errors if needed
    }
};

/**
 * Handle error
 *
 * @param res - Response object
 * @param error - Error object
 *
 * @returns {object} - Error response
 */
const handleError = (res, error) => {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: "Unauthorized"});
    } else {
        console.error("An error occurred:", error);
        return res.status(error.status || 400).json({error: error.error || "An error occurred"});
    }
};

module.exports = { verifyToken, handleError };
