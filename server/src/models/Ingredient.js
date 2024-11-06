// models/Ingredient.js

/**
 * @module Ingredient
 * @description Ingredient Schema represents an ingredient in the MongoDB database.
 **/

const mongoose = require('mongoose');

/**
 * @typedef {object} Ingredient
 *
 * @property {string} name - The name of the ingredient (required).
 * @property {Date} dateAdded - The date when the ingredient was added (default: current date).
 * @property {Object} nutritionalValue - The average nutritional value of the ingredient.
 * @property {Number} nutritionalValue.calories - The calories in the ingredient
 * @property {Number} nutritionalValue.carbohydrates - The amount of carbohydrates in grams
 * @property {Number} nutritionalValue.proteins - The amount of proteins in grams
 * @property {Object} nutritionalValue.fats - The amount of fats in grams
 * @property {Number} nutritionalValue.fats.saturated - The amount of saturated fats in grams
 * @property {Number} nutritionalValue.fats.unsaturated - The amount of unsaturated fats in grams
 */

/**
 * Ingredient Schema for Mongoose.
 *
 * @type {mongoose.Schema<Ingredient>}
 */

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
        required: true,
    },
    nutritionalValue: {
        calories:{
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        proteins: {
            type: Number,
            required: true
        },
        fats: {
            saturated: {
                type: Number,
                required: true
            },
            unsaturated: {
                type: Number,
                required: true
            }
        }
    }
})


module.exports = mongoose.model('Ingredient', IngredientSchema);