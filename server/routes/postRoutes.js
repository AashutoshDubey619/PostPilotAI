const express = require('express');
const router = express.Router();
// getPosts ko yahan import kiya
const { postToTwitter, schedulePost, getPosts } = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js');

// "Post Now" ke liye
router.post('/twitter', protect, postToTwitter);

// Post ko schedule karne ke liye
router.post('/schedule', protect, schedulePost);

// Saare posts get karne ke liye naya route
// GET /api/post/all
router.get('/all', protect, getPosts);

module.exports = router;