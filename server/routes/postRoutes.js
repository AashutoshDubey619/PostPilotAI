const express = require('express');
const router = express.Router();
// Controller se saare zaroori functions import kiye
const { 
    postToTwitter, 
    schedulePost, 
    getPosts, 
    postImageToTwitter,
    postToLinkedIn // LinkedIn wala naya function
} = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Security guard

// --- Twitter Routes ---
router.post('/twitter', protect, postToTwitter);
router.post('/twitter-image', protect, postImageToTwitter);

// --- LinkedIn Route ---
router.post('/linkedin', protect, postToLinkedIn);

// --- General Routes ---
router.post('/schedule', protect, schedulePost);
router.get('/all', protect, getPosts);

module.exports = router;