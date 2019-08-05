const express = require('express');

const mongoose = require('mongoose');

const Song = require('./model/songSchema');
const Artist = require('./model/artistSchema');

mongoose.Promise = global.Promise;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://user:user123@ds241489.mlab.com:41489/test_base',  
{ useNewUrlParser: true }, function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');

   const artist = new Artist ({
     name: 'Ед Шеран'
   });

   artist.save(function(err){
     if (err) throw err;

     console.log('Artist was saved'); 
     
     const song = new Song({
       name: 'Shape of you',
       artist: artist._id
     });

     song.save( function(err){
       if (err) throw err;
       console.log('song was saved')
     })
    });
});

