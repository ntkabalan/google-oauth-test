const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },    
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        required: true
    },
    allowComments: {
        type: Boolean,
        default: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
});

module.exports = mongoose.model('stories', StorySchema);