const express = require('express');
const router = express.Router();
// Hum ab controller se dono functions import kar rahe hain
const { postToTwitter, schedulePost } = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Security guard

// "Post Now" ke liye (yeh pehle se tha)
// POST /api/post/twitter
router.post('/twitter', protect, postToTwitter);

// Post ko schedule karne ke liye naya route
// POST /api/post/schedule
router.post('/schedule', protect, schedulePost);

module.exports = router;

