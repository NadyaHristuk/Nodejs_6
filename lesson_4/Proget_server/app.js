const express = require("express");
const bodyParser = require("body-parser");
const routerUsers = require("./routes/user");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://bc7:123qwe@ds241489.mlab.com:41489/test_base");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api/user", routerUsers);

app.get("/", (req, res) => res.send("Hello!"));

app.use((req, res, next) => {
  res.status(404).json({ err: "404" });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ err: "500" });
});

app.listen(3024, function() {
  console.log("Server running. Use our API");
});
