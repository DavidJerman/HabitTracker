// routes/task.js

/**
 * @module Task
 * @description Task Router provides endpoints for creating, deleting, and updating tasks.
 */

const express = require('express');
const {verifyToken, handleError} = require('../utils');
const Task = require('../models/Task');
const router = express.Router();

/**
 * Validate task parameters
 * @param name - Task name
 * @param recurrence - Task recurrence
 * @param recurringDate - Task recurring date
 * @param dueDate - Task due date
 * @returns {{error: string, status: number}|null} - Validation error
 */
const validateTaskParams = (name, recurrence, recurringDate, dueDate) => {
    if (!name) return {status: 400, error: "Task name is required"};

    if (!recurrence || !['none', 'daily', 'weekly', 'monthly'].includes(recurrence)) {
        return {status: 400, error: "Task recurrence must be 'none', 'daily', 'weekly', or 'monthly'"};
    }

    if (recurrence !== 'none' && !recurringDate) return {status: 400, error: "Task recurring date is required"};

    if (recurrence === 'none' && !dueDate) return {
        status: 400,
        error: "Task due date is required when recurrence is none"
    };

    if (recurringDate && !/^\d{4}-\d{2}-\d{2}$/.test(recurringDate)) return {
        status: 400,
        error: "Invalid recurring date format"
    };

    return null;
};

/**
 * Update task completion
 * @param req - Request object
 * @param res - Response object
 * @param completed - Task completion status
 * @returns {Promise<*>} - Response
 */
const updateTaskCompletion = async (req, res, completed) => {
    const {token, taskId} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!taskId) return res.status(400).json({error: "Task ID is required"});

        const task = await Task.findOne({_id: taskId, userId: decoded.id});
        if (!task) return res.status(404).json({error: "Task not found"});

        task.completed = completed;
        await task.save();
        res.status(200).json({message: completed ? "Task completed" : "Task incomplete"});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Add task
 * @param {string} token - JWT token
 * @param {string} name - Task name
 * @param {string} description - Task description
 * @param {string} recurrence - Task recurrence (none, daily, weekly, monthly)
 * @param {string} recurringDate - Task recurring date (YYYY-MM-DD)
 * @param {string} dueDate - Task due date (YYYY-MM-DD)
 * @returns {object} - Message
 */
router.post('/add', async (req, res) => {
    const {token, name, description, recurrence, recurringDate, dueDate} = req.body;

    try {
        const decoded = verifyToken(token);

        const validationError = validateTaskParams(name, recurrence, recurringDate, dueDate);
        if (validationError) return res.status(validationError.status).json({error: validationError.error});
        
        const task = new Task({
            userId: decoded.id,
            name,
            description,
            recurrence,
            recurringDate,
            dueDate
        });

        await task.save();
        res.status(201).json({message: "Task added"});
    } catch (error) {
        handleError(res, error);
    }
});

/**
 * Set task as complete
 * @param {string} token - JWT token
 * @param {string} taskId - Task ID
 * @returns {object} - Message
 */
router.post('/complete', (req, res) => updateTaskCompletion(req, res, true));


/**
 * Set task as incomplete
 * @param {string} token - JWT token
 * @param {string} taskId - Task ID
 * @returns {object} - Message
 */
router.post('/incomplete', (req, res) => updateTaskCompletion(req, res, false));


/**
 * Update task
 * @param {string} token - JWT token
 * @param {string} taskId - Task ID
 * @param {string} name - Task name
 * @param {string} description - Task description
 * @param {string} recurrence - Task recurrence (none, daily, weekly, monthly)
 * @param {string} recurringDate - Task recurring date (YYYY-MM-DD)
 * @param {string} dueDate - Task due date (YYYY-MM-DD)
 * @returns {object} - Message
 */
router.post('/update', async (req, res) => {
    const {token, taskId, name, description, recurrence, recurringDate, dueDate} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!taskId) return res.status(400).json({error: "Task ID is required"});

        const task = await Task.findOne({_id: taskId, userId: decoded.id});
        if (!task) return res.status(404).json({error: "Task not found"});

        if (name) task.name = name;
        if (description) task.description = description;

        if (recurrence) {
            if (!['none', 'daily', 'weekly', 'monthly'].includes(recurrence)) {
                return res.status(400).json({error: "Task recurrence must be 'none', 'daily', 'weekly', or 'monthly'"});
            }
            task.recurrence = recurrence;
        }

        if (recurringDate) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(recurringDate)) {
                return res.status(400).json({error: "Invalid recurring date format"});
            }
            task.recurringDate = recurringDate;
        }

        if (dueDate) task.dueDate = dueDate;

        await task.save();
        res.status(200).json({message: "Task updated"});
    } catch (error) {
        handleError(res, error);
    }
});

/**
 * Delete task
 * @param {string} token - JWT token
 * @param {string} taskId - Task ID
 * @returns {object} - Message
 */
router.post('/delete', async (req, res) => {
    const {token, taskId} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!taskId) return res.status(400).json({error: "Task ID is required"});

        const task = await Task.findOne({_id: taskId, userId: decoded.id});
        if (!task) return res.status(404).json({error: "Task not found"});

        await task.delete();
        res.status(200).json({message: "Task deleted"});
    } catch (error) {
        handleError(res, error);
    }
});

/**
 * Get all tasks
 * @param {string} token - JWT token
 * @param {object} filter - Filter object:
 * @param {string} filter.name - Task name
 * @param {string} filter.description - Task description
 * @param {string} filter.recurrence - Task recurrence (none, daily, weekly, monthly)
 * @param {string} filter.status - Task completion status (true, false)
 * @param {string} filter.incomplete - Task in-completion status (true, false)
 * @param {string} filter.dueDateBefore - Task due date before (YYYY-MM-DD)
 * @param {string} filter.dueDateAfter - Task due date after (YYYY-MM-DD)
 * @returns {object} - Task object(s)
 */
router.post('/get', async (req, res) => {
    const {token, filter} = req.body;

    try {
        const decoded = verifyToken(token);

        const query = {userId: decoded.id};

        if (filter) {
            if (filter.name) query.name = filter.name;
            if (filter.description) query.description = filter.description;
            if (filter.recurrence) query.recurrence = filter.recurrence;
            if (filter.completed) query.completed = true;
            if (filter.incomplete) query.completed = false;
            if (filter.dueDateBefore) query.dueDate = {$lt: filter.dueDateBefore};
            if (filter.dueDateAfter) query.dueDate = {$gt: filter.dueDateAfter};
        }

        const tasks = await Task.find(query).limit(100);
        res.status(200).json({tasks});
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;
