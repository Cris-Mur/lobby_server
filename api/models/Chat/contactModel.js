const mongoose = require('mongoose');

// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let contactSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: [true, 'contact name']
  },
  username: {
    type: String,
    required: [true, 'contact username']
  }
});

module.exports = mongoose.model('Contact', contactSchema);