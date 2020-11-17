const mongoose = require('mongoose');

let validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a valid Role',
};

let agendaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  start_day: {
    type: Date,
    required: [true, 'Add agenda page need start day D:'],
    unique: true,
  },
  end_day: {
    type: Date,
    required: [true, 'Add agenda page need end day D:'],
    unique: true,
  },
  monday: {
    type: [],
    default: [null]
  },
  tuesday: {
    type: [],
    default: [null]
  },
  wednesday: {
    type: [],
    default: [null]
  },
  thursday: {
    type: [],
    default: [null]
  },
  friday: {
    type: [],
    default: [null]
  },
  saturday: {
    type: [],
    default: [null]
  },
  sunday: {
    type: [],
    default: [null]
  },
});

module.exports = mongoose.model('Agenda', agendaSchema);
