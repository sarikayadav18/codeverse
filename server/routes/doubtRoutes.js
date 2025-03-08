// routes/doubtRoutes.js
const express = require('express');
const router = express.Router();
const { createDoubt, getDoubts, addReply } = require('../controllers/doubtController');
const protect = require('../middlewares/auth');

// Create a doubt (protected)
router.post('/', protect, createDoubt);

// Get all doubts (public)
router.get('/', getDoubts);

// Add a reply to a doubt (protected)
// The doubt id is passed as a URL parameter
router.post('/:id/reply', protect, addReply);

module.exports = router;
