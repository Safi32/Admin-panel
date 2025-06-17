const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Simple public route to get all users
router.get('/', userController.getUsers);

module.exports = router; 