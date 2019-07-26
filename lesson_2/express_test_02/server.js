const express = require('express');  
const app = express();

app.get('/', (req, res) =>res.send(`<h1>Hello World!</h1>`));

// app.get('/home', (req, res) => res.send('home'));

// app.get('/contacts',  (req, res) => res.send('home'));
app.get('/users/:id&:name', (req,res) => {
	console.log(req.params);
res.send('Привет пользователь -' + req.params.id + '\n'+'имя тебя -' + req.params.name + '\n');
console.log('Привет пользователь -' + req.params.id + '\n'+'имя тебя -' + req.params.name + '\n');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));