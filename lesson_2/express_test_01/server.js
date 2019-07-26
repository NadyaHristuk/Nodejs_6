const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Главная страница"));
app.get("/home", (req, res) => res.send("Home page"));
app.get("/about", (req, res) => res.send("About page"));
app.get("/users/:id", (req, res) =>
  res.send(
    `Привет пользователь
 ` + req.params.id
  )
);

app.listen(3050);
