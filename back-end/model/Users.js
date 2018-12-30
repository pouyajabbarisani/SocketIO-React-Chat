var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost/universitychat");


var UsersSchema = mongoose.Schema({
    password: { type: String, require: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: Date,
    username: { type: String, require: true, unique: true },
    nameAndFamily: { type: String, require: true },
    lastActivity: { type: String },
    profilePic: { type: String },

    created_at: Date,
    updated_at: Date,
});

UsersSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});


var Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
