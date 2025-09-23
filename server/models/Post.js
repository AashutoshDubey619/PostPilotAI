const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Yeh User model se link karega
        ref: 'User',
        required: true,
    },
    platform: {
        type: String, // Jaise, 'twitter'
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'posted', 'failed'],
        default: 'draft',
    },
    scheduledAt: {
        type: Date, // Post karne ka time
    },
    postedAt: {
        type: Date, // Asli me post hone ka time
    },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
