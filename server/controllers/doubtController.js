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
