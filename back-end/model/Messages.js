var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/universitychat");

autoIncrement.initialize(connection);

var MessagesSchema = mongoose.Schema({
    content: { type: String },
    media: { type: String },
    writer: { type: String, require: true },
    audiencer: { type: String, require: true },
    isReaded: { type: Boolean, require: true, default: false },

    created_at: Date,
    updated_at: Date
});

MessagesSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

MessagesSchema.plugin(autoIncrement.plugin, {
    model: 'Messages',
    field: 'mID',
    startAt: 1000000,
    incrementBy: 1
});

var Messages = mongoose.model('Messages', MessagesSchema);

module.exports = Messages;
