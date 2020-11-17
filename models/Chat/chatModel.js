const mongoose = require('mongoose');

// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let chatSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner_id: {
      type: String,
      required: [true, 'user id owner']
  },
  contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contacts'}],
  threads: [{type: mongoose.Schema.Types.ObjectId, ref: 'Threads'}],
});

module.exports = mongoose.model('Chat', chatSchema);