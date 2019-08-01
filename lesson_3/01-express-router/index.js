const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let artist = [
    {
        id: 1,
        name: "Mazart"
    },
    {
        id: 2,
        name: "Bax"
    },
    {
        id: 3,
        name: "Shopen"
    }
];

app.get('/', (req, res)=>{
    res.send('Hello from API');
})

app.get('/artist', (req, res) =>{
    res.send(artist);
})

app.get('/artist/:id', (req, res) =>{
    let oneArtist = artist.find((artist)=>{
        return artist.id === Number(req.params.id)
        
    })
    res.send(oneArtist)
    
})

app.post('/artists', function (req, res) {
    const artist = {
      id: Date.now(),
      name: req.body.name
    };
    artists.push(artist);
    res.send(artist);
  })

app.put('/artist/:id', (req, res) =>{
    let upArtist = artist.find(artist =>{
        return artist.id === Number(req.params.id);
    })
    upArtist.name = req.body.name;
    res.send(upArtist);
})

app.delete('/artist/:id', (req, res) =>{
artist = artist.filter(artist =>{
        return artist.id !== Number(req.params.id)})
      res.send(artist)  
})

app.listen(3011, function () {
    console.log('API app started');
  })

