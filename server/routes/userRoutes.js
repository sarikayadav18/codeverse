// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const protect = require('../middlewares/auth');

router.get('/:id', protect, getUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
