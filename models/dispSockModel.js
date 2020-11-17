const mongoose = require('mongoose');

let validDays_name = {
  values: ['Orphan day',
  'monday', 'tuesday',
  'wednesday', 'thursday',
  'friday', 'saturday', 'sunday'],
  message: '{VALUE} is not a valid day name',
};

let socketSchema = new mongoose.Schema({
  //Subject
  _id: mongoose.Schema.Types.ObjectId,
  time: {
    type: Date,
    required: [true, 'Not posible action'],
    unique: true
  },
  suscribers: {
    type: [],
    default: []
  },
  limit: {
    type: Number,
    default: -1
  },
  day_name: {
    type: String,
    default: 'Orphan day',
    enum: validDays_name
  },
});

module.exports = mongoose.model('Socket', socketSchema);
