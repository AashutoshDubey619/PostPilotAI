const mongoose = require('mongoose');

// We created the schema with the name 'UserSchema' (Capital U, Capital S)
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    businessContext: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// So we must use the EXACT same name 'UserSchema' here
const User = mongoose.model('User', UserSchema);

module.exports = User;