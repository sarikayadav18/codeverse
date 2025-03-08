const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user

    const user = await User.findOne({ email });
    console.log("I am user from backend", user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/authController.js


exports.getProfile = async (req, res) => {
  try {
    // req.user is set by your protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
     req.user.password = '';
     const user = req.user;
    // Return the user profile details (excluding sensitive fields)
    res.status(200).json({
     user
      // add other fields if needed
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ... existing code remains unchanged

exports.getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    // Find the user by username (case sensitive, adjust if needed)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     user.password = '';

    // Return only public profile details
    res.status(200).json({
      user// Include if intended as public information
      // Add other public fields if needed
    });
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

