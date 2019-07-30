const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let db;
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

app.post('/artist', (req, res)=>{
    let newArtist = {       
        name: req.body.name
    }
    db.collection('artist').insert(newArtist, (err, result)=>{
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.res(result);
    })
    
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

MongoClient.connect('mongodb+srv://user:123@cluster0-jkmtu.mongodb.net/test?retryWrites=true&w=majority', (err, database) =>{
    if(err){
        return console.log('err from db');
    }

    db = database;
    app.listen(3001, ()=>console.log('Listen on port 3001'));
})

