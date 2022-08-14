const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [
            true,
            'Email is required'
        ],
        unique: [
            true,
            'Email already exists'
        ]
    },
    emailVerified: {
        type: Boolean,
        default: false,
        unique: false
    },
    hashedPassword: {
        type: String,
        required: [
            true,
            'Password is required'
        ],
        unique: false
    },
    websites: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPro: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);