// routes/activity.js

/**
 * @module Activities
 * @description Activity Router provides endpoints for creating, deleting and updating activities.
 */

const express = require('express');
const {verifyToken, handleError} = require('../utils');
const Activity = require('../models/Activity');
const router = express.Router();

/**
 * Validates activity parameters
 *
 * @param {string} name - Activity name
 * @param {string} activityType - Activity type
 * @param {string} duration - Activity duration
 * @param {string} distance - Activity distance
 * @param {string} calories - Calories burned
 * @param {string} elevationGain - Elevation gain
 * @param {string} dateAdded - Date added
 *
 * @returns {{error: string, status: number}|null} - Validation error
 */
const validateActivityParams = (name, activityType, duration, distance, calories, elevationGain, dateAdded) => {
    if (!name) return {status: 400, error: "Activity name is required"};
    if (!activityType || !['running', 'cycling', 'swimming', 'walking', 'hiking', 'yoga', 'weightlifting', 'other'].includes(activityType)) return {
        status: 400,
        error: "Activity type must be 'running', 'cycling', 'swimming', 'walking', 'hiking', 'yoga', 'weightlifting', or 'other'"
    };
    if (!duration) return {status: 400, error: "Activity duration is required"};
    if (isNaN(duration)) return {status: 400, error: "Invalid duration"};
    if (distance && isNaN(distance)) return {status: 400, error: "Invalid distance"};
    if (calories && isNaN(calories)) return {status: 400, error: "Invalid calories"};
    if (elevationGain && isNaN(elevationGain)) return {status: 400, error: "Invalid elevation gain"};
    if (dateAdded && !/^\d{4}-\d{2}-\d{2}$/.test(dateAdded)) return {status: 400, error: "Invalid date format"};
    if (['running', 'cycling', 'walking', 'hiking'].includes(activityType) && !distance) return {
        status: 400,
        error: "Distance is required for this activity type"
    };

    return null;
}

/**
 * Adds an activity to the DB
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.name - Activity name
 * @param {string} req.body.description - Activity description
 * @param {string} req.body.dateAdded - The date when activity was added (YYYY-MM-DD)
 * @param {string} req.body.activityType - Activity type string enum ('running', 'cycling', 'swimming', 'walking', 'hiking', 'yoga', 'weightlifting', 'other')
 * @param {string} req.body.duration - Activity duration [s]
 * @param {string} req.body.distance - Activity distance [km]
 * @param {string} req.body.calories - Calories burned [kcal]
 * @param {string} req.body.elevationGain - Activity elevation gain [m]
 *
 * @returns {object} - The response object
 */
