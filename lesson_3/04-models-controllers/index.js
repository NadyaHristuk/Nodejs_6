const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const db = require('./db');
const artistsController = require('./controllers/artists');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello API');
})

app.get('/artists', artistsController.all);

app.get('/artists/:id', artistsController.findById);

app.post('/artists', artistsController.create);

app.put('/artists/:id', artistsController.update);

app.delete('/artists/:id', artistsController.delete);

db.connect('mongodb://user:user123@ds241489.mlab.com:41489/test_base', function (err) {
  if (err) {
    return console.log(err);
  }
  app.listen(3012, function () {
    console.log('API app started');
  })
})
