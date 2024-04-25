const mongoose = require("mongoose");

// Definicja schematu składnika
const userSchema = new mongoose.Schema({
  ingredients: String,
});

const Ingredients = mongoose.model("Ingredients", userSchema);

module.exports = Ingredients;
