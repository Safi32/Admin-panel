const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// This is a placeholder for a real notification service (e.g., Firebase Cloud Messaging)
const notificationService = {
    send: async (userId, title, message) => {
        console.log(`Sending notification to user ${userId}: '${title}' - '${message}'`);
        // In a real app, you would integrate with FCM, APN, etc.
        return Promise.resolve();
    },
    sendToAll: async (title, message) => {
        console.log(`Sending general notification to all users: '${title}' - '${message}'`);
        return Promise.resolve();
    }
};

// Send a notification to all users
exports.sendGeneralNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        // Log the notification
        const notification = new Notification({
            title,
            message,
            type: 'general'
        });
        await notification.save();

        // Simulate sending to all users
        await notificationService.sendToAll(title, message);

        res.status(200).json({ success: true, message: 'General notification sent successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send general notification', error: error.message });
    }
};

// Send a notification to top users (e.g., top 10 by points)
exports.sendTopUsersNotification = async (req, res) => {
    try {
        const { title, message, limit = 10 } = req.body;

        // Find top users
        const topUsers = await User.find().sort({ points: -1 }).limit(limit);

        if (topUsers.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found to notify.' });
        }

        // Send and log notifications for each top user
        const notificationPromises = topUsers.map(user => {
            const notification = new Notification({
                title,
                message,
                type: 'top-users',
                recipient: user._id
            });
            return Promise.all([
                notification.save(),
                notificationService.send(user._id, title, message)
            ]);
        });

        await Promise.all(notificationPromises);

        res.status(200).json({ success: true, message: `Notification sent to top ${topUsers.length} users.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send notification to top users', error: error.message });
    }
};

// Send a notification to a single user
exports.sendSingleUserNotification = async (req, res) => {
    try {
        const { title, message, firebaseUid } = req.body;

        // Find the user by their Firebase UID
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Log the notification
        const notification = new Notification({
            title,
            message,
            type: 'single-user',
            recipient: user._id
        });
        await notification.save();

        // Simulate sending to the user
        await notificationService.send(user._id, title, message);

        res.status(200).json({ success: true, message: 'Notification sent to the user successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send notification to the user', error: error.message });
    }
}; 