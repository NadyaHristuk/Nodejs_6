const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  login: { type: String },
  email: { type: String },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
