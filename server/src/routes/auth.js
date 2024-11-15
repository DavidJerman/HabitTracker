// routes/auth.js

/**
 * @module Auth
 * @description Auth Router provides endpoints for user registration and login.
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

/**
 * Registers a new user if the username and email are unique.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 *
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.password - The password of the user
 * @param {string} req.body.email - The email of the user
 *
 * @returns {object} - The response object
 */
async function register(req, res) {
    const {username, password, email} = req.body;
    console.log('Registering user:', username);

    const date = Date.now();

    try {
        let user = await User.findOne({username});
        if (user) return res.status(400).json({error: "User already exists"});

        user = await User.findOne({email});
        if (user) return res.status(400).json({error: "Email already exists"});

        if (!username || !password || !email) return res.status(400).json({error: "Missing required user information"});

        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            email,
            date
        });

        await user.save();
        res.status(201).json({message: "User registered"});
    } catch (error) {
        res.status(400).json({error: "Registration failed"});
    }
}

/**
 * Logs in a user if the username and password are valid.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 *
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.password - The password of the user
 *
 * @returns {object} - The response object
 */
async function login(req, res) {
    const {username, password} = req.body;
    console.log('Logging in user:', username);

    try {
        if (!username || !password) return res.status(400).json({error: "Missing required user information"});

        const user = await User.findOne({username});
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.json({token});
        } else {
            res.status(401).json({error: "Invalid credentials"});
        }
    } catch (error) {
        res.status(400).json({error: "Login failed"});
    }
}

router.post('/register', register);
router.post('/login', login);

module.exports = router;
