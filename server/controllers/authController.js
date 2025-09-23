const User = require('../models/user.js');
const bcrypt = require('bcryptjs'); // Password hashing ke liye
const jwt = require('jsonwebtoken'); // Token banane ke liye

// Register User (Yeh function pehle se tha, ab isme password hashing hai)
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // --- IMPORTANT: Password ko save karne se pehle hash karna ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Database me hashed password save hoga
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "User registered successfully!"
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- LOGIN USER KA NAYA FUNCTION ---
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: User ko email se database me dhoondho
        const user = await User.findOne({ email });

        // Step 2: Agar user milta hai AUR password match hota hai
        if (user && (await bcrypt.compare(password, user.password))) {
            // Step 3: Ek naya token generate karo
            const token = jwt.sign(
                { id: user._id }, // Token me user ki ID save kar rahe hain
                process.env.JWT_SECRET, // Hamari secret key jo .env file me hai
                { expiresIn: '30d' } // Token 30 din me expire hoga
            );

            // Step 4: User ki details aur naya token wapas bhejo
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            // Agar user nahi milta ya password galat hai
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { registerUser, loginUser }; // Yahan loginUser ko bhi export kiya

