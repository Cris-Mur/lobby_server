const mongoose = require('mongoose');

// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  body: {
      type: String,
      required: [true, 'body message']
  },
  contentType: {
      type: String,
      required: [true, 'data type'],
      enum: ['text', 'image']
  },
  createdAt: {
      type: Number,
      required: [true, 'creation date']
  },
  senderId: {
      type: String,
      required: [true, 'sender id']
  }
});

module.exports = mongoose.model('Message', messageSchema);