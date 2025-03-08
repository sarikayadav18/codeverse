// routes/doubtRoutes.js
const express = require('express');

const router = express.Router();
const { createDoubt, getDoubts, getMyDoubts, addReply, updateDoubt, deleteDoubt,getDoubtByUsername } = require('../controllers/doubtController');
const protect = require('../middlewares/auth');

router.post('/', protect, createDoubt);
router.get('/', getDoubts);
router.get('/my', protect, getMyDoubts);
router.post('/:id/reply', protect, addReply);
router.put('/:id', protect, updateDoubt);    // For updating a doubt
router.delete('/:id', protect, deleteDoubt);  // For deleting a doubt
router.get('/:username',getDoubtByUsername);

module.exports = router;
