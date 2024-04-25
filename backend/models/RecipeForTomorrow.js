const mongoose = require("mongoose");

// Definicja schematu składnika
const userSchema = new mongoose.Schema({
  recipeForTomorrow: String,
});

const RecipeForTomorrow = mongoose.model("RecipeForTomorrow", userSchema);

module.exports = RecipeForTomorrow;
