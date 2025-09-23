const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController.js');

// Define the route for user registration
// When a POST request is made to '/api/auth/register', the registerUser function will be executed.
router.post('/register', registerUser);

module.exports = router;
