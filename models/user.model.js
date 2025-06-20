const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    inviteCode: {
        type: String,
        default: null
    },
    referredBy: {
        type: String,
        default: null
    },
    recentAmount: {
        type: Number,
        default: 0
    },
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'user'
    },
    balance: {
        type: Number,
        default: 0
    },
    walletAddresses: {
        type: Object,
        default: {}
    },
    deviceId: {
        type: String,
        default: null
    },
    lastSignInDevice: {
        type: String,
        default: null
    },
    isSignedIn: {
        type: Boolean,
        default: false
    },
    lastSignInAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sessions: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User; 