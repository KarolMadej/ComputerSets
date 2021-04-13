var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        required: true
    }
    
});

var User = mongoose.model('user', UserSchema);
module.exports = User;


