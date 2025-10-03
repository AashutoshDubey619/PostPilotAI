const express = require('express');
const router = express.Router();
const {
    postToTwitter,
    schedulePost,
    getPosts,
    postImageToTwitter,
    postToLinkedIn
} = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/twitter', protect, postToTwitter);
router.post('/twitter-image', protect, postImageToTwitter);

router.post('/linkedin', protect, postToLinkedIn);

router.post('/schedule', protect, schedulePost);
router.get('/all', protect, getPosts);

module.exports = router;