
// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const protect = require('../middlewares/auth');

// Signup and Login endpoints
router.post('/signup', signup);
router.post('/login', login);

// Protected Profile endpoint
router.get('/profile', protect, getProfile);

module.exports = router;

