const mongoose = require('mongoose');

const songShema = mongoose.Schema({
    name: {
        type: String,
        require: true
        },
    descr: String,
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    created: {
        type: Date,
        default: Date.now
    }
})

const Song = mongoose.model('Song', songShema);

module.exports = Song;