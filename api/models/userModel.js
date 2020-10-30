const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a valid Role',
};

let userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  avatar: {
    type: String,
    default: '/static/images/avatars/avatar_2.png'
  },
  bio: {
    type: String,
    required: [true, 'Tell us who you are'],
  },
  eventPlanner: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
    required: [true, 'country required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'set your username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'ups, you need a password'],
  },
  firstName: {
    type: String,
    required: [true, 'name is required'],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  birthday: {
    // YYYY-MM-DD
    type: Date,
    required: [true, 'birthday required'],
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles,
  },
  state: {
    type: String,
    required: [true, 'state is required'],
  },
  timezone: {
    type: String,
    required: "lolito",
  },
  status: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model('User', userSchema);
