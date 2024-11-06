// models/Meal.js

/**
 * @module Meal
 * @description Meal Schema represents a user's meal in the MongoDB database.
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} Meal
 *
 * @property {string} userId - The ID of the user associated with the meal.
 * @property {string} name - The name of the meal (required).
 * @property {string} [notes] - A brief note about the meal.
 * @property {Date} dateAdded - The date when the meal was added (default: current date).
 * @property {('breakfast'|'lunch'|'dinner'|'snack'|'other')} mealType - The type of meal.
 */

/**
 * Task Schema for Mongoose.
 *
 * @type {mongoose.Schema<Meal>}
 */
const MealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
        required: true,
    },
    ingredients: [{
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }]
});

module.exports = mongoose.model('Meal', MealSchema);
