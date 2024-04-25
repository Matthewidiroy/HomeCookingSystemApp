const mongoose = require("mongoose");

// Definicja schematu składnika
const userSchema = new mongoose.Schema({
  recipeOfTheDay: String,
});

const RecipeOfTheDay = mongoose.model("RecipeOfTheDay", userSchema);

module.exports = RecipeOfTheDay;
