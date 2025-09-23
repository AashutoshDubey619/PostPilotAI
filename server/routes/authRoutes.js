const express = require('express');
const router = express.Router();
// Yahan loginUser ko bhi import kiya
const { registerUser, loginUser } = require('../controllers/authController.js');

// POST /api/auth/register (Yeh pehle se tha)
router.post('/register', registerUser);

// --- LOGIN KE LIYE NAYA ROUTE ---
// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;

