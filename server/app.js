// app.js
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const PORT = process.env.CLIENT_PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('API is running'));
app.use('/auth', authRoutes);
app.use('/task', taskRoutes);

connectDB().then(() => console.log('Connected to MongoDB'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
