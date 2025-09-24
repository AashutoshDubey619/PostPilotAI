const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');

// Twitter ke functions ko alag se import karna
const { 
    generateAuthLink: generateTwitterLink, 
    handleCallback: handleTwitterCallback 
} = require('../controllers/twitterController');

// LinkedIn ke functions ko alag se import karna
const { 
    generateAuthLink: generateLinkedInLink, 
    handleCallback: handleLinkedInCallback 
} = require('../controllers/LinkedinController.js');

// --- Twitter Routes ---
// GET /api/connect/twitter
router.get('/twitter', protect, generateTwitterLink);
// GET /api/connect/twitter/callback
router.get('/twitter/callback', handleTwitterCallback);

// --- LinkedIn Routes ---
// GET /api/connect/linkedin
router.get('/linkedin', protect, generateLinkedInLink);
// GET /api/connect/linkedin/callback
router.get('/linkedin/callback', handleLinkedInCallback);

module.exports = router;

