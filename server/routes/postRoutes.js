const express = require('express');
const router = express.Router();
// postImageToTwitter ko import kiya
const { postToTwitter, schedulePost, getPosts, postImageToTwitter } = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/twitter', protect, postToTwitter);
router.post('/schedule', protect, schedulePost);
router.get('/all', protect, getPosts);

// Image post karne ke liye naya route
// POST /api/post/twitter-image
router.post('/twitter-image', protect, postImageToTwitter);

module.exports = router;
