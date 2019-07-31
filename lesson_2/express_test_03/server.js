const express = require('express')
const app = express();

const PORT = process.env.PORT || 3000;
 
app.get('/', function (req, res) {
  res.send('Hello World +++')
})

app.get('/home', function (req, res) {
    res.send('home page +++')
  })

  app.get('/about', function (req, res) {
    res.send('about page +++')
  })  
 
  app.get('/users/', function (req, res) {
    res.send('Hello  -    ' + req.query.name + '   '+ req.query.age)
  })  

  

 


  app.use(function(req, res, next){
      let err = new Error ('not found');
      err.status = 404;
      next(err);
  })

  app.use(function(err, req, res, next){
      res.status(err.status || 500);
      res.send('error')
  })
app.listen(PORT, () =>{
    console.log('server is running on ' + PORT);
});