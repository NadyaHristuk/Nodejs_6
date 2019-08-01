const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const app = express();
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
  res.send('Hello API');
})

app.get('/artists', function (req, res) {
  db.collection('artists').find().toArray(function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
})

app.get('/artists/:id', function (req, res) {
  db.collection('artists').findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(doc);
  })
})



app.post('/artists', function (req, res) {
  const artist = {
    name: req.body.name
  };

  db.collection('artists').insert(artist, function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(artist);
  })
})




MongoClient.connect('mongodb://user:user123@ds241489.mlab.com:41489/test_base', function (err, database) {
  if (err) {
    return console.log(err);
  }
  db = database;
  app.listen(3012, function () {
    console.log('API app started');
  })
})