async function addActivity(req, res) {
    const {token, name, description, dateAdded, activityType, duration, distance, calories, elevationGain} = req.body;

    try {
        const decoded = verifyToken(token);

        const validationError = validateActivityParams(name, activityType, duration, distance, calories, elevationGain, dateAdded);
        if (validationError) return res.status(validationError.status).json({error: validationError.error});

        const activity = new Activity({
            userId: decoded.id,
            name,
            description,
            dateAdded,
            activityType,
            duration,
            distance,
            calories,
            elevationGain
        });

        await activity.save();
        res.status(201).json({message: "Activity added successfully"});
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Updates an activity
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.activityId - Activity ID
 * @param {string} req.body.name - Activity name
 * @param {string} req.body.description - Activity description
 * @param {string} req.body.dateAdded - The date when activity was added (YYYY-MM-DD)
 * @param {string} req.body.activityType - Activity type string enum ('running', 'cycling', 'swimming', 'walking', 'hiking', 'yoga', 'weightlifting', 'other')
 * @param {string} req.body.duration - Activity duration [s]
 * @param {string} req.body.distance - Activity distance [km]
 * @param {string} req.body.calories - Calories burned [kcal]
 * @param {string} req.body.elevationGain - Activity elevation gain [m]
 *
 * @returns {object} - The response object
 */
async function updateActivity(req, res) {
    const {
        token,
        activityId,
        name,
        description,
        dateAdded,
        activityType,
        duration,
        distance,
        calories,
        elevationGain
    } = req.body;

    try {
        const decoded = verifyToken(token);

        const validationError = validateActivityParams(name, activityType, duration, distance, calories, elevationGain, dateAdded);
        if (validationError) return res.status(validationError.status).json({error: validationError.error});

        const activity = await Activity.findOne({_id: activityId, userId: decoded.id});
        if (!activity) return res.status(404).json({error: "Activity not found"});

        activity.name = name;
        activity.description = description;
        activity.dateAdded = dateAdded;
        activity.activityType = activityType;
        activity.duration = duration;
        activity.distance = distance;
        activity.calories = calories;
        activity.elevationGain = elevationGain;

        await activity.save();
        res.status(200).json({message: "Activity updated successfully"});
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Deletes an activity
 *
 * @param {string} req - The request object
 * @param {string} res - The response object
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.activityId - Activity ID
 *
 * @returns {object} - The response object
 */
async function deleteActivity(req, res) {
    const {token, activityId} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!activityId) return res.status(400).json({error: "Activity ID is required"});

        const activity = await Activity.findOne({_id: activityId, userId: decoded.id});
        if (!activity) return res.status(404).json({error: "Activity not found"});

        await activity.remove();
        res.status(200).json({message: "Activity deleted successfully"});
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Gets activities matching the filter
 *
 * @param {string} req - The request object
 * @param {string} res - The response object
 *
 * @param {string} req.body.token - JWT token
 * @param {object} req.body.filter - Filter object
 * @param {string} req.body.filter.name - Activity name
 * @param {string} req.body.filter.description - Activity description
 * @param {string} req.body.filter.activityType - Activity type
 * @param {string} req.body.filter.dateAdded - Activity date added
 * @param {string} req.body.filter.dateAddedAfter - Date added after
 * @param {string} req.body.filter.dateAddedBefore - Date added before
 * @param {string} req.body.filter.durationLessThan - Duration less than
 * @param {string} req.body.filter.durationGreaterThan - Duration greater than
 * @param {string} req.body.filter.distanceLessThan - Distance less than
 * @param {string} req.body.filter.distanceGreaterThan - Distance greater than
 * @param {string} req.body.filter.caloriesLessThan - Calories less than
 * @param {string} req.body.filter.caloriesGreaterThan - Calories greater than
 * @param {string} req.body.filter.elevationGainLessThan - Elevation gain less than
 * @param {string} req.body.filter.elevationGainGreaterThan - Elevation gain greater than
 *
 * @returns {object} - Activities
 */
async function getActivities(req, res) {
    const {token, filter} = req.body;

    try {
        const decoded = verifyToken(token);

        const query = {userId: decoded.id};

        if (filter) {
            if (filter.name) query.name = filter.name;
            if (filter.description) query.description = filter.description;
            if (filter.activityType) query.activityType = filter.activityType;
            if (filter.dateAdded) query.dateAdded = filter.dateAdded;
            if (filter.dateAddedAfter) query.dateAdded = {$gte: filter.dateAddedAfter};
            if (filter.dateAddedBefore) query.dateAdded = {$lte: filter.dateAddedBefore};
            if (filter.durationLessThan) query.duration = {$lt: filter.durationLessThan};
            if (filter.durationGreaterThan) query.duration = {$gt: filter.durationGreaterThan};
            if (filter.distanceLessThan) query.distance = {$lt: filter.distanceLessThan};
            if (filter.distanceGreaterThan) query.distance = {$gt: filter.distanceGreaterThan};
            if (filter.caloriesLessThan) query.calories = {$lt: filter.caloriesLessThan};
            if (filter.caloriesGreaterThan) query.calories = {$gt: filter.caloriesGreaterThan};
            if (filter.elevationGainLessThan) query.elevationGain = {$lt: filter.elevationGainLessThan};
            if (filter.elevationGainGreaterThan) query.elevationGain = {$gt: filter.elevationGainGreaterThan};
        }

        const activities = await Activity.find(query);
        res.status(200).json({activities});
    } catch (error) {
        handleError(res, error);
    }
}

// Routes
router.post('/add', addActivity);
router.post('/update', updateActivity);
router.post('/delete', deleteActivity);
router.post('/get', getActivities);

module.exports = router;
