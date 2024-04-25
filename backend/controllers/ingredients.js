const Ingredients = require("../models/Ingredients");

exports.getIngredients = async (request, response, next) => {
  try {
    let ingredients = await Ingredients.find();

    ingredients = ingredients.map((ingredient) => ingredient.ingredients);

    response.status(200).json({
      ingredients,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};
