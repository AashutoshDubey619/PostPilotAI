require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);

// --- Basic Test Route ---
app.get('/', (req, res) => {
    res.send('Hello from Humanity Hackathon Backend!');
});

const PORT = process.env.PORT || 5001;

// --- Connect to MongoDB and Start Server ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed!');
    console.error(error.message);
    process.exit(1);
  });