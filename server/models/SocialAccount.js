const mongoose = require('mongoose');

const SocialAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    platformUserId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

const SocialAccount = mongoose.model('SocialAccount', SocialAccountSchema);

module.exports = SocialAccount;