// routes/task.js

/**
 * @module Tasks
 * @description Task Router provides endpoints for creating, deleting, and updating tasks.
 */

const express = require('express');
const {verifyToken, handleError} = require('../utils');
const Task = require('../models/Task');
const router = express.Router();

/**
 * Validates task parameters
 *
 * @param {string} name - Task name
 * @param {string} recurrence - Task recurrence
 * @param {string} recurringDate - Task recurring date
 * @param {string} dueDate - Task due date
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
 * Updates task's completion status
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {boolean} completed - Task completion status
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.taskId - Task ID
 *
 * @returns {object} - Status message
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
 * Adds a task to the DB
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 *
 * @param {string} req.body.token - JWT token.
 * @param {string} req.body.name - Task name.
 * @param {string} req.body.description - Task description.
 * @param {string} req.body.recurrence - Task recurrence (none, daily, weekly, monthly).
 * @param {string} req.body.recurringDate - Task recurring date (YYYY-MM-DD).
 * @param {string} req.body.dueDate - Task due date (YYYY-MM-DD).
 *
 * @returns {object} - Status message
 */
async function addTask(req, res) {
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
}

/**
 * Updates a task
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.taskId - Task ID
 * @param {string} req.body.name - Task name
 * @param {string} req.body.description - Task description
 * @param {string} req.body.recurrence - Task recurrence (none, daily, weekly, monthly)
 * @param {string} req.body.recurringDate - Task recurring date (YYYY-MM-DD)
 * @param {string} req.body.dueDate - Task due date (YYYY-MM-DD)
 *
 * @returns {object} - Message
 */
async function updateTask(req, res) {
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
}

/**
 * Deletes a task
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 *
 * @param {string} req.body.token - JWT token
 * @param {string} req.body.taskId - Task ID
 *
 * @returns {object} - Message
 */
async function deleteTask(req, res) {
    const {token, taskId} = req.body;

    try {
        const decoded = verifyToken(token);

        if (!taskId) return res.status(400).json({error: "Task ID is required"});

        const task = await Task.findOne({_id: taskId, userId: decoded.id});
        if (!task) return res.status(404).json({error: "Task not found"});

        await task.deleteOne();
        res.status(200).json({message: "Task deleted"});
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Gets all tasks matching the filter
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 *
 * @param {string} req.body.token - JWT token
 * @param {object} req.body.filter - Filter object
 * @param {string} req.body.filter.name - Task name
 * @param {string} req.body.filter.description - Task description
 * @param {string} req.body.filter.recurrence - Task recurrence (none, daily, weekly, monthly)
 * @param {string} req.body.filter.status - Task completion status (true, false)
 * @param {string} req.body.filter.incomplete - Task in-completion status (true, false)
 * @param {string} req.body.filter.dueDateBefore - Task due date before (YYYY-MM-DD)
 * @param {string} req.body.filter.dueDateAfter - Task due date after (YYYY-MM-DD)
 *
 * @returns {object} - Task object(s)
 */
async function getTasks(req, res) {
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
}

router.post('/add', addTask);
router.post('/complete', (req, res) => updateTaskCompletion(req, res, true));
router.post('/incomplete', (req, res) => updateTaskCompletion(req, res, false));
router.post('/update', updateTask);
router.post('/delete', deleteTask);
router.post('/get', getTasks);

module.exports = router;
