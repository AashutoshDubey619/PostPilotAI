const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Humara security guard

// POST /api/ai/generate
// Yeh route protected hai, yaani sirf logged-in user hi ise istemal kar sakte hain
router.post('/generate', protect, generateContent);

module.exports = router;
