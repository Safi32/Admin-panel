const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

// Send a general notification to all users
router.post('/general', notificationController.sendGeneralNotification);

// Send a notification to top users
router.post('/top-users', notificationController.sendTopUsersNotification);

// Send a notification to a single user
router.post('/single-user', notificationController.sendSingleUserNotification);

module.exports = router; 