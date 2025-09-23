const mongoose = require('mongoose');

const SocialAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Yeh User model se link karega
        ref: 'User',
        required: true,
    },
    platform: {
        type: String, // Jaise, 'twitter', 'linkedin'
        required: true,
    },
    platformUserId: {
        type: String, // User ki Twitter ID
        required: true,
    },
    username: {
        type: String, // User ka Twitter handle (jaise, @username)
        required: true,
    },
    accessToken: {
        type: String, // Post karne ke liye zaroori key
        required: true,
    },
    refreshToken: {
        type: String, // Access token ko refresh karne ke liye key
    },
}, { timestamps: true });

const SocialAccount = mongoose.model('SocialAccount', SocialAccountSchema);

module.exports = SocialAccount;