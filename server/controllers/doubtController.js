// controllers/doubtController.js
const Doubt = require('../models/Doubt');

exports.createDoubt = async (req, res) => {
  try {
    const { text, code } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text content is required' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const doubt = new Doubt({
      text,
      code,
      creator: {
        username: req.user.username,
        userId: req.user._id,
      }
    });
    await doubt.save();
    res.status(201).json({ message: 'Doubt created successfully', doubt });
  } catch (error) {
    console.error('Error creating doubt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyDoubts = async (req, res) => {
  try {
    const myDoubts = await Doubt.find({ 'creator.userId': req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myDoubts);
  } catch (error) {
    console.error('Error fetching my doubts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const doubtId = req.params.id;
    const { text, code, parentReplyId } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const reply = {
      text,
      code,
      responder: {
        username: req.user.username,
        userId: req.user._id,
      },
      originalDoubtId: doubtId,
      parentReplyId: parentReplyId || null,
    };

    const updatedDoubt = await Doubt.findByIdAndUpdate(
      doubtId,
      { $push: { replies: reply } },
      { new: true }
    );
    res.status(201).json({ message: 'Reply added successfully', doubt: updatedDoubt });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing doubt
exports.updateDoubt = async (req, res) => {
  try {
    const doubtId = req.params.id;
    const { text, code } = req.body;
    // Find the doubt first
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    // Check if the authenticated user is the creator
    if (doubt.creator.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this doubt' });
    }
    // Update fields
    doubt.text = text || doubt.text;
    doubt.code = code || doubt.code;
    await doubt.save();
    res.status(200).json({ message: 'Doubt updated successfully', doubt });
  } catch (error) {
    console.error('Error updating doubt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an existing doubt
// controllers/doubtController.js

exports.deleteDoubt = async (req, res) => {
  try {
    const doubtId = req.params.id;
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    // Only allow deletion if user is the creator
    if (doubt.creator.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this doubt' });
    }
    await doubt.deleteOne(); // Use deleteOne() instead of remove()
    res.status(200).json({ message: 'Doubt deleted successfully' });
  } catch (error) {
    console.error('Error deleting doubt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/doubtController.js

exports.getDoubtByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find all doubts where the creator's username matches the provided username
    const doubts = await Doubt.find({ 'creator.username': username });
    
    if (!doubts || doubts.length === 0) {
      return res.status(404).json({ message: 'No doubts found for this user.' });
    }
    
    res.status(200).json(doubts);
  } catch (error) {
    console.error('Error fetching doubts by username:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

