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
    const {token, name, description, dateAdded, mealType, ingredients} = req.body;

    try{
        const decoded = verifyToken(token);
        const date = dateAdded || Date.now();

        //TODO
        const validationError = validateMealParams();
        if (validationError) return res.status(validationError.status).json({error: validationError.error});

        const meal = new Meal({
            userId: decoded.id,
            name,
            description,
            dateAdded: date, 
            mealType: mealType.toLowerCase(),
            ingredients
        })

        await meal.save();
        res.status(201).json({message: "Meal added successfully"})

    } catch (error) {
        console.error("Error in addMeal:", error);
        handleError(res, error);
    }
}

async function deleteMeal(req, res) {
    const { token, mealId } = req.body;

    try {
        const decoded = verifyToken(token);

        if (!mealId) return res.status(400).json({ error: "Meal ID is required" });

        const meal = await Meal.findOne({ _id: mealId, userId: decoded.id });
        if (!meal) return res.status(404).json({ error: "Meal not found" });

        await Meal.deleteOne({ _id: mealId, userId: decoded.id }); 
        res.status(200).json({ message: "Meal deleted successfully" });
    } catch (error) {
        console.error("Error in deleteMeal:", error);
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

async function getMeals(req, res) {
    const { token } = req.body; 

    try {
        const decoded = verifyToken(token);

        const meals = await Meal.find({ userId: decoded.id });
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error in getMeals:", error);
        handleError(res, error);
    }
}







router.post('/addMeal', addMeal);
router.post('/ingredients', getIngredients);
// router.post('/update', updateMeal);
router.post('/delete', deleteMeal);
router.post('/meals', getMeals);





module.exports = router;

