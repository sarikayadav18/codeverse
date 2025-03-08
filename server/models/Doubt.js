// models/Doubt.js
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  text: { type: String, required: true },
  code: { type: String, default: '' },
  responder: {
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  // originalDoubtId is the id of the doubt this reply belongs to
  originalDoubtId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Doubt' },
  // Optional: parentReplyId for nested replies (if replying to a reply)
  parentReplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
}, { timestamps: true });

const DoubtSchema = new mongoose.Schema({
  text: { type: String, required: true },
  code: { type: String, default: '' },
  creator: {
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  replies: [ReplySchema]
}, { timestamps: true });

module.exports = mongoose.model('Doubt', DoubtSchema);
