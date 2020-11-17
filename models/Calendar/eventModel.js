const moment = require('moment');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Calendar = require('./calendarModel');

let eventSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    limit: {
        type: Number,
        default: -1,
    },
    color: {
        type: String,
        default: '#FF0000',
    },
    description: {
        type: String,
        default: 'LOG',
    },
    start: {
        type: Number,
        default: 666,
    },
    end: {
        type: Number,
        default: 666,
    },
    title: {
        type: String,
        default: 'User',
    },
    suscriptors: {
        type: Object,
        default: {},
    },
});
eventSchema.pre('remove', function (next) {
    Calendar.update(
        { $pull: { events: this._id } },
        // { multi: true }
    ).exec(next)
});
module.exports = mongoose.model('Eventmock', eventSchema);