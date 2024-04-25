const Recipe = require("../models/Recipe");
const { fetchUserData, updateUserData } = require("./users");
const { fetchRecipeData } = require("./fetchRecipeData");
const { MongoClient } = require("mongodb");
const User = require("../models/User");

exports.getRecipes = async (request, response, next) => {
  try {
    const recipesData = await fetchRecipeData();
    response.status(200).json({
      recipes: recipesData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({
      error,
      message:
        "Oops! Something went wrong with GET method in /recipes endpoint",
    });
  }
};

exports.getRecipe = async (request, response, next) => {
  try {
    const { id } = request.params;
    const recipesData = await fetchRecipeData();
    const recipeToSend = recipesData.find((recipe) => recipe.id === id);

    if (!recipeToSend) {
      response.status(404).json({
        message: "Recipe with the given id not found",
      });
      return;
    }

    response.status(200).json({
      recipe: recipeToSend,
    });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({
      error,
      message:
        "Oops! Something went wrong with GET method in /recipes/:id endpoint",
    });
  }
};

exports.postRecipe = async (request, response, next) => {
  try {
    const {
      authors,
      img,
      title,
      isAdmin,
      visibility,
      description,
      ingredients,
    } = request.body;

    if (!authors || !title) {
      response.status(400).json({
        message: "Not all required information provided",
      });
      return;
    }

    const isRecipeExist = await Recipe.exists({ title });

    if (isRecipeExist) {
      response.status(409).json({
        message: `Recipe ${title} already exists in the database`,
      });
      return;
    }

    const newRecipe = new Recipe({
      authors,
      img,
      title,
      isAdmin,
      visibility,
      ingredients: ingredients,
      description,
    });

    await newRecipe.save();

    const updatedRecipesData = await fetchRecipeData();
    response.status(201).json({
      recipes: updatedRecipesData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({
      error,
      message:
        "Oops! Something went wrong with POST method in /recipes endpoint",
    });
  }
};

exports.putRecipe = async (request, response, next) => {
  try {
    const {
      authors,
      _id,
      title,
      isAdmin,
      visibility,
      description,
      ingredients,
    } = request.body;
    console.log("Received PUT request with data:", request.body);
    const updatedRecipe = {
      authors: authors,
      title: title,
      isAdmin: isAdmin,
      visibility: visibility,
      description,
      ingredients,
    };

    res = await Recipe.updateOne({ _id: _id }, updatedRecipe);

    const updatedRecipesData = await fetchRecipeData();
    response.status(202).json({
      recipes: updatedRecipesData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({
      error,
      message:
        "Oops! Something went wrong with PUT method in /recipes endpoint",
    });
  }
};

exports.deleteRecipe = async (request, response, next) => {
  try {
    const { id } = request.params;

    const isDeleted = await Recipe.deleteOne({ _id: id });

    if (!isDeleted) {
      response.status(404).json({
        message: "Recipe with the given id not found",
      });
      return;
    }

    const updatedRecipesData = await fetchRecipeData();
    response.status(200).json({
      recipes: updatedRecipesData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({
      error,
      message:
        "Oops! Something went wrong with DELETE method in /recipes/:id endpoint",
    });
  }
};

exports.deleteUserRecipe = async (request, response, next) => {
  try {
    const { login, recipeId } = request.body;
    let user;
    const usersData = await fetchUserData();

    try {
      user = usersData.find((u) => u.login === login);
    } catch (e) {
      return response.status(200).json({
        message: "Błąd podczas filtrowania użytkowników.",
      });
    }

    if (!user) {
      response.status(400).json({
        message: "Użytkownik o podanym identyfikatorze nie istnieje",
      });
      return;
    }

    // Sprawdź, czy przepis znajduje się w ulubionych przepisach użytkownika
    const index = user.recipes.findIndex((id) => id.toString() === recipeId);

    if (index === -1) {
      response.status(400).json({
        message:
          "Przepis o podanym identyfikatorze nie znajduje się w ulubionych przepisach użytkownika",
      });
      return;
    }

    // Usuń przepis z listy ulubionych przepisów użytkownika
    user.recipes.splice(index, 1);
    // Zaktualizuj dane użytkownika w bazie danych
    await updateUserData(user._id, user);

    response.status(200).json({
      message: "Przepis został usunięty z ulubionych przepisów użytkownika",
    });
  } catch (error) {
    response.status(500).json({
      error: error,
      message: "Wystąpił błąd podczas odlubiania przepisu przez użytkownika",
      czyUzytkownikZnaleziony: user !== undefined,
    });
  }
};

exports.getRecipesByIngredients = async (request, response, next) => {
  try {
    const ingredients = request.query.ingredient;
    if (ingredients === null) {
      response.status(200).json({
        recipes: [],
      });
    }
    const recipeData = await fetchRecipeData();
    let result = [];

    const containsCommonElement = (arr1, arr2) =>
      arr1.some((item) => arr2.includes(item));

    result = recipeData.filter((recipe) =>
      recipe?.ingredients
        ? containsCommonElement(recipe.ingredients, ingredients)
        : false
    );

    response.status(200).json({
      recipes: result,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};

exports.getRandomRecipe = async (request, response, next) => {
  try {
    const recipes = await fetchRecipeData();
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomElement = recipes[randomIndex];

    response.status(200).json({
      recipe: randomElement,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};

exports.rateRecipe = async (request, response, next) => {
  try {
    const { login, recipeId, rating } = request.body;
    const recipe = await Recipe.findOne({ _id: recipeId });

    if (!login) {
      response.status(400).json({
        message: "Niezalogowany użytkownik nie może dodać oceny.",
      });
    }

    if (!recipe?.ratings) {
      recipe.ratings = [];
    }

    const userReviewIndex = recipe.ratings.findIndex(
      (rating) => rating.login === login
    );

    if (userReviewIndex === -1) {
      recipe.ratings.push({ login, rating });
    } else {
      recipe.ratings[userReviewIndex].rating = rating;
    }
    await Recipe.updateOne({ _id: recipeId }, recipe);

    const average =
      recipe.ratings.reduce((acc, { rating }) => rating + acc, 0) /
      parseFloat(recipe.ratings.length);

    response.status(200).json({
      average: average,
      updatedRatings: recipe.ratings,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};

exports.getAvgRating = async (request, response, next) => {
  try {
    const recipeId = request.query.recipeId;
    const recipe = await Recipe.findOne({ _id: recipeId });
    const average =
      recipe.ratings.reduce((acc, { rating }) => rating + acc, 0) /
      parseFloat(recipe.ratings.length);

    response.status(200).json({
      average: average,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};

const uri = "mongodb://localhost:27017/recipeApp";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchCollection(collectionName) {
  try {
    await client.connect();

    const collection = client.db("recipeApp").collection(collectionName);
    const recipe = await collection.find({}).toArray();

    return recipe;
  } finally {
    await client.close();
  }
}

exports.getRecipeOfTheDay = async (request, response, next) => {
  try {
    const recipeOfTheDay = await fetchCollection("recipeOfTheDay");

    const recipe = await Recipe.findOne({
      _id: recipeOfTheDay[0].recipeOfTheDay,
    });

    response.status(200).json({
      recipe,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};

exports.getRecipeForTomorrowIngredients = async (request, response, next) => {
  try {
    const recipeForTomorrow = await fetchCollection("recipeForTomorrow");

    const recipe = await Recipe.findOne({
      _id: recipeForTomorrow[0].recipeForTomorrow,
    });

    response.status(200).json({
      ingredients: recipe.ingredients,
    });
  } catch (error) {
    response.status(500).json({
      error: error.message,
      message: "Wystąpił błąd.",
    });
  }
};
