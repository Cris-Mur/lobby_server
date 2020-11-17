const mongoose = require('mongoose');

// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let calendarSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  draft: [],
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Eventmock'}],
});

module.exports = mongoose.model('Calendarmock', calendarSchema);
