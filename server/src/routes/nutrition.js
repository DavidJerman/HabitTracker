// routes/nutrition.js

/**
 * @module Nutrition
 * @description Nutrition Router provides endpoints for creating, deleting, and updating nutrition entries.
 * TODO VSE
 */

const express = require('express');
const {verifyToken, handleError} = require('../utils');
const router = express.Router();
const Meal = require('../models/Meal');
const Ingredient = require('../models/Ingredient');


async function getNut(req, res){
    const {token, mealId} = req.body;

    try{
        const decoded = verifyToken(token);

        if (!mealId) return res.status(400).json({error: "Meal ID is required"});

        const meal = await Meal.findOne({_id: mealId, userId: decoded.id});
        if (!meal) return res.status(404).json({error: "Meal not found"});

        //TODO NUT JSON

    } catch (error) {
        handleError(error);
    }

}

const validateMealParams = () => {

}

async function addMeal(req, res){
    const {token, name, notes, dateAdded, mealType, ingredients} = req.body;

    try{
        const decoded = verifyToken(token);

        //TODO
        const validationError = validateMealParams();
        if (validationError) return res.status(validationError.status).json({error: validationError.error});

        const meal = new Meal({
            userId: decoded.id,
            name,
            notes,
            dateAdded,
            mealType,
            ingredients
        })

        await meal.save();
        res.status(201).json({message: "Meal added successfully"})

    } catch (error) {
        handleError(res, error);
    }
}

async function deleteMeal(req, res) {
    const {token, mealId} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!mealId) return res.status(400).json({error: "Meal ID is required"});

        const meal = await Meal.findOne({_id: mealId, userId: decoded.id});
        if (!meal) return res.status(404).json({error: "Meal not found"});

        await meal.remove();
        res.status(200).json({message: "Meal deleted successfully"});
    } catch (error) {
        handleError(res, error);
    }
}

async function getIngredients(req, res) {
    const {filter} = req.body;
    console.log("Getting ingredient");

    try {
        const query = {};
        
        if (filter) {
            if (filter.name) query.name = { $regex: `^${filter.name}`, $options: 'i' };
            //TODO
        }

        const ingredients = await Ingredient.find(query);
        res.status(200).json(ingredients);
    } catch (error) {
        handleError(res, error);
    }
}

async function addIngredient(req, res) {
    const {name, dateAdded, nutritionalValue} = req.body;

    try {

        const validationError = validateIngredientParams();
        if (validationError) return res.status(validationError.status).json({error: validationError.error});

        const ingredient = new Ingredient({
            name,
            dateAdded,
            nutritionalValue
        })

        await ingredient.save();
        res.status(201).json({message: "Ingredient added successfully"})

    } catch (error) {
        handleError(res, error);
    }
}






router.post('/addMeal', addMeal);
router.post('/ingredients', getIngredients);
// router.post('/update', updateMeal);
router.post('/delete', deleteMeal);
// router.post('/get', getMeals);
//Get ingredients
//Add ingredient
//Get NUT:id of meal




module.exports = router;

