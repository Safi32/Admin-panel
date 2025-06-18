const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Simple public route to get all users
router.get('/', userController.getUsers);

// Route to get total referrals
router.get('/total-referrals', userController.getTotalReferrals);

module.exports = router; 