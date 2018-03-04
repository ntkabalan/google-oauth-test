const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    googleID: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('users', UserSchema);