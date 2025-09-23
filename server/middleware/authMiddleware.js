const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protect = async (req, res, next) => {
    let token;

    // 1. Pehle headers me token dhoondho (standard API calls ke liye)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Agar header me na mile, to URL ke query parameters me dhoondho (OAuth redirect ke liye)
    else if (req.query.token) {
        token = req.query.token;
    }

    // Agar token kahin bhi mil gaya
    if (token) {
        try {
            // 3. Token ko hamari secret key se verify karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 4. Token se user ki ID nikalo aur database me user ko dhoondho
            req.user = await User.findById(decoded.id).select('-password');
            // 5. Sab theek hai, agle step (controller) par jao
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // Agar token kahin bhi nahi mila
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };