const mongoose = require("mongoose");

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  accessLevel: Number,
  budget: Number,
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  login: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
