const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  authors: [String],
  img: String,
  title: String,
  isAdmin: Boolean,
  visibility: Boolean,
  ingredients: [String],
  diet: String,
  description: String,
  ratings: [],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
