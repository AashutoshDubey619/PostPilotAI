const express = require('express');
const router = express.Router();
// generateActualImage ko import kiya
const { generateContent, generateImagePost, generateActualImage } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/generate', protect, generateContent);
router.post('/generate-image', protect, generateImagePost);

// Asli image generate karne ke liye naya route
// POST /api/ai/generate-actual-image
router.post('/generate-actual-image', protect, generateActualImage);

module.exports = router;