require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Routes Files ---
const authRoutes = require('./routes/authRoutes.js');
const connectRoutes = require('./routes/connectRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
// --- Nayi Service Import Ki ---
const { startScheduler } = require('./services/scheduler.js'); // <-- ADD THIS LINE

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/post', postRoutes);

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
    // --- "Time Machine" Ko Chalu Kiya ---
    startScheduler(); // <-- ADD THIS LINE
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed!');
    console.error(error.message);
    process.exit(1);
  });