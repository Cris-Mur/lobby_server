const mongoose = require('mongoose');

let updaterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    status: {
        type: Boolean,
        default: false,
    },
    service: {
        type: String,
        required: [true, 'please give me the service']
    }
});

module.exports = mongoose.model('updater', updaterSchema);
