const User = require('../models/user.js');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // Get name, email, and password from the request body
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            // If user exists, send a 400 error
            return res.status(400).json({ message: 'User already exists' });
        }

        // TODO: Hash the password before saving (we will do this next)

        // Create a new user in the database
        const user = await User.create({
            name,
            email,
            password, // For now, we save the plain password
        });

        if (user) {
            // If user was created successfully
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "User registered successfully!"
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { registerUser };
