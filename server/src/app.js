// app.js

/**
 * @module App
 * @description Entry point for the Express application.
 */

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const activityRoutes = require('./routes/activities');
const nutritionRoutes = require('./routes/nutrition');
const PORT = process.env.CLIENT_PORT || 5000;

const app = express();
app.use(express.json());

//port v env?
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.get('/', (req, res) => res.send('API is running'));
app.use('/auth', authRoutes);
app.use('/task', taskRoutes);
app.use('/activity', activityRoutes);
app.use('/nutrition', nutritionRoutes);

connectDB()
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
