const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');

const {
    generateAuthLink: generateTwitterLink,
    handleCallback: handleTwitterCallback
} = require('../controllers/twitterController');

const {
    generateAuthLink: generateLinkedInLink,
    handleCallback: handleLinkedInCallback
} = require('../controllers/linkedinController.js');

router.get('/twitter', protect, generateTwitterLink);
router.get('/twitter/callback', handleTwitterCallback);

router.get('/linkedin', protect, generateLinkedInLink);
router.get('/linkedin/callback', handleLinkedInCallback);

module.exports = router;

