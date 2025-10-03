const express = require('express');
const router = express.Router();
const { generateContent, generateImagePost, generateActualImage } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/generate', protect, generateContent);
router.post('/generate-image', protect, generateImagePost);

router.post('/generate-actual-image', protect, generateActualImage);

module.exports = router;