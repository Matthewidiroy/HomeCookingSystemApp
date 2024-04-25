const Recipe = require("../models/Recipe");

async function fetchRecipeData() {
  try {
    const recipesData = await Recipe.find();
    return recipesData;
  } catch (error) {
    console.error("Error fetching recipe data:", error);
    throw error;
  }
}

exports.fetchRecipeData = fetchRecipeData;
