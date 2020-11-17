const mongoose = require('mongoose');

// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let threadSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: {
      type: String,
      required: [true, 'thread creator username']
  },
  type: {
      type: String,
      required: [true, 'type required'],
      enum: ['ONE_TO_ONE']
  },
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  participantIds: [],
  unreadCount: {
      type: Number,
      default: 0
  }
});

module.exports = mongoose.model('Thread', threadSchema);