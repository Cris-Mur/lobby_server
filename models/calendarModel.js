const moment = require('moment');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// let validRoles = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} is not a valid Role',
// };

let calendarSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    allDay: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#FF6F73',
    },
    description: {
        type: String,
        default: 'Hola buenas tardes',
    },
    end: {
        type: String,
        default: moment()
        .subtract(6, 'days')
        .hours(19)
        .minutes(0)
        .toDate()
        .getTime(),
    },
    start: {
        type: String,
        default: moment()
        .subtract(6, 'days')
        .hours(17)
        .minutes(30)
        .toDate()
        .getTime(),
    },
    title: {
        type: String,
        default: 'El mejor evento',
    },
});

module.exports = mongoose.model('calendarmock', calendarSchema);
