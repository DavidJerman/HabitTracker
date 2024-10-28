// models/Meal.js

/**
 * @module Meal
 * @description Meal Schema represents a user's meal in the MongoDB database.
 * TODO: Add properties to the Meal Schema
 */

const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
});

module.exports = mongoose.model('Meal', MealSchema);
