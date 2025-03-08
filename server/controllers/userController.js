// controllers/userController.js
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });
    
    // Check if already following
    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
    await targetUser.save();
    await currentUser.save();
    res.status(200).json({ message: 'User followed successfully', user: targetUser });
  } catch (error) {
    console.error("Error following user", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });
    
    // Check if not following
    if (!targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }
    
    targetUser.followers = targetUser.followers.filter(
      (followerId) => followerId.toString() !== currentUserId.toString()
    );
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== targetUserId.toString()
    );
    await targetUser.save();
    await currentUser.save();
    res.status(200).json({ message: 'User unfollowed successfully', user: targetUser });
  } catch (error) {
    console.error("Error unfollowing user", error);
    res.status(500).json({ message: 'Server error' });
  }
};
