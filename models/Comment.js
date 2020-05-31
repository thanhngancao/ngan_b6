const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const comment = mongoose.model('comment', CommentSchema);

module.exports = comment;