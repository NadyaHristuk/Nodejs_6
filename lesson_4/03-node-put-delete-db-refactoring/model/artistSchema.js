const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
   
    name: {
       type: String,
       require: true
    },
    created: { 
        type: Date,
        default: Date.now
    }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;