const express = require('express');
const router = express.Router();
// Hum ab naye controller aur middleware ko import kar rahe hain
const { generateAuthLink, handleCallback } = require('../controllers/twitterController');
const { protect } = require('../middleware/authMiddleware.js');

// Jab user "Connect to Twitter" par click karega,
// request pehle 'protect' middleware se guzregi
router.get('/twitter', protect, generateAuthLink);

// Callback route ko protect karne ki zaroorat nahi hai
router.get('/twitter/callback', handleCallback);

module.exports = router;

